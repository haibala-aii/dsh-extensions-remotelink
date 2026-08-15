import { createRequire } from "node:module";
import { setInterval as setInterval$1 } from "node:timers";
import { installSettingsSection, settingsNamespace } from "@deepseek-ai/dsh-settings";
import z from "schemastery";
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { RpcId } from "@deepseek-ai/dsh-host-apiproxy/api/rpc";
import { networkInterfaces } from "node:os";
import { Tunnel, bin, install } from "cloudflared";
import { dirname, join } from "node:path";
import { spawn } from "node:child_process";
//#region src/pairing.ts
/**
* Pairing state machine: one active one-time token, a device-session table,
* and presence tracking. Pure TypeScript with injected clock/randomness so
* the whole security semantics are unit-testable without cordis. The
* cordis-facing surfaces (routes, the api/gate listener) live next door.
*
* Security invariants:
* - One active token at a time; `issue()` replaces it, so a refreshed QR
*   immediately invalidates the previous link.
* - A token is consumed by the first successful `accept()` — reuse is
*   refused with `'used'`.
* - Tokens expire; `accept()` on an expired token is refused like an
*   unknown one (no oracle for validity).
* - `stop()` revokes every device session and clears the token, so paired
*   devices are cut off on their next gated request.
*/
/** Thrown by issue() for an address outside the sampled LAN literals. */
var UnknownLanAddressError = class extends Error {
	/**
	* @param address - the offending literal.
	*/
	constructor(address) {
		super(`remote-web-ui: unknown LAN address ${JSON.stringify(address)}`);
		this.name = "UnknownLanAddressError";
	}
};
/** Real clock/entropy: 32 random hex chars per token. */
const defaultClock = {
	now: () => Date.now(),
	randomToken: () => randomBytes(16).toString("hex")
};
/**
* The pairing state machine. All mutations notify state listeners after the
* commit point that makes them true, and notification dedupes against the
* last emitted snapshot — time-driven transitions (a device aging offline)
* surface on the next sweep without any mutation.
*/
var PairingService = class {
	config;
	clock;
	tokens = /* @__PURE__ */ new Map();
	devices = /* @__PURE__ */ new Map();
	listeners = /* @__PURE__ */ new Set();
	lastEmitted;
	stopped = false;
	tokenSerial = 0;
	/** LAN base URLs keyed by the advertised IP literal (interface order). */
	lanBases = /* @__PURE__ */ new Map();
	/** Public (tunneled) base URL, e.g. a Cloudflare Tunnel quick URL. */
	publicBase;
	/** Auto-tunnel status, while the auto-tunnel feature is active. */
	tunnelStatus;
	/**
	* @param config - tunables. The settings surface replaces the object (a
	* fresh literal) when a committed section changes; every operation reads
	* the current one.
	* @param clock - clock/entropy source (injectable for tests).
	*/
	constructor(config, clock = defaultClock) {
		this.config = config;
		this.clock = clock;
	}
	/** The default LAN base URL (the first interface; undefined when not LAN-reachable). */
	get lanBaseUrl() {
		return this.lanBases.values().next().value;
	}
	/** The LAN base URL for one specific literal (undefined when not constructible). */
	lanBaseUrlFor(address) {
		return this.lanBases.get(address);
	}
	/** The LAN IP literals QR links can be built from (interface order). */
	get lanAddresses() {
		return [...this.lanBases.keys()];
	}
	/** Set the LAN base URLs once the server bind is known (interface order). */
	setLanBases(entries) {
		this.lanBases = new Map(entries.map((entry) => [entry.address, entry.base]));
		this.notify();
	}
	/** The configured public (tunneled) base URL, when present. */
	get publicBaseUrl() {
		return this.publicBase;
	}
	/** Set or clear the public base URL (a tunnel in front of this server). */
	setPublicBaseUrl(url) {
		this.publicBase = url;
		this.notify();
	}
	/** Set or clear the auto-tunnel status frame (undefined when the feature is off). */
	setTunnelStatus(status) {
		this.tunnelStatus = status;
		this.notify();
	}
	/**
	* Issue a fresh token, replacing (invalidating) any previous one. A
	* stopped service re-arms through this call (the panel's refresh button).
	* @param workspaceId - optional workspace the QR link should land in.
	* @param address - optional LAN IP literal the QR must be built from; the
	* default is the public base (when configured) or the first interface.
	* Unknown addresses are refused.
	* @returns the token secret and its expiry.
	* @throws {Error} when no reachable base exists (no all-interfaces bind and
	* no public base) — callers surface this as the lan-required state instead
	* of minting an unusable QR.
	*/
	issue(workspaceId, address) {
		if (this.lanBases.size === 0 && this.publicBase === void 0) throw new Error("remote-web-ui: pairing requires a reachable bind (--host 0.0.0.0 or publicBaseUrl)");
		if (address !== void 0 && !this.lanBases.has(address)) throw new UnknownLanAddressError(address);
		const now = this.clock.now();
		const token = this.clock.randomToken();
		this.tokens.clear();
		this.stopped = false;
		this.tokenSerial += 1;
		this.tokens.set(token, {
			id: `t${this.tokenSerial}`,
			issuedAt: now,
			expiresAt: now + this.config.tokenTtlMs,
			consumed: false,
			...workspaceId !== void 0 ? { workspaceId } : {},
			...address !== void 0 ? { address } : {}
		});
		this.notify();
		return {
			token,
			expiresAt: now + this.config.tokenTtlMs
		};
	}
	/**
	* Consume a token and bind a device session. One-time: the second
	* successful call for the same token is impossible because the first
	* consumes it.
	* @param token - the token secret from the QR link.
	* @returns the new device id, or a refusal code.
	*/
	accept(token) {
		const record = this.tokens.get(token);
		if (record === void 0 || record.consumed || this.stopped || this.clock.now() > record.expiresAt) return {
			ok: false,
			code: record?.consumed === true ? "used" : "invalid"
		};
		record.consumed = true;
		const deviceId = this.clock.randomToken();
		const now = this.clock.now();
		if (this.devices.size >= this.config.maxDevices) {
			let oldest;
			for (const [id, session] of this.devices) if (oldest === void 0 || session.createdAt < oldest.createdAt) oldest = {
				id,
				createdAt: session.createdAt
			};
			if (oldest !== void 0) this.devices.delete(oldest.id);
		}
		this.devices.set(deviceId, {
			createdAt: now,
			lastSeenAt: now
		});
		this.notify();
		return {
			ok: true,
			deviceId
		};
	}
	/**
	* Stop remote control: revoke every device session and clear the token.
	* The phone's next gated /api request 403s; the panel falls back to
	* stopped until a fresh QR is issued.
	*/
	stop() {
		this.tokens.clear();
		this.devices.clear();
		this.stopped = true;
		this.notify();
	}
	/**
	* The api/gate path: record activity for a device id and report whether
	* the request may proceed. Unknown or revoked ids (including any device
	* after stop()) are refused.
	* @param deviceId - the cookie value of the requesting device.
	* @returns true when the device session is live and was refreshed.
	*/
	touchDevice(deviceId) {
		const session = this.devices.get(deviceId);
		if (session === void 0 || this.stopped) return false;
		session.lastSeenAt = this.clock.now();
		this.notify();
		return true;
	}
	/** Explicit presence heartbeat (the phone's client sends these). */
	heartbeat(deviceId) {
		return this.touchDevice(deviceId);
	}
	/**
	* Periodic sweep: re-evaluate the derived snapshot (a device aging past
	* the offline window flips the phase to disconnected). Emits only when
	* the snapshot actually changed.
	*/
	sweep() {
		this.notify();
	}
	/** The current snapshot (fresh object per call — stable between emits). */
	snapshot() {
		const now = this.clock.now();
		const onlineCount = [...this.devices.values()].filter((session) => this.isOnlineAt(session, now)).length;
		const token = this.activeToken();
		return {
			phase: this.derivePhase(onlineCount, token !== void 0),
			lanAvailable: this.lanBases.size > 0,
			lanAddresses: [...this.lanBases.keys()],
			...this.publicBase !== void 0 ? { publicUrl: this.publicBase } : {},
			...this.tunnelStatus !== void 0 ? { tunnel: this.tunnelStatus } : {},
			...token !== void 0 ? {
				tokenId: token.record.id,
				tokenExpiresAt: token.record.expiresAt
			} : {},
			deviceCount: this.devices.size,
			onlineCount
		};
	}
	/** Whether a cookie value names a currently live device session. */
	hasDevice(deviceId) {
		return this.devices.get(deviceId) !== void 0 && !this.stopped;
	}
	/** Subscribe to snapshot changes (each emit passes a fresh snapshot). */
	onState(listener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
	activeToken() {
		for (const [token, record] of this.tokens) {
			if (this.stopped) return void 0;
			if (this.clock.now() > record.expiresAt) continue;
			return {
				token,
				record
			};
		}
	}
	derivePhase(onlineCount, hasToken) {
		if (this.lanBases.size === 0 && this.publicBase === void 0) return "lan-required";
		if (this.stopped) return "stopped";
		if (onlineCount > 0) return "connected";
		if (this.devices.size > 0) return "disconnected";
		if (hasToken) return "waiting";
		return "stopped";
	}
	isOnlineAt(session, now) {
		return now - session.lastSeenAt <= this.config.offlineAfterMs;
	}
	notify() {
		const snapshot = this.snapshot();
		if (this.lastEmitted !== void 0 && snapshotsEqual(this.lastEmitted, snapshot)) return;
		this.lastEmitted = snapshot;
		for (const listener of this.listeners) try {
			listener(snapshot);
		} catch (error) {
			console.error("remote-web-ui: pairing state listener failed", error);
		}
	}
};
/** Structural equality over the snapshot's wire fields. */
function snapshotsEqual(a, b) {
	return a.phase === b.phase && a.lanAvailable === b.lanAvailable && sameStrings(a.lanAddresses, b.lanAddresses) && a.publicUrl === b.publicUrl && tunnelEqual(a.tunnel, b.tunnel) && a.tokenId === b.tokenId && a.tokenExpiresAt === b.tokenExpiresAt && a.deviceCount === b.deviceCount && a.onlineCount === b.onlineCount;
}
/** Tunnel frame equality (undefined equals undefined; fields compared shallowly). */
function tunnelEqual(a, b) {
	return a === b || a !== void 0 && b !== void 0 && a.state === b.state && a.url === b.url && a.error === b.error;
}
/** Element-wise string list equality (interface order is meaningful). */
function sameStrings(a, b) {
	return a.length === b.length && a.every((value, index) => value === b[index]);
}
//#endregion
//#region src/gate.ts
/**
* Whether a normalized URL hostname names the local loopback authority.
* Semantics mirror the connection package's internal predicate (localhost,
* IPv6 loopback, any IPv4 address in 127/8); it is reimplemented here because
* the connection package no longer exports it — the fence now lives inside
* the connection plugin, and external host plugins only need the
* classification, not the whole trust decision.
* @param hostname - WHATWG URL hostname (IPv6 literals retain brackets).
* @returns true for localhost, IPv6 loopback, or any IPv4 address in 127/8.
*/
function isLoopbackHostname(hostname) {
	if (hostname === "localhost" || hostname === "[::1]") return true;
	const parts = hostname.split(".");
	return parts.length === 4 && parts[0] === "127" && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
/** Whether a socket remote address names the loopback range (127/8, ::1, IPv4-mapped). */
function isLoopbackAddress(address) {
	if (address === void 0) return false;
	const normalized = address.toLowerCase();
	if (normalized === "::1") return true;
	if (normalized.startsWith("::ffff:")) return isIPv4Loopback(normalized.slice(7));
	return isIPv4Loopback(normalized);
}
/** IPv4 127/8 predicate (four decimal octets, first == 127). */
function isIPv4Loopback(v4) {
	const parts = v4.split(".");
	return parts.length === 4 && parts[0] === "127" && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
/**
* Read one cookie value from a Cookie header.
* @param header - the raw Cookie header value (or undefined).
* @param name - the cookie name.
* @returns the value, or undefined when absent.
*/
function readCookie(header, name) {
	if (header === void 0) return void 0;
	for (const part of header.split(";")) {
		const eq = part.indexOf("=");
		if (eq < 0) continue;
		if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
	}
}
/**
* The effective Host hostname of a request.
* @param request - node HTTP request.
* @returns the normalized hostname, or undefined when unparsable.
*/
function hostnameOf(request) {
	const host = request.headers.host;
	if (typeof host !== "string") return void 0;
	try {
		return new URL(`http://${host}`).hostname;
	} catch {
		return;
	}
}
/** Whether a request comes from the desktop loopback client (loopback socket AND loopback Host). */
function isLoopbackClient(request) {
	const hostname = hostnameOf(request);
	if (hostname === void 0 || !isLoopbackHostname(hostname)) return false;
	const socket = request.socket;
	return isLoopbackAddress(socket?.remoteAddress);
}
/**
* Build the api/gate listener for one pairing service.
* @param service - the pairing service.
* @param requirePairingForLan - when false, non-loopback requests pass
* without a device cookie (the feature then only manages tokens/status;
* revocation of paired devices still holds). A function is re-read per
* request, so a settings edit takes effect without a restart. Defaults to true.
* @param enabled - when false, every non-loopback request is vetoed while
* loopback stays available. A function is re-read per request so the fence
* stays mounted for the plugin lifetime and disabling the plugin cannot open
* a LAN-exposed /api. Defaults to true.
* @returns the cordis waterfall listener: call `next()` to delegate,
* return false (without calling it) to veto with 403.
*/
function makeGateListener(service, requirePairingForLan = true, enabled = true) {
	return (request, _method, next) => {
		if (isLoopbackClient(request)) return next();
		if (!(typeof enabled === "function" ? enabled() : enabled)) return false;
		if (!(typeof requirePairingForLan === "function" ? requirePairingForLan() : requirePairingForLan)) return next();
		const deviceId = readCookie(request.headers.cookie, service.config.cookieName);
		if (deviceId === void 0) return false;
		return service.touchDevice(deviceId) ? next() : false;
	};
}
//#endregion
//#region src/routes.ts
/**
* Browser-trust fence for the /api/pair routes, mirroring the connection
* package's internal fence semantics (Host/Origin based, DNS-rebinding and
* cross-site defense). The connection package no longer exports its trust
* predicate — the fence for the /api prefix lives inside the connection
* plugin — so the pairing routes, which must stay reachable from LAN phones
* ahead of the connection prefix route (exact routes match first), carry
* their own copy scoped to the literals the QR links advertise.
* @param request - the node HTTP request.
* @param trustedHosts - non-loopback authorities this surface serves: exact
* `host:port`, or port-less `host` matching any port.
* @returns true when the Host is ours (loopback or trusted) and any attached
* browser markers are same-origin.
*/
function isTrustedApiRequest(request, trustedHosts) {
	const host = request.headers.host;
	if (typeof host !== "string") return false;
	let hostUrl;
	try {
		hostUrl = new URL(`http://${host}`);
	} catch {
		return false;
	}
	const hostname = hostUrl.hostname;
	if (!(isLoopbackClient(request) || trustedHosts.some((entry) => {
		const entryUrl = new URL(`http://${entry}`);
		return entryUrl.port === "" ? entryUrl.hostname === hostname : entryUrl.host === hostUrl.host;
	}))) return false;
	if (request.headers["sec-fetch-site"] === "cross-site") return false;
	const origin = request.headers.origin;
	if (origin === void 0) return true;
	try {
		return new URL(origin).host === hostUrl.host;
	} catch {
		return false;
	}
}
/** Cap on pairing request bodies (tokens and workspace ids are tiny). */
const MAX_BODY_BYTES = 4096;
/**
* The host authority of a configured public base URL, e.g. `foo.trycloudflare.com`
* from `https://foo.trycloudflare.com`. Undefined when the URL does not parse —
* a malformed config then simply contributes no fence entry (and the panel
* falls back to LAN-only URLs).
* @param url - the configured public base URL (or undefined).
* @returns the `host[:port]` authority the fence should trust.
*/
function publicHostOf(url) {
	if (url === void 0) return void 0;
	try {
		return new URL(url).host;
	} catch {
		return;
	}
}
/** Cookie lifetime: one year; revoked sessions die at the gate regardless. */
const COOKIE_MAX_AGE_SEC = 365 * 24 * 60 * 60;
/** Route paths (exact matches under /api). */
const PAIR_PATHS = {
	issue: "/api/pair/issue",
	accept: "/api/pair/accept",
	stop: "/api/pair/stop",
	heartbeat: "/api/pair/heartbeat",
	status: "/api/pair/status",
	events: "/api/pair/events"
};
/** One JSON response. */
function writeJson$1(res, status, body) {
	const payload = JSON.stringify(body);
	res.writeHead(status, {
		"content-type": "application/json; charset=utf-8",
		"referrer-policy": "no-referrer"
	});
	res.end(payload);
}
/** Read a request body up to MAX_BODY_BYTES and parse it as JSON. */
async function readJsonBody$1(req) {
	const chunks = [];
	let size = 0;
	for await (const chunk of req) {
		const buffer = chunk;
		size += buffer.length;
		if (size > MAX_BODY_BYTES) return void 0;
		chunks.push(buffer);
	}
	try {
		const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
		return typeof parsed === "object" && parsed !== null ? parsed : void 0;
	} catch {
		return;
	}
}
/** The SSE fan-out for desktop panel status. */
var PairingEventsStream = class {
	streams = /* @__PURE__ */ new Set();
	/**
	* @param service - the pairing service whose snapshots are fanned out.
	*/
	constructor(service) {
		service.onState((snapshot) => {
			this.push(snapshot);
		});
	}
	/** Open one stream; the response is owned to completion. */
	open(req, res) {
		res.writeHead(200, {
			"content-type": "text/event-stream; charset=utf-8",
			"cache-control": "no-cache",
			connection: "keep-alive"
		});
		const stream = {
			res,
			closed: false
		};
		this.streams.add(stream);
		const close = () => {
			if (stream.closed) return;
			stream.closed = true;
			this.streams.delete(stream);
		};
		res.on("close", close);
		req.on("close", close);
	}
	/** Push one frame to every open stream (contained per stream). */
	push(snapshot) {
		const frame = `data: ${JSON.stringify({
			type: "state",
			...snapshot
		})}\n\n`;
		for (const stream of this.streams) try {
			stream.res.write(frame);
		} catch {
			stream.closed = true;
			this.streams.delete(stream);
		}
	}
	/** Stream count (tests/diagnostics). */
	get size() {
		return this.streams.size;
	}
};
/**
* Build the /api/pair route family.
* @param deps - service + fence inputs.
* @returns the exact routes to register on webServer.
*/
function makeRoutes(deps) {
	const { service, lanAddresses } = deps;
	const events = new PairingEventsStream(service);
	/** Loopback-only fence: the desktop panel's control endpoints. */
	const loopbackFence = (req) => isTrustedApiRequest(req, []);
	/** Phone-facing fence: loopback, the derived LAN literals, or the configured public host. */
	const lanFence = (req) => {
		const publicHost = publicHostOf(service.publicBaseUrl);
		return isTrustedApiRequest(req, publicHost === void 0 ? lanAddresses : [...lanAddresses, publicHost]);
	};
	const requireMethod = (req, res, method) => {
		if (req.method === method) return true;
		res.writeHead(405);
		res.end();
		return false;
	};
	/** Per-source-IP accept rate limit (brute-force defense in depth). */
	const acceptAttempts = /* @__PURE__ */ new Map();
	const ACCEPT_MAX_ATTEMPTS = 10;
	const ACCEPT_WINDOW_MS = 3e4;
	const rateLimitAccept = (req) => {
		const ip = req.socket?.remoteAddress ?? "unknown";
		const nowMs = Date.now();
		const entry = acceptAttempts.get(ip);
		if (entry === void 0 || nowMs - entry.windowStart > ACCEPT_WINDOW_MS) {
			acceptAttempts.set(ip, {
				count: 1,
				windowStart: nowMs
			});
			return false;
		}
		entry.count += 1;
		return entry.count > ACCEPT_MAX_ATTEMPTS;
	};
	const handleIssue = async (req, res) => {
		if (!requireMethod(req, res, "POST")) return;
		if (!loopbackFence(req)) {
			writeJson$1(res, 403, {
				ok: false,
				code: "forbidden"
			});
			return;
		}
		const body = await readJsonBody$1(req);
		const workspaceId = body === void 0 || typeof body.workspaceId !== "string" || body.workspaceId === "" ? void 0 : body.workspaceId;
		const address = body === void 0 || typeof body.address !== "string" || body.address === "" ? void 0 : body.address;
		try {
			const { token, expiresAt } = service.issue(workspaceId, address);
			const base = address === void 0 ? service.publicBaseUrl ?? service.lanBaseUrl : service.lanBaseUrlFor(address);
			if (base === void 0) throw new Error("remote-web-ui: base unavailable");
			writeJson$1(res, 200, {
				ok: true,
				url: `${base}/?pair=${token}${workspaceId === void 0 ? "" : `&workspace=${encodeURIComponent(workspaceId)}`}`,
				token,
				expiresAt,
				lanAddresses: service.lanAddresses,
				...service.publicBaseUrl !== void 0 ? { publicBaseUrl: service.publicBaseUrl } : {}
			});
		} catch (error) {
			const unknownAddress = error instanceof UnknownLanAddressError;
			writeJson$1(res, unknownAddress ? 400 : 409, {
				ok: false,
				code: unknownAddress ? "unknown-address" : "lan-required"
			});
		}
	};
	const handleAccept = async (req, res) => {
		if (!requireMethod(req, res, "POST")) return;
		if (!lanFence(req)) {
			writeJson$1(res, 403, {
				ok: false,
				code: "forbidden"
			});
			return;
		}
		if (rateLimitAccept(req)) {
			writeJson$1(res, 429, {
				ok: false,
				code: "rate-limited"
			});
			return;
		}
		const body = await readJsonBody$1(req);
		const token = typeof body?.token === "string" ? body.token : "";
		const result = service.accept(token);
		if (!result.ok) {
			writeJson$1(res, result.code === "used" ? 409 : 404, {
				ok: false,
				code: result.code
			});
			return;
		}
		res.writeHead(200, {
			"content-type": "application/json; charset=utf-8",
			"set-cookie": [`${service.config.cookieName}=${result.deviceId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${String(COOKIE_MAX_AGE_SEC)}`]
		});
		res.end(JSON.stringify({
			ok: true,
			deviceId: result.deviceId
		}));
	};
	const handleStop = async (req, res) => {
		if (!requireMethod(req, res, "POST")) return;
		if (!loopbackFence(req)) {
			writeJson$1(res, 403, {
				ok: false,
				code: "forbidden"
			});
			return;
		}
		await readJsonBody$1(req);
		service.stop();
		writeJson$1(res, 200, { ok: true });
	};
	const handleHeartbeat = async (req, res) => {
		if (!requireMethod(req, res, "POST")) return;
		if (!lanFence(req)) {
			writeJson$1(res, 403, {
				ok: false,
				code: "forbidden"
			});
			return;
		}
		await readJsonBody$1(req);
		const deviceId = readCookie(req.headers.cookie, service.config.cookieName);
		if (deviceId === void 0 || !service.heartbeat(deviceId)) {
			writeJson$1(res, 401, {
				ok: false,
				code: "unpaired"
			});
			return;
		}
		writeJson$1(res, 200, { ok: true });
	};
	const handleStatus = async (req, res) => {
		if (!requireMethod(req, res, "GET")) return;
		if (!lanFence(req)) {
			writeJson$1(res, 403, {
				ok: false,
				code: "forbidden"
			});
			return;
		}
		const deviceId = readCookie(req.headers.cookie, service.config.cookieName);
		writeJson$1(res, 200, {
			ok: true,
			paired: deviceId !== void 0 && service.hasDevice(deviceId),
			...service.snapshot()
		});
	};
	const handleEvents = (req, res) => {
		if (!requireMethod(req, res, "GET")) return;
		if (!loopbackFence(req)) {
			writeJson$1(res, 403, {
				ok: false,
				code: "forbidden"
			});
			return;
		}
		events.open(req, res);
		events.push(service.snapshot());
	};
	return [
		{
			kind: "exact",
			path: PAIR_PATHS.issue,
			handler: handleIssue
		},
		{
			kind: "exact",
			path: PAIR_PATHS.accept,
			handler: handleAccept
		},
		{
			kind: "exact",
			path: PAIR_PATHS.stop,
			handler: handleStop
		},
		{
			kind: "exact",
			path: PAIR_PATHS.heartbeat,
			handler: handleHeartbeat
		},
		{
			kind: "exact",
			path: PAIR_PATHS.status,
			handler: handleStatus
		},
		{
			kind: "exact",
			path: PAIR_PATHS.events,
			handler: handleEvents
		}
	];
}
//#endregion
//#region src/mobile-routes.ts
/**
* The mobile surface's page routes: `/m` serves the standalone phone UI
* (an independent bundle, built to lib/mobile.js by the mobile tsdown
* entry), `/m/mobile.js` serves the bundle itself. The page talks to the
* host exclusively through the shared /api transport (paired-device cookie
* already crosses the api/gate fence), so no host-side data plumbing is
* needed here — only static serving, loopback+paired-fence via the normal
* webserver route registration.
*/
/** The standalone mobile bundle (built artifact, next to this file's own lib output). */
function mobileBundlePath() {
	return fileURLToPath(new URL("../lib/mobile.js", import.meta.url));
}
/** The mobile page shell: minimal, offline-safe, no external assets. */
function pageHtml(bundleUrl) {
	return [
		"<!doctype html>",
		"<html lang=\"zh-CN\">",
		"<head>",
		"<meta charset=\"utf-8\">",
		"<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover\">",
		"<meta name=\"theme-color\" content=\"#f3f5f9\">",
		"<meta name=\"referrer\" content=\"no-referrer\">",
		"<title>移动端远程控制</title>",
		"</head>",
		"<body>",
		"<div id=\"root\"></div>",
		`<script type="module" src="${bundleUrl}"><\/script>`,
		"</body>",
		"</html>"
	].join("");
}
/** Send a small static body with cache headers (the bundle is content-hashed by rebuild). */
function writeStatic(res, status, type, body) {
	res.writeHead(status, {
		"content-type": `${type}; charset=utf-8`,
		"cache-control": "no-cache",
		"referrer-policy": "no-referrer"
	});
	res.end(body);
}
/**
* Build the mobile page routes.
* @returns the two exact routes to register on webServer.
*/
function makeMobileRoutes() {
	const handlePage = (_req, res) => {
		writeStatic(res, 200, "text/html", pageHtml("/m/mobile.js"));
	};
	const handleBundle = async (_req, res) => {
		const path = mobileBundlePath();
		if (!existsSync(path)) {
			writeStatic(res, 503, "text/plain", "mobile bundle not built: run pnpm --filter @haibala/dsh-remote-web-ui build");
			return;
		}
		try {
			writeStatic(res, 200, "text/javascript", await readFile(path, "utf8"));
		} catch {
			writeStatic(res, 500, "text/plain", "failed to read the mobile bundle");
		}
	};
	return [{
		kind: "exact",
		path: "/m",
		handler: handlePage
	}, {
		kind: "exact",
		path: "/m/mobile.js",
		handler: handleBundle
	}];
}
//#endregion
//#region src/mobile-api.ts
/** Methods the phone surface may call. Everything else is refused. */
const MOBILE_ALLOWLIST = /* @__PURE__ */ new Set([
	"workspace.list",
	"session.create",
	"session.list",
	"session.history",
	"session.search",
	"session.prompt",
	"session.models",
	"session.selectModel",
	"session.rename"
]);
/** One session.list page (thin phones load incrementally). */
const SESSION_PAGE_SIZE = 20;
/** Encode one list position as an opaque continuation cursor. */
function sessionListCursor(updatedAt, sessionId) {
	return `${updatedAt}:${sessionId}`;
}
/** Parse a cursor; malformed cursors mean "start over" (safe failure mode). */
function parseSessionListCursor(cursor) {
	const separator = cursor.indexOf(":");
	if (separator < 0) return void 0;
	const updatedAt = Number(cursor.slice(0, separator));
	if (!Number.isFinite(updatedAt)) return void 0;
	return {
		updatedAt,
		sessionId: cursor.slice(separator + 1)
	};
}
/** Whether a row comes strictly after the cursor position. */
function afterCursor(row, position) {
	return row.updatedAt < position.updatedAt || row.updatedAt === position.updatedAt && row.sessionId > position.sessionId;
}
/** Mobile API route paths. */
const MOBILE_API_PATHS = { events: "/m/api/events.mux" };
/** The mobile-api prefix (every other path under it is a method name). */
const MOBILE_API_PREFIX = "/m/api";
/** Method extraction: the prefix plus one slash. */
const MOBILE_API_METHOD_PREFIX = `${MOBILE_API_PREFIX}/`;
/**
* Build the mobile data-channel routes.
* @param deps - pairing service + apiProxy.
* @returns the routes to register on webServer.
*/
function makeMobileApiRoutes(deps) {
	const { service, apiProxy } = deps;
	/** The phone gate: a live paired-device cookie, or nothing else proceeds. */
	const gateOk = (req) => {
		const deviceId = readCookie(req.headers.cookie, service.config.cookieName);
		return deviceId !== void 0 && service.hasDevice(deviceId);
	};
	const writeJson = (res, status, body) => {
		res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
		res.end(JSON.stringify(body));
	};
	const handleMethod = async (req, res) => {
		if (req.method !== "POST") {
			res.writeHead(405);
			res.end();
			return;
		}
		if (!gateOk(req)) {
			writeJson(res, 403, {
				ok: false,
				error: {
					code: "unpaired",
					message: "mobile session is not paired"
				}
			});
			return;
		}
		const pathname = new URL(req.url ?? "/", "http://x").pathname;
		if (!pathname.startsWith(MOBILE_API_METHOD_PREFIX)) {
			writeJson(res, 404, {
				ok: false,
				error: {
					code: "not-found",
					message: "unknown mobile api path"
				}
			});
			return;
		}
		const method = pathname.slice(MOBILE_API_METHOD_PREFIX.length);
		if (!MOBILE_ALLOWLIST.has(method)) {
			writeJson(res, 403, {
				ok: false,
				error: {
					code: "forbidden",
					message: `method ${method} is not exposed to the mobile surface`
				}
			});
			return;
		}
		let envelope;
		try {
			envelope = await readJsonBody(req);
		} catch {
			writeJson(res, 400, {
				ok: false,
				error: {
					code: "bad-request",
					message: "invalid json body"
				}
			});
			return;
		}
		const parsed = envelope;
		const rpcId = typeof parsed?.rpcId === "string" ? parsed.rpcId : "";
		if (rpcId === "") {
			writeJson(res, 400, {
				ok: false,
				error: {
					code: "bad-request",
					message: "missing rpcId"
				}
			});
			return;
		}
		try {
			const response = await dispatch(apiProxy, method, parsed?.payload, rpcId);
			writeJson(res, 200, response);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			writeJson(res, 200, {
				type: "server-response",
				rpcId,
				result: {
					ok: false,
					error: {
						code: "internal",
						message
					}
				}
			});
		}
	};
	/** Bridge the host mux stream over SSE: one `data:` frame per mux frame. */
	const handleEvents = async (req, res) => {
		if (req.method !== "GET") {
			res.writeHead(405);
			res.end();
			return;
		}
		if (!gateOk(req)) {
			res.writeHead(403);
			res.end("forbidden");
			return;
		}
		res.writeHead(200, {
			"content-type": "text/event-stream; charset=utf-8",
			"cache-control": "no-cache",
			connection: "keep-alive"
		});
		const controller = new AbortController();
		let closed = false;
		const heartbeat = setInterval(() => {
			if (closed) return;
			try {
				res.write(": ping\n\n");
			} catch {}
		}, 15e3);
		const onClose = () => {
			if (closed) return;
			closed = true;
			controller.abort();
			clearInterval(heartbeat);
		};
		res.on("close", onClose);
		req.on("close", onClose);
		try {
			const frames = apiProxy.events.mux({
				rpcId: RpcId(`mobile-mux-${Date.now().toString(36)}`),
				payload: {}
			}, controller.signal);
			for await (const frame of frames) {
				if (closed) break;
				res.write(`data: ${JSON.stringify(frame)}\n\n`);
			}
		} catch {} finally {
			controller.abort();
			clearInterval(heartbeat);
		}
		if (!closed) res.end();
	};
	return [{
		kind: "prefix",
		path: MOBILE_API_PREFIX,
		handler: handleMethod
	}, {
		kind: "exact",
		path: MOBILE_API_PATHS.events,
		handler: handleEvents
	}];
}
/** Read a request body as JSON (bounded). */
async function readJsonBody(req) {
	const chunks = [];
	let size = 0;
	for await (const chunk of req) {
		const buffer = chunk;
		size += buffer.length;
		if (size > 64 * 1024) throw new Error("body too large");
		chunks.push(buffer);
	}
	return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
/** Dispatch one allowlisted method through the host ApiProxy. */
async function dispatch(apiProxy, method, payload, rpcId) {
	const request = {
		rpcId: RpcId(rpcId),
		payload
	};
	if (method === "session.list") {
		const full = await apiProxy.sessions.list(request);
		if (!full.result.ok) return full;
		const items = full.result.value.items;
		const cursor = payload?.cursor;
		items.sort((a, b) => b.updatedAt - a.updatedAt || (a.sessionId < b.sessionId ? -1 : a.sessionId > b.sessionId ? 1 : 0));
		const position = cursor === void 0 ? void 0 : parseSessionListCursor(cursor);
		const from = position === void 0 ? 0 : items.findIndex((row) => afterCursor(row, position));
		const start = from < 0 ? items.length : from;
		const page = items.slice(start, start + SESSION_PAGE_SIZE);
		const last = page[page.length - 1];
		const nextCursor = last !== void 0 && start + page.length < items.length ? sessionListCursor(last.updatedAt, last.sessionId) : void 0;
		return {
			type: "server-response",
			rpcId,
			result: {
				ok: true,
				value: {
					items: page,
					hasMore: nextCursor !== void 0,
					...nextCursor !== void 0 ? { nextCursor } : {}
				}
			}
		};
	}
	const wrap = (response) => ({
		type: "server-response",
		rpcId,
		result: response.result
	});
	if (method === "workspace.list") return wrap(await apiProxy.workspace.list(request));
	if (method === "session.create") return wrap(await apiProxy.sessions.create(request));
	if (method === "session.history") return wrap(await apiProxy.sessions.history(request));
	if (method === "session.search") return wrap(await apiProxy.sessions.search(request, new AbortController().signal));
	if (method === "session.prompt") return wrap(await apiProxy.sessions.prompt(request));
	if (method === "session.models") return wrap(await apiProxy.sessions.models(request));
	if (method === "session.selectModel") return wrap(await apiProxy.sessions.selectModel(request));
	if (method === "session.rename") return wrap(await apiProxy.sessions.rename(request));
	throw new Error(`unhandled allowlisted method ${method}`);
}
//#endregion
//#region src/lan.ts
/**
* LAN address derivation for the pairing URLs. Mirrors the dsh CLI's
* boot-time sampling (apps/cli/src/app-cli-entry.ts `resolveLanTrust`): the
* pairing links may only name addresses the /api trust fence was configured
* with, so the same non-internal IPv4 derivation applies here — an external
* plugin cannot read the CLI's sampled snapshot, but the fence accepts
* exactly these literals, which is the property that matters.
*/
/**
* Non-internal IPv4 interface addresses of this machine — the IP-literal
* authorities an all-interfaces bind is reachable by on the LAN.
* @returns the addresses in interface order (possibly empty).
*/
function lanIPv4Addresses() {
	return Object.values(networkInterfaces()).flat().filter((iface) => {
		return iface !== void 0 && iface.family === "IPv4" && !iface.internal;
	}).map((iface) => iface.address);
}
//#endregion
//#region src/tunnel.ts
/**
* Auto-tunnel manager: spawns a Cloudflare quick tunnel (`cloudflared
* tunnel --url <local>`) through the `cloudflared` npm package — its
* postinstall downloads the platform binary, so no user-side tooling is
* involved — surfaces the minted `https://xxx.trycloudflare.com` URL, and
* restarts the process after unexpected exits with exponential backoff.
*
* The cloudflared package's Tunnel is a thin spawn wrapper; this manager
* owns the lifecycle policy (binary readiness, URL timeout, restart
* backoff) around it. All seams — the tunnel factory, binary readiness,
* timers — are injectable so the whole lifecycle is unit-testable without
* a real binary or network.
*/
/** Default binary readiness: download the platform binary on first use. */
async function defaultEnsureBinary() {
	if (existsSync(bin)) return;
	await install(bin);
}
/** Default factory: the cloudflared package's quick tunnel (no account). */
function defaultFactory(targetUrl) {
	return Tunnel.quick(targetUrl, { "--no-autoupdate": true });
}
/** Node timers. */
const nodeTimer = {
	setTimeout,
	clearTimeout
};
/**
* Own the lifecycle of one auto-tunnel: start/stop, URL surfacing, and
* crash-restart backoff.
*/
var TunnelManager = class {
	factory;
	ensureBinary;
	urlTimeoutMs;
	restartBaseMs;
	restartMaxMs;
	timer;
	phase = "stopped";
	url;
	error;
	targetUrl;
	handle;
	urlTimer;
	restartTimer;
	attempts = 0;
	stopping = false;
	urlListeners = /* @__PURE__ */ new Set();
	phaseListeners = /* @__PURE__ */ new Set();
	/**
	* @param options - seams; defaults spawn the real quick tunnel.
	*/
	constructor(options = {}) {
		this.factory = options.factory ?? defaultFactory;
		this.ensureBinary = options.ensureBinary ?? defaultEnsureBinary;
		this.urlTimeoutMs = options.urlTimeoutMs ?? 3e4;
		this.restartBaseMs = options.restartBaseMs ?? 5e3;
		this.restartMaxMs = options.restartMaxMs ?? 6e4;
		this.timer = options.timer ?? nodeTimer;
	}
	/** The current status frame. */
	get info() {
		return {
			phase: this.phase,
			...this.url !== void 0 ? { url: this.url } : {},
			...this.error !== void 0 ? { error: this.error } : {}
		};
	}
	/**
	* Start (or keep) a quick tunnel toward `targetUrl`. Restarting with a
	* different target tears the old tunnel down first; restarting with the
	* same target while running is a no-op.
	* @param targetUrl - the local URL to expose, e.g. `http://127.0.0.1:3080`.
	*/
	start(targetUrl) {
		if (this.targetUrl === targetUrl && (this.phase === "starting" || this.phase === "running")) return;
		this.teardown();
		this.stopping = false;
		this.targetUrl = targetUrl;
		this.attempts = 0;
		this.attempt();
	}
	/** Stop the tunnel for good: no restarts, no state. */
	stop() {
		this.teardown();
		this.stopping = false;
		this.targetUrl = void 0;
		this.setPhase("stopped");
	}
	/** Alias of {@link stop} for plugin-effect disposal. */
	dispose() {
		this.stop();
	}
	/** Subscribe to minted tunnel URLs (fire-and-forget duplicates dropped). */
	onUrl(listener) {
		this.urlListeners.add(listener);
		return () => {
			this.urlListeners.delete(listener);
		};
	}
	/** Subscribe to every phase change. */
	onPhase(listener) {
		this.phaseListeners.add(listener);
		return () => {
			this.phaseListeners.delete(listener);
		};
	}
	attempt() {
		if (this.stopping || this.targetUrl === void 0) return;
		this.setPhase("starting");
		this.handle = void 0;
		this.url = void 0;
		this.error = void 0;
		this.ensureBinary().then(() => {
			if (this.stopping || this.targetUrl === void 0) return;
			const handle = this.factory(this.targetUrl);
			this.handle = handle;
			this.urlTimer = this.timer.setTimeout(() => {
				this.fail("timed out waiting for the tunnel URL");
			}, this.urlTimeoutMs);
			handle.on("url", (value) => {
				if (this.handle !== handle) return;
				this.handleUrl(value);
			});
			handle.on("exit", () => {
				if (this.handle !== handle) return;
				this.handleExit();
			});
			handle.on("error", (value) => {
				if (this.handle !== handle || this.phase !== "starting") return;
				this.error = value instanceof Error ? value.message : String(value);
			});
		}).catch((value) => {
			if (this.stopping || this.targetUrl === void 0) return;
			const message = value instanceof Error ? value.message : String(value);
			this.fail(`could not obtain the cloudflared binary: ${message}`);
		});
	}
	handleUrl(value) {
		if (this.urlTimer !== void 0) {
			this.timer.clearTimeout(this.urlTimer);
			this.urlTimer = void 0;
		}
		this.url = value;
		this.error = void 0;
		this.attempts = 0;
		this.setPhase("running");
		for (const listener of this.urlListeners) try {
			listener(value);
		} catch {}
	}
	handleExit() {
		if (this.stopping) return;
		this.fail("the tunnel process exited unexpectedly");
	}
	fail(message) {
		if (this.stopping) return;
		this.url = void 0;
		this.error = message;
		if (this.handle !== void 0) {
			this.handle.stop();
			this.handle = void 0;
		}
		if (this.urlTimer !== void 0) {
			this.timer.clearTimeout(this.urlTimer);
			this.urlTimer = void 0;
		}
		this.setPhase("failed");
		this.attempts += 1;
		const delay = Math.min(this.restartBaseMs * 2 ** (this.attempts - 1), this.restartMaxMs);
		this.restartTimer = this.timer.setTimeout(() => {
			this.restartTimer = void 0;
			this.attempt();
		}, delay);
	}
	/** Stop the current process and cancel every pending timer (no phase change). */
	teardown() {
		this.stopping = true;
		if (this.urlTimer !== void 0) {
			this.timer.clearTimeout(this.urlTimer);
			this.urlTimer = void 0;
		}
		if (this.restartTimer !== void 0) {
			this.timer.clearTimeout(this.restartTimer);
			this.restartTimer = void 0;
		}
		if (this.handle !== void 0) {
			this.handle.stop();
			this.handle = void 0;
		}
	}
	setPhase(phase) {
		this.phase = phase;
		const info = this.info;
		for (const listener of this.phaseListeners) try {
			listener(info);
		} catch {}
	}
};
/** The aggregate package that is the canonical update entry point. */
const AGGREGATE_PACKAGE = "@haibala/dsh-web-ui-all";
/** Fallback anchor: this plugin's own package when the aggregate is absent. */
const SELF_PACKAGE = "@haibala/dsh-remote-web-ui";
/** A profile manifest `name` prefix (e.g. `dsh-profile-web`). */
const PROFILE_NAME_PREFIX = "dsh-profile-";
/** How many ancestor directories a profile search walks before giving up. */
const PROFILE_WALK_DEPTH = 12;
/**
* Parse a semantic version string (leading `v` tolerated, build metadata
* ignored). Returns undefined for unparseable input.
* @param value - the version string, e.g. `0.1.10` or `0.1.11-rc.1`.
* @returns the parsed parts, or undefined.
*/
function parseSemver(value) {
	const match = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(value.trim());
	if (match === null) return void 0;
	return {
		major: Number(match[1]),
		minor: Number(match[2]),
		patch: Number(match[3]),
		prerelease: match[4] === void 0 ? [] : match[4].split(".")
	};
}
/**
* Compare two semantic versions per the semver precedence rules (a release
* outranks any of its prereleases; numeric prerelease identifiers compare
* numerically and sort below alphanumeric ones). An unparseable version sorts
* below every parseable one; two unparseable versions compare equal.
* @param a - first version.
* @param b - second version.
* @returns negative when a < b, 0 when equal, positive when a > b.
*/
function compareVersions(a, b) {
	const pa = parseSemver(a);
	const pb = parseSemver(b);
	if (pa === void 0 && pb === void 0) return 0;
	if (pa === void 0) return -1;
	if (pb === void 0) return 1;
	for (const key of [
		"major",
		"minor",
		"patch"
	]) if (pa[key] !== pb[key]) return pa[key] < pb[key] ? -1 : 1;
	if (pa.prerelease.length === 0 && pb.prerelease.length === 0) return 0;
	if (pa.prerelease.length === 0) return 1;
	if (pb.prerelease.length === 0) return -1;
	for (let index = 0; index < Math.max(pa.prerelease.length, pb.prerelease.length); index++) {
		const ra = pa.prerelease[index];
		const rb = pb.prerelease[index];
		if (ra === void 0) return -1;
		if (rb === void 0) return 1;
		if (ra === rb) continue;
		const numericA = /^\d+$/.test(ra);
		const numericB = /^\d+$/.test(rb);
		if (numericA && numericB) return Number(ra) < Number(rb) ? -1 : 1;
		if (numericA) return -1;
		if (numericB) return 1;
		return ra < rb ? -1 : 1;
	}
	return 0;
}
/** Read a package.json at a path, tolerating any parse/IO failure. */
function readManifest(path) {
	try {
		const parsed = JSON.parse(readFileSync(path, "utf8"));
		return typeof parsed === "object" && parsed !== null ? parsed : void 0;
	} catch {
		return;
	}
}
/**
* Locate the owning dsh profile by walking up from an installed package's
* manifest until a manifest named `dsh-profile-*` appears (the profile
* directory is the first ancestor whose package.json carries that name).
* @param anchorManifestPath - absolute path of the anchor package.json.
* @returns the profile name/dir, or undefined when not profile-installed.
*/
function findProfile(anchorManifestPath) {
	let dir = dirname(anchorManifestPath);
	for (let depth = 0; depth < PROFILE_WALK_DEPTH; depth++) {
		const name = readManifest(join(dir, "package.json"))?.name;
		if (typeof name === "string" && name.startsWith(PROFILE_NAME_PREFIX)) return {
			name: name.slice(12),
			dir
		};
		const parent = dirname(dir);
		if (parent === dir) return void 0;
		dir = parent;
	}
}
/** Whether a dependency spec is a local link/file/dev-mode install. */
function isLinkedSpec(spec) {
	if (typeof spec !== "string") return false;
	return /^(?:link|file):|^\.{1,2}(?:[/\\]|$)/.test(spec);
}
/**
* Resolve the anchor package's manifest path. The aggregate package is the
* canonical entry point; this plugin's own package is the fallback.
* @param resolve - a Node resolve implementation scoped to the host process.
* @returns the absolute manifest path, or undefined when neither is installed.
*/
function resolveAnchorManifest(resolve) {
	for (const name of [AGGREGATE_PACKAGE, SELF_PACKAGE]) try {
		return resolve(name + "/package.json");
	} catch {}
}
/**
* Resolve what an update would touch: the owning profile directory and the
* family package list. Fails with an error code when the anchor is missing
* ('not-found') or is a local dev install ('link').
* @param deps - the anchor manifest path (resolveAnchorManifest output).
* @returns the target, or the failure code.
*/
function resolveUpdateTarget(deps) {
	const manifestPath = deps.anchorManifestPath;
	if (manifestPath === void 0) return { error: "not-found" };
	const manifest = readManifest(manifestPath);
	if (manifest === void 0) return { error: "not-found" };
	const anchor = typeof manifest.name === "string" ? manifest.name : void 0;
	if (anchor === void 0) return { error: "not-found" };
	const profile = findProfile(manifestPath);
	if (profile === void 0) return { error: "link" };
	const spec = (readManifest(join(profile.dir, "package.json"))?.dependencies)?.[anchor];
	if (isLinkedSpec(spec)) return { error: "link" };
	return {
		profileName: profile.name,
		profileDir: profile.dir,
		packages: [anchor, ...familyChildren(manifest)]
	};
}
/** Family children of the anchor: its dependencies under the family scope. */
function familyChildren(anchorManifest) {
	const dependencies = anchorManifest.dependencies;
	if (typeof dependencies !== "object" || dependencies === null) return [];
	const names = [];
	for (const [name, spec] of Object.entries(dependencies)) if (name.startsWith("@haibala/") && typeof spec === "string") names.push(name);
	return names;
}
/**
* Probe the npm registry for one package's latest release.
* @param name - the package name (scope slash URL-encoded).
* @param fetchImpl - the fetch implementation (global fetch in the host).
* @param timeoutMs - probe timeout.
* @returns the latest version string, or undefined on any failure.
*/
async function fetchLatestVersion(name, fetchImpl, timeoutMs = 1e4) {
	try {
		const controller = new AbortController();
		const timer = setTimeout(() => {
			controller.abort();
		}, timeoutMs);
		try {
			const response = await fetchImpl("https://registry.npmjs.org/" + name.replace("/", "%2F") + "/latest");
			if (!response.ok) return void 0;
			const body = await response.json();
			if (typeof body !== "object" || body === null) return void 0;
			const version = body.version;
			return typeof version === "string" ? version : void 0;
		} finally {
			clearTimeout(timer);
		}
	} catch {
		return;
	}
}
/** The resolved current version of one family package (probe failure tolerated). */
function readInstalledVersion(resolve, name) {
	try {
		const path = resolve(name + "/package.json");
		const version = path === void 0 ? void 0 : readManifest(path)?.version;
		return typeof version === "string" ? version : "0.0.0";
	} catch {
		return "0.0.0";
	}
}
/**
* Build the update status: locate the anchor, detect the install mode, and
* compare every family package against the npm registry.
* @param deps - manifest resolution + registry probe seams.
* @returns the status snapshot.
*/
async function checkUpdates(deps) {
	const manifestPath = deps.anchorManifestPath;
	if (manifestPath === void 0) return {
		mode: "missing",
		packages: [],
		outdated: false
	};
	const manifest = readManifest(manifestPath);
	if (manifest === void 0) return {
		mode: "missing",
		packages: [],
		outdated: false
	};
	const anchor = typeof manifest.name === "string" ? manifest.name : void 0;
	if (anchor === void 0) return {
		mode: "missing",
		packages: [],
		outdated: false
	};
	const profile = findProfile(manifestPath);
	const profileManifest = profile === void 0 ? void 0 : readManifest(join(profile.dir, "package.json"));
	const linked = profile === void 0 || isLinkedSpec((profileManifest?.dependencies)?.[anchor]);
	if (profile === void 0) return {
		mode: "link",
		packages: [],
		outdated: false
	};
	const names = [anchor, ...familyChildren(manifest)];
	const packages = [];
	let probeFailures = 0;
	for (const name of names) {
		const latest = await deps.fetchLatest(name);
		if (latest === void 0) probeFailures++;
		const current = readInstalledVersion(deps.resolve, name);
		packages.push({
			name,
			current,
			latest,
			outdated: latest !== void 0 && latest !== current && compareVersions(latest, current) > 0
		});
	}
	const error = probeFailures === names.length && names.length > 0 ? "registry-unreachable" : void 0;
	return {
		mode: linked ? "link" : "npm",
		profileName: profile.name,
		anchor,
		packages,
		outdated: packages.some((packageStatus) => packageStatus.outdated),
		...error !== void 0 ? { error } : {}
	};
}
/** Cap on captured pnpm output (keeps error payloads bounded). */
const OUTPUT_CAP = 16 * 1024;
/**
* Run the update: `pnpm update <packages>` inside the profile directory.
* @param deps - profile dir, package list, and spawn/timeout seams.
* @returns the outcome with captured output.
*/
function runUpdate(deps) {
	return new Promise((resolve) => {
		const child = (deps.spawnImpl ?? spawn)("pnpm", ["update", ...deps.packages], {
			cwd: deps.profileDir,
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			]
		});
		let output = "";
		const append = (chunk) => {
			output += chunk.toString("utf8");
			if (output.length > OUTPUT_CAP) output = output.slice(output.length - OUTPUT_CAP);
		};
		child.stdout?.on("data", append);
		child.stderr?.on("data", append);
		const timer = setTimeout(() => {
			child.kill("SIGTERM");
			resolve({
				ok: false,
				exitCode: null,
				output,
				error: "update timed out; install process killed",
				errorCode: "timeout"
			});
		}, deps.timeoutMs ?? 10 * 6e4);
		child.on("error", (error) => {
			clearTimeout(timer);
			const missing = error.code === "ENOENT";
			resolve({
				ok: false,
				exitCode: null,
				output,
				error: missing ? "pnpm not found on PATH" : error.message,
				errorCode: missing ? "pnpm-missing" : void 0
			});
		});
		child.on("close", (code) => {
			clearTimeout(timer);
			resolve({
				ok: code === 0,
				exitCode: code,
				output,
				error: code === 0 ? void 0 : "pnpm exited with code " + String(code),
				...code === 0 ? {} : { errorCode: "pnpm-failed" }
			});
		});
	});
}
//#endregion
//#region src/update-routes.ts
/** Route paths (exact matches under /api). */
const UPDATE_PATHS = {
	status: "/api/update/status",
	run: "/api/update/run"
};
/** One JSON response. */
function writeJson(res, status, body) {
	const payload = JSON.stringify(body);
	res.writeHead(status, {
		"content-type": "application/json; charset=utf-8",
		"referrer-policy": "no-referrer"
	});
	res.end(payload);
}
/**
* Build the /api/update route family.
* @param deps - fence + check/run seams.
* @returns the exact routes to register on webServer.
*/
function makeUpdateRoutes(deps) {
	const handleStatus = async (req, res) => {
		if (req.method !== "GET") {
			res.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
			res.end("method not allowed");
			return;
		}
		if (!deps.fence(req)) {
			writeJson(res, 403, {
				ok: false,
				code: "forbidden"
			});
			return;
		}
		writeJson(res, 200, await deps.check());
	};
	const handleRun = async (req, res) => {
		if (req.method !== "POST") {
			res.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
			res.end("method not allowed");
			return;
		}
		if (!deps.fence(req)) {
			writeJson(res, 403, {
				ok: false,
				code: "forbidden"
			});
			return;
		}
		writeJson(res, 200, await deps.run());
	};
	return [{
		kind: "exact",
		path: UPDATE_PATHS.status,
		handler: handleStatus
	}, {
		kind: "exact",
		path: UPDATE_PATHS.run,
		handler: handleRun
	}];
}
//#endregion
//#region src/index.ts
/**
* Mobile remote control for the dsh web GUI — host half. Mounts the pairing
* service (one-time tokens, device sessions, revocation), the /api/pair
* route family (issue/accept/stop/heartbeat/status/events), the api/gate
* listener that enforces pairing on every other /api request from
* non-loopback hosts, and the presence sweep. The browser half (the
* `./client` entry) renders the sidebar entry, the pairing panel, and the
* phone-side pair/accept + deep-link flow.
*/
/** Stable cordis plugin name. */
const name = "remote-web-ui";
/** Services required before the pairing surfaces can mount. */
const inject = ["webServer", "apiProxy"];
/**
* Settings namespace of the remote-control capability — the section the web
* settings surface edits. Spelled here rather than imported: the browser
* half spells the same value and must not depend on a Host package.
*/
const REMOTE_WEB_UI_SETTINGS_NAMESPACE = settingsNamespace("remote-web-ui");
const Config = z.object({
	tokenTtlMs: z.number().step(1).min(6e4).default(10 * 6e4),
	offlineAfterMs: z.number().step(1).min(5e3).default(25e3),
	maxDevices: z.number().step(1).min(1).max(64).default(4),
	cookieName: z.string().min(1).default("dsh_pair"),
	requirePairingForLan: z.boolean().default(true),
	publicBaseUrl: z.string(),
	autoTunnel: z.boolean().default(false),
	enabled: z.boolean().default(true)
});
/** Presence sweep cadence (a stale device flips to disconnected within two sweeps). */
const SWEEP_INTERVAL_MS = 1e4;
/** Schema defaults, re-read for hand-built test contexts (the loader applies them normally). */
const DEFAULTS = {
	tokenTtlMs: 10 * 6e4,
	offlineAfterMs: 25e3,
	maxDevices: 4,
	cookieName: "dsh_pair",
	requirePairingForLan: true,
	publicBaseUrl: void 0,
	autoTunnel: false,
	enabled: true
};
/**
* Mount the pairing service, routes, gate listener, and presence sweep.
* @param ctx - host plugin context carrying webServer.
* @param config - resolved plugin config (schema defaults applied by the loader).
*/
function apply(ctx, config) {
	const resolved = {
		tokenTtlMs: config?.tokenTtlMs ?? DEFAULTS.tokenTtlMs,
		offlineAfterMs: config?.offlineAfterMs ?? DEFAULTS.offlineAfterMs,
		maxDevices: config?.maxDevices ?? DEFAULTS.maxDevices,
		cookieName: config?.cookieName ?? DEFAULTS.cookieName,
		requirePairingForLan: config?.requirePairingForLan ?? DEFAULTS.requirePairingForLan,
		publicBaseUrl: config?.publicBaseUrl,
		autoTunnel: config?.autoTunnel ?? DEFAULTS.autoTunnel,
		enabled: config?.enabled ?? DEFAULTS.enabled
	};
	let current = () => config ?? {};
	const resolve = () => {
		const value = current();
		return {
			tokenTtlMs: value.tokenTtlMs ?? DEFAULTS.tokenTtlMs,
			offlineAfterMs: value.offlineAfterMs ?? DEFAULTS.offlineAfterMs,
			maxDevices: value.maxDevices ?? DEFAULTS.maxDevices,
			cookieName: value.cookieName ?? DEFAULTS.cookieName,
			requirePairingForLan: value.requirePairingForLan ?? DEFAULTS.requirePairingForLan,
			publicBaseUrl: value.publicBaseUrl,
			autoTunnel: value.autoTunnel ?? DEFAULTS.autoTunnel,
			enabled: value.enabled ?? DEFAULTS.enabled
		};
	};
	const service = new PairingService({
		tokenTtlMs: resolved.tokenTtlMs,
		offlineAfterMs: resolved.offlineAfterMs,
		maxDevices: resolved.maxDevices,
		cookieName: resolved.cookieName
	});
	const tunnel = new TunnelManager();
	let autoTunnel = resolved.autoTunnel;
	tunnel.onPhase((info) => {
		if (!autoTunnel) return;
		if (info.phase === "running" && info.url !== void 0) {
			service.setPublicBaseUrl(info.url);
			service.setTunnelStatus({
				state: "running",
				url: info.url
			});
		} else if (info.phase === "starting") {
			service.setPublicBaseUrl(void 0);
			service.setTunnelStatus({ state: "starting" });
		} else if (info.phase === "failed") {
			service.setPublicBaseUrl(void 0);
			service.setTunnelStatus(info.error === void 0 ? { state: "failed" } : {
				state: "failed",
				error: info.error
			});
		}
	});
	ctx.effect(() => () => {
		tunnel.dispose();
	}, "remote-web-ui: auto tunnel");
	const lanBases = ctx.webServer.host === "0.0.0.0" ? lanIPv4Addresses().map((address) => ({
		address,
		base: `http://${address}:${String(ctx.webServer.port)}`
	})) : [];
	service.setLanBases(lanBases);
	const lanAddresses = lanBases.map((entry) => entry.address);
	let disposeRoutes;
	let disposeSweep;
	const apiProxy = ctx.get("apiProxy");
	if (apiProxy === void 0) console.warn("remote-web-ui: apiProxy service unavailable — the mobile data channel is disabled");
	const requireFromHost = createRequire(import.meta.url);
	const anchorManifestPath = resolveAnchorManifest((specifier) => requireFromHost.resolve(specifier));
	const updateRoutes = makeUpdateRoutes({
		fence: (request) => isTrustedApiRequest(request, []),
		check: () => checkUpdates({
			anchorManifestPath,
			resolve: (specifier) => {
				try {
					return requireFromHost.resolve(specifier);
				} catch {
					return;
				}
			},
			fetchLatest: (name) => fetchLatestVersion(name, fetch)
		}),
		run: async () => {
			const target = resolveUpdateTarget({ anchorManifestPath });
			if ("error" in target) {
				const code = target.error;
				return {
					ok: false,
					exitCode: null,
					output: "",
					error: code === "not-found" ? "dsh-web-ui aggregate not installed" : "local link install — update unavailable",
					errorCode: code
				};
			}
			return runUpdate({
				profileDir: target.profileDir,
				packages: target.packages
			});
		}
	});
	const routes = [
		...makeRoutes({
			service,
			lanAddresses
		}),
		...makeMobileRoutes(),
		...apiProxy !== void 0 ? makeMobileApiRoutes({
			service,
			apiProxy
		}) : [],
		...updateRoutes
	];
	const gate = makeGateListener(service, () => resolve().requirePairingForLan, () => resolve().enabled);
	ctx.effect(() => ctx.on("api/gate", gate), "remote-web-ui: api gate");
	const sync = () => {
		const value = resolve();
		service.config = {
			tokenTtlMs: value.tokenTtlMs,
			offlineAfterMs: value.offlineAfterMs,
			maxDevices: value.maxDevices,
			cookieName: value.cookieName
		};
		autoTunnel = value.autoTunnel === true;
		if (autoTunnel) {
			if (value.publicBaseUrl !== void 0) console.warn("remote-web-ui: autoTunnel is on — ignoring the manually configured publicBaseUrl");
			tunnel.start(`http://127.0.0.1:${String(ctx.webServer.port)}`);
		} else {
			tunnel.stop();
			if (value.publicBaseUrl !== void 0 && !isHttpUrl(value.publicBaseUrl)) {
				console.warn(`remote-web-ui: ignoring malformed publicBaseUrl ${JSON.stringify(value.publicBaseUrl)} (expected https://host[:port])`);
				service.setPublicBaseUrl(void 0);
			} else service.setPublicBaseUrl(value.publicBaseUrl);
		}
		const enabled = value.enabled;
		if (!enabled) service.stop();
		if (disposeRoutes === void 0 && enabled) disposeRoutes = ctx.effect(() => {
			const disposers = routes.map((route) => ctx.webServer.register(route));
			return () => {
				for (const dispose of disposers) dispose();
			};
		}, "remote-web-ui: pairing routes");
		else if (disposeRoutes !== void 0 && !enabled) {
			disposeRoutes();
			disposeRoutes = void 0;
		}
		if (disposeSweep === void 0 && enabled) disposeSweep = ctx.effect(() => {
			const timer = setInterval$1(() => {
				service.sweep();
			}, SWEEP_INTERVAL_MS);
			timer.unref();
			return () => {
				clearInterval(timer);
			};
		}, "remote-web-ui: presence sweep");
		else if (disposeSweep !== void 0 && !enabled) {
			disposeSweep();
			disposeSweep = void 0;
		}
	};
	installSettingsSection(ctx, REMOTE_WEB_UI_SETTINGS_NAMESPACE, Config, config ?? {}, {
		setSource: (source) => {
			current = source;
			sync();
		},
		onChange: sync
	});
	sync();
}
/** Whether a configured public base is a parseable http(s) URL with a host. */
function isHttpUrl(value) {
	try {
		const url = new URL(value);
		return (url.protocol === "http:" || url.protocol === "https:") && url.hostname !== "";
	} catch {
		return false;
	}
}
//#endregion
export { Config, REMOTE_WEB_UI_SETTINGS_NAMESPACE, apply, inject, name };
