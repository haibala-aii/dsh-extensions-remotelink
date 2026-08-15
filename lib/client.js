window.__ModuleLoader__.load({
	id: "@haibala-aii/dsh-extensions-remotelink",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp$1 = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp$1.call(to, key) && key !== except) __defProp$1(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp$1(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		react = __toESM(react, 1);
		let react_dom_client = require("react-dom/client");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region src/client/PhoneIcon.tsx
		/**
		* Render a smartphone glyph (not a telephone handset).
		* @param props - size and optional class.
		* @returns the svg element.
		*/
		function PhoneIcon({ size = 16, className }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				width: size,
				height: size,
				className,
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("rect", {
						x: "4.25",
						y: "1.75",
						width: "7.5",
						height: "12.5",
						rx: "1.6",
						stroke: "currentColor",
						strokeWidth: "1.3"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M7 12.35h2",
						stroke: "currentColor",
						strokeWidth: "1.3",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
						d: "M12.4 5.1a3.4 3.4 0 0 1 0 5.8",
						stroke: "currentColor",
						strokeWidth: "1.2",
						strokeLinecap: "round"
					})
				]
			});
		}
		//#endregion
		//#region \0dsh-css:E:\dsh\local\dsh-remote-web-ui\src\client\remote.module.css.mjs
		const css$1 = ".bXyBIq_overlay{z-index:1000;justify-content:center;align-items:center;display:flex;position:fixed;inset:0}.bXyBIq_mask{background:var(--dsw-alias-bg-mask-1);backdrop-filter:var(--dsw-mask-blur);position:absolute;inset:0}.bXyBIq_trigger{width:36px;height:36px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;padding:0;transition:background-color .12s,color .12s,box-shadow .12s;display:inline-flex}.bXyBIq_trigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.bXyBIq_trigger:active:not(:disabled){background:var(--dsw-alias-interactive-bg-active)}.bXyBIq_trigger:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-bg-layer-2), 0 0 0 4px var(--dsw-alias-brand-primary);outline:none}.bXyBIq_trigger:disabled{opacity:.5;cursor:default}.bXyBIq_section{flex-direction:column;gap:16px;width:100%;display:flex}.bXyBIq_sectionHint{color:var(--dsw-alias-label-secondary);margin:0;font-size:13px;line-height:20px}.bXyBIq_cardList{margin:0;padding:0;list-style:none}.bXyBIq_panelEmbedded{box-sizing:border-box;width:100%;color:var(--dsw-alias-label-primary);flex-direction:column;gap:14px;padding:0;font-size:14px;line-height:22px;display:flex;position:relative}.bXyBIq_status,.bXyBIq_statusRail{box-sizing:border-box;color:var(--dsw-alias-label-primary);background:0 0;border:none;flex:none;align-items:center;gap:8px;font-family:inherit;font-size:14px;line-height:22px;display:flex}.bXyBIq_status{border-radius:12px;width:calc(100% + 8px);height:34px;margin:4px -4px 0;padding:6px 2px 6px 10px}.bXyBIq_statusRail{width:36px;height:36px;color:var(--dsw-alias-label-secondary);border-radius:50%;justify-content:center;margin:8px 0 0;padding:0}.bXyBIq_statusLabel{white-space:nowrap;overflow:hidden}.bXyBIq_panel{z-index:1;box-sizing:border-box;background:var(--dsw-alias-bg-layer-2);width:560px;max-width:calc(100vw - 48px);max-height:calc(100vh - 48px);box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-primary);border-radius:24px;flex-direction:column;gap:14px;padding:24px;font-size:14px;line-height:22px;display:flex;position:relative;overflow:auto}.bXyBIq_header{align-items:flex-start;gap:12px;display:flex}.bXyBIq_heading{flex:1;min-width:0}.bXyBIq_title{margin:0;font-size:18px;font-weight:600;line-height:26px}.bXyBIq_subtitle{color:var(--dsw-alias-label-secondary);margin:4px 0 0;font-size:13px}.bXyBIq_close{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;padding:0;transition:background-color .12s,color .12s,box-shadow .12s;display:inline-flex}.bXyBIq_close:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.bXyBIq_close:active:not(:disabled){background:var(--dsw-alias-interactive-bg-active)}.bXyBIq_close:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-bg-layer-2), 0 0 0 4px var(--dsw-alias-brand-primary);outline:none}.bXyBIq_close:disabled{opacity:.5;cursor:default}.bXyBIq_card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:16px;flex-direction:column;align-items:center;gap:12px;padding:16px;display:flex}.bXyBIq_cardHeader{justify-content:space-between;align-items:center;gap:12px;width:100%;display:flex}.bXyBIq_cardTitle{font-weight:500}.bXyBIq_badge{white-space:nowrap;border-radius:999px;flex:none;align-items:center;gap:6px;min-width:0;padding:2px 10px;font-size:12px;line-height:18px;display:inline-flex}.bXyBIq_badge:before{content:\"\";background:currentColor;border-radius:50%;width:8px;height:8px}.bXyBIq_badge-waiting{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover)}.bXyBIq_badge-connected{color:var(--dsw-alias-state-success-primary);background:var(--dsw-alias-interactive-bg-hover)}.bXyBIq_badge-disconnected{color:var(--dsw-alias-state-warn-primary);background:var(--dsw-alias-interactive-bg-hover)}.bXyBIq_badge-stopped{color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover)}.bXyBIq_badgePublic{color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-interactive-bg-hover)}.bXyBIq_badges{flex:none;align-items:center;gap:6px;display:inline-flex}.bXyBIq_qrWrap{background:var(--dsw-alias-bg-base);border-radius:12px;justify-content:center;align-items:center;padding:12px;display:flex}.bXyBIq_qr{display:block}.bXyBIq_expired{color:var(--dsw-alias-state-error-primary);margin:0;font-size:13px}.bXyBIq_expiry{color:var(--dsw-alias-label-secondary);margin:0;font-size:12px}.bXyBIq_hint{color:var(--dsw-alias-label-secondary);margin:0;font-size:13px}.bXyBIq_link{text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-caption);font-family:var(--dsw-font-mono,ui-monospace, monospace);margin:0;font-size:12px;overflow:hidden}.bXyBIq_stoppedHint{color:var(--dsw-alias-state-error-primary);margin:0;font-size:13px}.bXyBIq_tunnelNote{color:var(--dsw-alias-label-secondary);margin:0;font-size:13px}.bXyBIq_tunnelFailed{color:var(--dsw-alias-state-error-primary);margin:0;font-size:13px}.bXyBIq_actions{gap:8px;display:flex}.bXyBIq_action{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-button-elevated-fill);height:34px;color:var(--dsw-alias-label-primary);cursor:pointer;white-space:nowrap;border-radius:10px;justify-content:center;align-items:center;gap:6px;padding:0 14px;font-size:13px;transition:background-color .12s,border-color .12s,box-shadow .12s;display:inline-flex}.bXyBIq_action:hover:not(:disabled){background:var(--dsw-alias-button-floating-hover)}.bXyBIq_action:active:not(:disabled){background:var(--dsw-alias-interactive-bg-active)}.bXyBIq_action:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-bg-layer-2), 0 0 0 4px var(--dsw-alias-brand-primary);outline:none}.bXyBIq_action:disabled{opacity:.5;cursor:default}.bXyBIq_banner{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:16px;padding:16px}.bXyBIq_bannerTitle{color:var(--dsw-alias-state-warn-primary);margin:0;font-weight:500}.bXyBIq_bannerHint{color:var(--dsw-alias-label-secondary);margin:6px 0 0;font-size:13px}.bXyBIq_notice{z-index:2000;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);max-width:min(420px,100vw - 32px);box-shadow:var(--dsw-shadow-lv3);border-radius:12px;padding:12px 16px;position:fixed;top:16px;left:50%;transform:translate(-50%)}.bXyBIq_noticeTitle{color:var(--dsw-alias-state-error-primary);margin:0;font-weight:500}.bXyBIq_noticeDetail{color:var(--dsw-alias-label-secondary);margin:4px 0 0;font-size:13px}.bXyBIq_addresses{border:none;margin:12px 0 0;padding:0}.bXyBIq_addresses legend{color:var(--dsw-alias-label-secondary);padding:0;font-size:13px}.bXyBIq_address{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;cursor:pointer;border-radius:6px;align-items:center;gap:8px;margin-top:6px;padding:4px 6px;font-size:13px;transition:background-color .12s;display:flex}.bXyBIq_address:hover{background:var(--dsw-alias-interactive-bg-hover)}.bXyBIq_address input:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-bg-layer-2), 0 0 0 4px var(--dsw-alias-brand-primary);border-radius:50%;outline:none}.bXyBIq_addressValue{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-secondary);flex:1;font-size:12px;overflow:hidden}.bXyBIq_addressHint{color:var(--dsw-alias-label-tertiary);margin:6px 0 0;font-size:12px}@media (prefers-reduced-motion:reduce){.bXyBIq_trigger,.bXyBIq_close,.bXyBIq_action,.bXyBIq_address{transition:none}}.bXyBIq_entryRow{flex:none;align-items:center;gap:6px;display:flex}.bXyBIq_entryRow[data-rail=rail]{flex-direction:column-reverse;gap:4px}.bXyBIq_updateStatus{margin:0;font-weight:600}.bXyBIq_updateDetail{color:var(--dsw-alias-label-secondary);margin:6px 0 0;font-size:13px}.bXyBIq_updateError{color:var(--dsw-alias-text-danger,var(--dsw-alias-label-primary));margin:0;font-weight:600}.bXyBIq_updateOutput{background:var(--dsw-alias-bg-layer-1);max-height:180px;color:var(--dsw-alias-label-secondary);white-space:pre-wrap;word-break:break-all;border-radius:10px;margin:10px 0 0;padding:10px 12px;font-size:12px;line-height:18px;overflow:auto}.bXyBIq_updateList{flex-direction:column;gap:6px;margin:12px 0 0;padding:0;list-style:none;display:flex}.bXyBIq_updateListItem{justify-content:space-between;align-items:baseline;gap:12px;font-size:13px;display:flex}.bXyBIq_updateListName{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-primary);overflow:hidden}.bXyBIq_updateListVersions{color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;flex:none}.bXyBIq_updateActions{justify-content:flex-end;margin-top:16px;display:flex}.bXyBIq_updateRetry{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary);cursor:pointer;border:none;border-radius:10px;align-items:center;gap:6px;padding:8px 14px;font-size:13px;transition:background-color .12s,color .12s;display:inline-flex}.bXyBIq_updateRetry:hover{background:var(--dsw-alias-interactive-bg-active)}@media (prefers-reduced-motion:reduce){.bXyBIq_updateRetry{transition:none}}";
		const tagId$1 = "@haibala-aii/dsh-extensions-remotelink/remote.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@haibala-aii/dsh-extensions-remotelink";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var remote_module_css_default = {
			"banner": "bXyBIq_banner",
			"close": "bXyBIq_close",
			"status": "bXyBIq_status",
			"badge-stopped": "bXyBIq_badge-stopped",
			"action": "bXyBIq_action",
			"badge-disconnected": "bXyBIq_badge-disconnected",
			"notice": "bXyBIq_notice",
			"cardList": "bXyBIq_cardList",
			"badge-waiting": "bXyBIq_badge-waiting",
			"sectionHint": "bXyBIq_sectionHint",
			"updateActions": "bXyBIq_updateActions",
			"qr": "bXyBIq_qr",
			"noticeDetail": "bXyBIq_noticeDetail",
			"cardHeader": "bXyBIq_cardHeader",
			"cardTitle": "bXyBIq_cardTitle",
			"addressHint": "bXyBIq_addressHint",
			"trigger": "bXyBIq_trigger",
			"badge-connected": "bXyBIq_badge-connected",
			"card": "bXyBIq_card",
			"updateList": "bXyBIq_updateList",
			"mask": "bXyBIq_mask",
			"updateError": "bXyBIq_updateError",
			"updateListVersions": "bXyBIq_updateListVersions",
			"noticeTitle": "bXyBIq_noticeTitle",
			"statusLabel": "bXyBIq_statusLabel",
			"subtitle": "bXyBIq_subtitle",
			"statusRail": "bXyBIq_statusRail",
			"badges": "bXyBIq_badges",
			"tunnelNote": "bXyBIq_tunnelNote",
			"entryRow": "bXyBIq_entryRow",
			"heading": "bXyBIq_heading",
			"stoppedHint": "bXyBIq_stoppedHint",
			"updateDetail": "bXyBIq_updateDetail",
			"link": "bXyBIq_link",
			"badgePublic": "bXyBIq_badgePublic",
			"bannerTitle": "bXyBIq_bannerTitle",
			"actions": "bXyBIq_actions",
			"overlay": "bXyBIq_overlay",
			"panel": "bXyBIq_panel",
			"expiry": "bXyBIq_expiry",
			"address": "bXyBIq_address",
			"hint": "bXyBIq_hint",
			"badge": "bXyBIq_badge",
			"header": "bXyBIq_header",
			"expired": "bXyBIq_expired",
			"updateStatus": "bXyBIq_updateStatus",
			"updateRetry": "bXyBIq_updateRetry",
			"updateListName": "bXyBIq_updateListName",
			"tunnelFailed": "bXyBIq_tunnelFailed",
			"updateListItem": "bXyBIq_updateListItem",
			"section": "bXyBIq_section",
			"updateOutput": "bXyBIq_updateOutput",
			"qrWrap": "bXyBIq_qrWrap",
			"addresses": "bXyBIq_addresses",
			"title": "bXyBIq_title",
			"addressValue": "bXyBIq_addressValue",
			"panelEmbedded": "bXyBIq_panelEmbedded",
			"bannerHint": "bXyBIq_bannerHint"
		};
		//#endregion
		//#region src/client/RemoteStatus.tsx
		/**
		* Sidebar-foot status chip shown above Settings while a phone is live.
		*/
		/** True only while at least one paired phone is online. */
		function isLive(frame) {
			return frame.phase === "connected" && frame.onlineCount > 0;
		}
		/**
		* Render the "正在远程操控" chip above the settings trigger.
		* Hidden while waiting for a phone or after every paired phone goes offline.
		* @param props - column state and locale seat.
		* @returns the status element, or nothing.
		*/
		function RemoteStatus({ wide, t }) {
			const [live, setLive] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				const source = new EventSource("/api/pair/events");
				source.onmessage = (event) => {
					try {
						const frame = JSON.parse(event.data);
						if (frame.type !== "state") return;
						setLive(isLive(frame));
					} catch {}
				};
				source.onerror = () => {
					setLive(false);
				};
				return () => {
					source.close();
				};
			}, []);
			if (!live) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: wide ? remote_module_css_default.status : remote_module_css_default.statusRail,
				role: "status",
				"aria-label": t("footer.status"),
				title: t("footer.status"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PhoneIcon, { size: wide ? 16 : 18 }), wide && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: remote_module_css_default.statusLabel,
					children: t("footer.status")
				})]
			});
		}
		//#endregion
		//#region src/client/FooterRemoteEntry.tsx
		/**
		* Render the remote-control status chip from the footer seat.
		* @param props - composed slot props (footer seat subset).
		* @returns the status element.
		*/
		function FooterRemoteEntry(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RemoteStatus, {
				wide: props.wide,
				t: props.t
			});
		}
		//#endregion
		//#region src/client/PairFailedNotice.tsx
		/**
		* One-time failed-pairing notice: a fixed toast rendered on the phone after
		* a QR accept failed (invalid/used token or a network error). Mounted by
		* the client apply with a plain React root — no slot machinery for a
		* transient diagnostic.
		*/
		/** Human-readable diagnostic for each failure code (concise, for bug reports). */
		function detailFor(code, t) {
			switch (code) {
				case "invalid": return `${t("pair.failed.detail")}（code: invalid）`;
				case "used": return `${t("pair.failed.detail")}（code: used）`;
				case "forbidden": return `${t("pair.failed.detail")}（code: forbidden）`;
				case "network": return `${t("pair.failed.detail")}（code: network）`;
				default: return t("pair.failed.detail");
			}
		}
		/**
		* Render the failed-pair toast (auto-dismisses).
		* @param props - localized copy and failure code.
		* @returns the toast element.
		*/
		function PairFailedNotice({ t, code }) {
			const [visible, setVisible] = (0, react.useState)(true);
			(0, react.useEffect)(() => {
				const timer = window.setTimeout(() => {
					setVisible(false);
				}, 8e3);
				return () => {
					window.clearTimeout(timer);
				};
			}, []);
			if (!visible) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: remote_module_css_default.notice,
				role: "alert",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: remote_module_css_default.noticeTitle,
					children: t("pair.failed.title")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: remote_module_css_default.noticeDetail,
					children: detailFor(code, t)
				})]
			});
		}
		//#endregion
		//#region \0dsh-css:E:\dsh\local\dsh-remote-web-ui\src\client\settings-card.module.css.mjs
		const css = "._3HDGFG_card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:8px;list-style:none;transition:border-color .16s,background .16s;overflow:hidden}._3HDGFG_cardOpen{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-label-dimmed)}._3HDGFG_header{cursor:pointer;text-align:left;width:100%;font:inherit;background:0 0;border:0;border-radius:8px;align-items:center;gap:8px;padding:10px 14px;transition:background-color .12s,box-shadow .12s;display:flex}._3HDGFG_header:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}._3HDGFG_header:active:not(:disabled){background:var(--dsw-alias-interactive-bg-active)}._3HDGFG_header:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-bg-layer-3), 0 0 0 4px var(--dsw-alias-brand-primary);outline:none}._3HDGFG_header:disabled{opacity:.5;cursor:default}._3HDGFG_headText{flex-direction:column;flex:1;gap:2px;min-width:0;display:flex}._3HDGFG_name{color:var(--dsw-alias-label-primary);font-weight:600}._3HDGFG_description{color:var(--dsw-alias-label-tertiary);font-size:12px}._3HDGFG_pending{color:var(--dsw-alias-state-warn-primary);font-size:12px}._3HDGFG_chevron{color:var(--dsw-alias-label-tertiary);transition:transform .12s}._3HDGFG_chevronOpen{transform:rotate(180deg)}._3HDGFG_body{flex-direction:column;gap:14px;padding:0 14px 14px;display:flex}._3HDGFG_readOnly{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px}._3HDGFG_notExposed{color:var(--dsw-alias-state-warn-primary);margin:0;font-size:12px;line-height:1.5}._3HDGFG_footer{justify-content:flex-end;align-items:center;gap:8px;display:flex}._3HDGFG_failed{color:var(--dsw-alias-state-error-primary);margin:0 auto 0 0;font-size:12px}._3HDGFG_discard,._3HDGFG_save{font:inherit;cursor:pointer;border-radius:6px;padding:5px 12px;font-size:13px;transition:background-color .12s,border-color .12s,color .12s,box-shadow .12s}._3HDGFG_discard{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:0 0}._3HDGFG_discard:hover:not(:disabled){color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-label-dimmed)}._3HDGFG_discard:active:not(:disabled){background:var(--dsw-alias-interactive-bg-active)}._3HDGFG_discard:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-bg-layer-3), 0 0 0 4px var(--dsw-alias-brand-primary);outline:none}._3HDGFG_save{border:1px solid var(--dsw-alias-button-info-fill);background:var(--dsw-alias-button-info-fill);color:var(--dsw-alias-label-primary-foreground)}._3HDGFG_save:hover:not(:disabled){border-color:var(--dsw-alias-button-info-hover);background:var(--dsw-alias-button-info-hover)}._3HDGFG_save:active:not(:disabled){border-color:var(--dsw-alias-button-info-hover);background:var(--dsw-alias-button-info-hover);filter:brightness(.96)}._3HDGFG_save:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-bg-layer-3), 0 0 0 4px var(--dsw-alias-brand-primary);outline:none}._3HDGFG_discard:disabled,._3HDGFG_save:disabled{opacity:.5;cursor:default}._3HDGFG_field{flex-direction:column;gap:4px;display:flex}._3HDGFG_head{align-items:center;gap:8px;display:flex}._3HDGFG_label{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500}._3HDGFG_badges{align-items:center;gap:6px;display:flex}._3HDGFG_badge{background:var(--dsw-alias-interactive-bg-hover-accent);min-width:0;color:var(--dsw-alias-state-business-primary);white-space:nowrap;border-radius:999px;flex:none;padding:1px 6px;font-size:11px}._3HDGFG_reset{color:var(--dsw-alias-state-business-primary);cursor:pointer;background:0 0;border:0;border-radius:4px;flex:none;padding:1px 2px;font-size:11px;transition:background-color .12s,color .12s,box-shadow .12s}._3HDGFG_reset:hover:not(:disabled){color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}._3HDGFG_reset:active:not(:disabled){background:var(--dsw-alias-interactive-bg-active)}._3HDGFG_reset:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-bg-layer-3), 0 0 0 4px var(--dsw-alias-brand-primary);outline:none}._3HDGFG_reset:disabled{opacity:.5;cursor:default}._3HDGFG_input,._3HDGFG_select{border:1px solid var(--dsw-alias-border-l2);font:inherit;color:var(--dsw-alias-label-primary);background:var(--dsw-specific-input-major);border-radius:6px;padding:6px 8px;font-size:13px;transition:border-color .12s,box-shadow .12s}._3HDGFG_input:focus-visible,._3HDGFG_select:focus-visible{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 2px var(--dsw-alias-bg-layer-3), 0 0 0 4px var(--dsw-alias-brand-primary);outline:none}._3HDGFG_inputInvalid{border:1px solid var(--dsw-alias-state-error-primary);font:inherit;color:var(--dsw-alias-label-primary);border-radius:6px;padding:6px 8px;font-size:13px;transition:border-color .12s,box-shadow .12s}._3HDGFG_inputInvalid:focus-visible{border-color:var(--dsw-alias-state-error-primary);box-shadow:0 0 0 2px var(--dsw-alias-bg-layer-3), 0 0 0 4px var(--dsw-alias-state-error-primary);outline:none}._3HDGFG_input:disabled,._3HDGFG_select:disabled{opacity:.6}._3HDGFG_hint{color:var(--dsw-alias-label-secondary);margin:0;font-size:12px}._3HDGFG_invalid{color:var(--dsw-alias-state-error-primary);margin:0;font-size:12px}@media (prefers-reduced-motion:reduce){._3HDGFG_card,._3HDGFG_header,._3HDGFG_chevron,._3HDGFG_discard,._3HDGFG_save,._3HDGFG_reset,._3HDGFG_input,._3HDGFG_select,._3HDGFG_inputInvalid{transition:none}}";
		const tagId = "@haibala-aii/dsh-extensions-remotelink/settings-card.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@haibala-aii/dsh-extensions-remotelink";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var settings_card_module_css_default = {
			"label": "_3HDGFG_label",
			"pending": "_3HDGFG_pending",
			"readOnly": "_3HDGFG_readOnly",
			"input": "_3HDGFG_input",
			"select": "_3HDGFG_select",
			"header": "_3HDGFG_header",
			"body": "_3HDGFG_body",
			"footer": "_3HDGFG_footer",
			"badge": "_3HDGFG_badge",
			"badges": "_3HDGFG_badges",
			"inputInvalid": "_3HDGFG_inputInvalid",
			"invalid": "_3HDGFG_invalid",
			"card": "_3HDGFG_card",
			"notExposed": "_3HDGFG_notExposed",
			"save": "_3HDGFG_save",
			"head": "_3HDGFG_head",
			"name": "_3HDGFG_name",
			"reset": "_3HDGFG_reset",
			"hint": "_3HDGFG_hint",
			"field": "_3HDGFG_field",
			"chevronOpen": "_3HDGFG_chevronOpen",
			"description": "_3HDGFG_description",
			"failed": "_3HDGFG_failed",
			"headText": "_3HDGFG_headText",
			"cardOpen": "_3HDGFG_cardOpen",
			"chevron": "_3HDGFG_chevron",
			"discard": "_3HDGFG_discard"
		};
		//#endregion
		//#region src/client/PluginSettingsCard.tsx
		/**
		* Shared chrome for the plugin settings card: a disclosure header naming the
		* plugin and what its settings govern, the controls inside, and the save that
		* writes them. Renders nothing while the namespace is unavailable — a
		* deployment that does not compose the owning plugin should show no trace of
		* it. Mirrors the official ui-plugin-config PluginCard in a self-contained
		* slice (this package must not depend on a sibling UI package).
		*/
		/**
		* Render one plugin settings card.
		* @param props - the plugin's copy keys, its form state, and its controls.
		* @returns the card, or nothing while the namespace is still loading.
		*/
		function PluginSettingsCard(props) {
			const [open, setOpen] = (0, react.useState)(false);
			const { state } = props;
			if (!state.available) return null;
			const title = props.t(props.titleKey);
			const blocked = !state.dirty || state.invalid || state.saving;
			if (!state.exposed) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: settings_card_module_css_default.card,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: settings_card_module_css_default.header,
					"aria-expanded": open,
					"aria-label": `${props.t(open ? "settings.collapse" : "settings.expand")}: ${title}`,
					onClick: () => {
						setOpen(!open);
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: settings_card_module_css_default.headText,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: settings_card_module_css_default.name,
							children: title
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: settings_card_module_css_default.description,
							children: props.t(props.descriptionKey)
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: open ? settings_card_module_css_default.chevronOpen : settings_card_module_css_default.chevron,
						children: "▾"
					})]
				}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: settings_card_module_css_default.body,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: settings_card_module_css_default.notExposed,
						role: "status",
						children: props.t("settings.notExposed")
					})
				}) : null]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: settings_card_module_css_default.card,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: settings_card_module_css_default.header,
					"aria-expanded": open,
					"aria-label": `${props.t(open ? "settings.collapse" : "settings.expand")}: ${title}`,
					onClick: () => {
						setOpen(!open);
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: settings_card_module_css_default.headText,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: settings_card_module_css_default.name,
								children: title
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: settings_card_module_css_default.description,
								children: props.t(props.descriptionKey)
							})]
						}),
						state.dirty ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: settings_card_module_css_default.pending,
							children: props.t("settings.unsaved")
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: open ? settings_card_module_css_default.chevronOpen : settings_card_module_css_default.chevron,
							children: "▾"
						})
					]
				}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: settings_card_module_css_default.body,
					children: [
						!state.writable ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: settings_card_module_css_default.readOnly,
							role: "status",
							children: props.t("settings.readOnly")
						}) : null,
						props.children,
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: settings_card_module_css_default.footer,
							children: [
								state.failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: settings_card_module_css_default.failed,
									role: "status",
									children: props.t("settings.saveFailed")
								}) : null,
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: settings_card_module_css_default.discard,
									disabled: !state.dirty || state.saving,
									onClick: props.onDiscard,
									children: props.t("settings.discard")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: settings_card_module_css_default.save,
									disabled: blocked,
									onClick: props.onSave,
									children: props.t(!state.saving ? "settings.save" : "settings.saving")
								})
							]
						})
					]
				}) : null]
			});
		}
		/** A staged value field. `numeric` only hints the keypad: which drafts a field accepts is decided by its spec. */
		function ValueField(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: settings_card_module_css_default.field,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: settings_card_module_css_default.head,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: settings_card_module_css_default.label,
							htmlFor: props.id,
							children: props.label
						}), props.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: settings_card_module_css_default.badges,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: settings_card_module_css_default.badge,
								children: props.overriddenLabel
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: settings_card_module_css_default.reset,
								disabled: props.disabled,
								onClick: props.onReset,
								children: props.resetLabel
							})]
						}) : null]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						id: props.id,
						className: props.invalid ? settings_card_module_css_default.inputInvalid : settings_card_module_css_default.input,
						type: "text",
						...props.numeric === true ? { inputMode: "numeric" } : {},
						...props.invalid ? { "aria-invalid": true } : {},
						value: props.text,
						placeholder: props.placeholder ?? "",
						disabled: props.disabled,
						onChange: (event) => {
							props.onEdit(event.target.value);
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: props.invalid ? settings_card_module_css_default.invalid : settings_card_module_css_default.hint,
						children: props.invalid ? props.invalidLabel : props.hint
					})
				]
			});
		}
		/** A staged boolean field: 继承 / 开 / 关. */
		function BooleanField(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: settings_card_module_css_default.field,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: settings_card_module_css_default.head,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: settings_card_module_css_default.label,
							htmlFor: props.id,
							children: props.label
						}), props.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: settings_card_module_css_default.badges,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: settings_card_module_css_default.badge,
								children: props.overriddenLabel
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: settings_card_module_css_default.reset,
								disabled: props.disabled,
								onClick: props.onReset,
								children: props.resetLabel
							})]
						}) : null]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
						id: props.id,
						className: settings_card_module_css_default.select,
						value: props.text,
						disabled: props.disabled,
						onChange: (event) => {
							props.onEdit(event.target.value);
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "",
								children: props.inheritLabel
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "true",
								children: props.onLabel
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "false",
								children: props.offLabel
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: settings_card_module_css_default.hint,
						children: props.hint
					})
				]
			});
		}
		//#endregion
		//#region src/client/settings-form.ts
		/** A whole-number field. An empty draft clears the field; any other draft that is not a finite number blocks the save. */
		function numberField(field) {
			return {
				field,
				format: (value) => typeof value === "number" ? String(value) : "",
				parse: (text) => {
					const trimmed = text.trim();
					if (trimmed === "") return { kind: "clear" };
					const parsed = Number(trimmed);
					return Number.isFinite(parsed) ? {
						kind: "set",
						value: parsed
					} : void 0;
				}
			};
		}
		/** A free-text field. An empty draft clears the field. */
		function textField(field) {
			return {
				field,
				format: (value) => typeof value === "string" ? value : "",
				parse: (text) => {
					const trimmed = text.trim();
					return trimmed === "" ? { kind: "clear" } : {
						kind: "set",
						value: trimmed
					};
				}
			};
		}
		/** A boolean field, edited through true/false draft text. */
		function booleanField(field) {
			return {
				field,
				format: (value) => typeof value === "boolean" ? String(value) : "",
				parse: (text) => {
					if (text === "true") return {
						kind: "set",
						value: true
					};
					if (text === "false") return {
						kind: "set",
						value: false
					};
				}
			};
		}
		/**
		* Stages one card's edits over one settings namespace and writes them on save.
		*
		* The Host is the only authority on whether a value was accepted — its
		* validators own the constraints no schema can express — so the outcome is
		* read back from the section rather than predicted here. A save that did not
		* land keeps its drafts, so the user can correct them instead of retyping.
		*/
		var CardForm = class {
			scope;
			specs;
			staged = /* @__PURE__ */ new Map();
			listeners = /* @__PURE__ */ new Set();
			saving = false;
			failed = false;
			/** @param scope - the bound settings scope for this card's namespace. */
			constructor(scope, specs) {
				this.scope = scope;
				this.specs = new Map(specs.map((spec) => [spec.field, spec]));
				scope.subscribe(() => {
					this.publish();
				});
			}
			/** Publish a projection of this form, rebuilt whenever the scope or a draft changes. */
			bind(project) {
				const store = (0, _deepseek_ai_dsh_client_runtime_client.createSnapshotStore)(project());
				this.listeners.add(() => {
					store.set(project());
				});
				return store;
			}
			/** Read the card-level state: what the Host serves, and what a save would do. */
			shell() {
				const snapshot = this.scope.getSnapshot();
				const plan = this.plan();
				return {
					available: snapshot.status !== "loading",
					exposed: snapshot.status === "ready",
					writable: snapshot.writable,
					dirty: plan.length > 0,
					invalid: plan.some((item) => item.run === void 0),
					saving: this.saving,
					failed: this.failed
				};
			}
			/** Read one field's state from the effective section and its staged draft. */
			field(field) {
				const spec = this.specOf(field);
				const staged = this.staged.get(field);
				if (staged === void 0) return {
					text: spec.format(this.sectionValue(field)),
					overridden: this.stored(field),
					invalid: false
				};
				const write = staged.clear ? { kind: "clear" } : spec.parse(staged.text);
				return {
					text: staged.text,
					overridden: write?.kind === "set",
					invalid: write === void 0
				};
			}
			/** The actions the card's slot registration injects. */
			actions() {
				return {
					edit: (field, text) => {
						this.stage(field, {
							text,
							clear: false
						});
					},
					resetField: (field) => {
						this.stage(field, {
							text: this.specOf(field).format(this.baseValue(field)),
							clear: true
						});
					},
					save: () => {
						this.save();
					},
					discard: () => {
						if (this.staged.size === 0 && !this.failed) return;
						this.staged.clear();
						this.failed = false;
						this.publish();
					}
				};
			}
			/**
			* Write every staged edit, then re-seed from what the Host accepted.
			* @returns settlement after every write and the read-back.
			*/
			async save() {
				const plan = this.plan();
				const writes = plan.flatMap((item) => item.run === void 0 ? [] : [item.run]);
				if (plan.length === 0 || this.saving || writes.length !== plan.length) return;
				this.saving = true;
				this.failed = false;
				this.publish();
				let landed = true;
				for (const write of writes) landed = await write() && landed;
				if (landed) this.staged.clear();
				this.saving = false;
				this.failed = !landed;
				this.publish();
			}
			/**
			* Every staged edit a save would write. An entry whose draft is not a value
			* its field accepts carries no write: the form is still dirty, and the save
			* refuses rather than dropping the edit. A staged edit that matches the
			* effective section is not a write at all.
			* @returns the planned writes, in the order the fields were staged.
			*/
			plan() {
				const plan = [];
				for (const [field, staged] of this.staged) {
					const spec = this.specOf(field);
					if (staged.clear) {
						if (this.stored(field)) plan.push({
							field,
							run: () => this.clear(field)
						});
						continue;
					}
					if (staged.text === spec.format(this.sectionValue(field))) continue;
					const write = spec.parse(staged.text);
					if (write === void 0) plan.push({
						field,
						run: void 0
					});
					else if (write.kind === "clear") plan.push({
						field,
						run: () => this.clear(field)
					});
					else plan.push({
						field,
						run: () => this.store(field, write.value)
					});
				}
				return plan;
			}
			async clear(field) {
				await this.scope.unset(field);
				return !this.stored(field);
			}
			async store(field, value) {
				await this.scope.set(field, value);
				return this.userLayer()?.[field] === value;
			}
			stage(field, edit) {
				this.staged.set(field, edit);
				this.failed = false;
				this.publish();
			}
			specOf(field) {
				const spec = this.specs.get(field);
				if (spec === void 0) throw new Error(`settings card has no field ${field}`);
				return spec;
			}
			snapshotOf() {
				return this.scope.getSnapshot();
			}
			sectionValue(field) {
				return this.snapshotOf().value?.[field];
			}
			baseValue(field) {
				return this.snapshotOf().base?.[field];
			}
			userLayer() {
				return this.snapshotOf().user;
			}
			stored(field) {
				const user = this.userLayer();
				return user !== void 0 && Object.hasOwn(user, field);
			}
			publish() {
				for (const listener of this.listeners) listener();
			}
		};
		//#endregion
		//#region src/client/RemoteSettingsCard.tsx
		/** Bridges the `remote-web-ui` scope onto the card's staged form. */
		var RemoteSettingsCardController = class {
			form;
			store;
			/** @param scope - the bound settings scope for the `remote-web-ui` namespace. */
			constructor(scope) {
				this.form = new CardForm(scope, [
					booleanField("enabled"),
					numberField("tokenTtlMs"),
					numberField("offlineAfterMs"),
					numberField("maxDevices"),
					textField("cookieName"),
					booleanField("requirePairingForLan"),
					textField("publicBaseUrl"),
					booleanField("autoTunnel"),
					booleanField("notifyOnComplete")
				]);
				this.store = this.form.bind(() => this.projection());
			}
			projection() {
				return {
					...this.form.shell(),
					enabled: this.form.field("enabled"),
					tokenTtlMs: this.form.field("tokenTtlMs"),
					offlineAfterMs: this.form.field("offlineAfterMs"),
					maxDevices: this.form.field("maxDevices"),
					cookieName: this.form.field("cookieName"),
					requirePairingForLan: this.form.field("requirePairingForLan"),
					publicBaseUrl: this.form.field("publicBaseUrl"),
					autoTunnel: this.form.field("autoTunnel"),
					notifyOnComplete: this.form.field("notifyOnComplete")
				};
			}
			/**
			* Build the face the card's slot registration injects.
			* @returns the card's snapshot and its form actions.
			*/
			inject() {
				return {
					hooks: { remoteSettingsCard: this.store },
					...this.form.actions()
				};
			}
		};
		/**
		* Render the remote-control card.
		* @param props - locale copy, the card snapshot, and its form actions.
		* @returns the card.
		*/
		function RemoteSettingsCard(props) {
			const { t } = props;
			const state = props.useRemoteSettingsCard((snapshot) => snapshot);
			const disabled = !state.writable;
			const fieldProps = {
				overriddenLabel: t("settings.overridden"),
				resetLabel: t("settings.reset"),
				invalidLabel: t("settings.invalidNumber"),
				disabled
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(PluginSettingsCard, {
				t,
				titleKey: "settings.title",
				descriptionKey: "settings.description",
				state,
				onSave: props.save,
				onDiscard: props.discard,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BooleanField, {
						id: "settings-remote-enabled",
						label: t("settings.enabled"),
						hint: t("settings.enabledHint"),
						inheritLabel: t("settings.inherit"),
						onLabel: t("settings.on"),
						offLabel: t("settings.off"),
						...fieldProps,
						...state.enabled,
						onEdit: (text) => {
							props.edit("enabled", text);
						},
						onReset: () => {
							props.resetField("enabled");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
						id: "settings-remote-token-ttl",
						label: t("settings.tokenTtlMs"),
						hint: t("settings.tokenTtlMsHint"),
						numeric: true,
						...fieldProps,
						...state.tokenTtlMs,
						onEdit: (text) => {
							props.edit("tokenTtlMs", text);
						},
						onReset: () => {
							props.resetField("tokenTtlMs");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
						id: "settings-remote-offline",
						label: t("settings.offlineAfterMs"),
						hint: t("settings.offlineAfterMsHint"),
						numeric: true,
						...fieldProps,
						...state.offlineAfterMs,
						onEdit: (text) => {
							props.edit("offlineAfterMs", text);
						},
						onReset: () => {
							props.resetField("offlineAfterMs");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
						id: "settings-remote-max-devices",
						label: t("settings.maxDevices"),
						hint: t("settings.maxDevicesHint"),
						numeric: true,
						...fieldProps,
						...state.maxDevices,
						onEdit: (text) => {
							props.edit("maxDevices", text);
						},
						onReset: () => {
							props.resetField("maxDevices");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
						id: "settings-remote-cookie",
						label: t("settings.cookieName"),
						hint: t("settings.cookieNameHint"),
						...fieldProps,
						...state.cookieName,
						onEdit: (text) => {
							props.edit("cookieName", text);
						},
						onReset: () => {
							props.resetField("cookieName");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BooleanField, {
						id: "settings-remote-fence",
						label: t("settings.requirePairingForLan"),
						hint: t("settings.requirePairingForLanHint"),
						inheritLabel: t("settings.inherit"),
						onLabel: t("settings.on"),
						offLabel: t("settings.off"),
						...fieldProps,
						...state.requirePairingForLan,
						onEdit: (text) => {
							props.edit("requirePairingForLan", text);
						},
						onReset: () => {
							props.resetField("requirePairingForLan");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
						id: "settings-remote-public-base",
						label: t("settings.publicBaseUrl"),
						hint: t("settings.publicBaseUrlHint"),
						placeholder: "https://example.trycloudflare.com",
						...fieldProps,
						...state.publicBaseUrl,
						onEdit: (text) => {
							props.edit("publicBaseUrl", text);
						},
						onReset: () => {
							props.resetField("publicBaseUrl");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BooleanField, {
						id: "settings-remote-auto-tunnel",
						label: t("settings.autoTunnel"),
						hint: t("settings.autoTunnelHint"),
						inheritLabel: t("settings.inherit"),
						onLabel: t("settings.on"),
						offLabel: t("settings.off"),
						...fieldProps,
						...state.autoTunnel,
						onEdit: (text) => {
							props.edit("autoTunnel", text);
						},
						onReset: () => {
							props.resetField("autoTunnel");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BooleanField, {
						id: "settings-remote-notify-complete",
						label: t("settings.notifyOnComplete"),
						hint: t("settings.notifyOnCompleteHint"),
						inheritLabel: t("settings.inherit"),
						onLabel: t("settings.on"),
						offLabel: t("settings.off"),
						...fieldProps,
						...state.notifyOnComplete,
						onEdit: (text) => {
							props.edit("notifyOnComplete", text);
						},
						onReset: () => {
							props.resetField("notifyOnComplete");
						}
					})
				]
			});
		}
		//#endregion
		//#region node_modules/clsx/dist/clsx.mjs
		function r(e) {
			var t, f, n = "";
			if ("string" == typeof e || "number" == typeof e) n += e;
			else if ("object" == typeof e) if (Array.isArray(e)) {
				var o = e.length;
				for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
			} else for (f in e) e[f] && (n && (n += " "), n += f);
			return n;
		}
		function clsx() {
			for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
			return n;
		}
		//#endregion
		//#region node_modules/qrcode.react/lib/esm/index.js
		var __defProp = Object.defineProperty;
		var __getOwnPropSymbols = Object.getOwnPropertySymbols;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __propIsEnum = Object.prototype.propertyIsEnumerable;
		var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
			enumerable: true,
			configurable: true,
			writable: true,
			value
		}) : obj[key] = value;
		var __spreadValues = (a, b) => {
			for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
			if (__getOwnPropSymbols) {
				for (var prop of __getOwnPropSymbols(b)) if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
			}
			return a;
		};
		var __objRest = (source, exclude) => {
			var target = {};
			for (var prop in source) if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0) target[prop] = source[prop];
			if (source != null && __getOwnPropSymbols) {
				for (var prop of __getOwnPropSymbols(source)) if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop)) target[prop] = source[prop];
			}
			return target;
		};
		/**
		* @license QR Code generator library (TypeScript)
		* Copyright (c) Project Nayuki.
		* SPDX-License-Identifier: MIT
		*/
		var qrcodegen;
		((qrcodegen2) => {
			const _QrCode = class _QrCode {
				constructor(version, errorCorrectionLevel, dataCodewords, msk) {
					this.version = version;
					this.errorCorrectionLevel = errorCorrectionLevel;
					this.modules = [];
					this.isFunction = [];
					if (version < _QrCode.MIN_VERSION || version > _QrCode.MAX_VERSION) throw new RangeError("Version value out of range");
					if (msk < -1 || msk > 7) throw new RangeError("Mask value out of range");
					this.size = version * 4 + 17;
					let row = [];
					for (let i = 0; i < this.size; i++) row.push(false);
					for (let i = 0; i < this.size; i++) {
						this.modules.push(row.slice());
						this.isFunction.push(row.slice());
					}
					this.drawFunctionPatterns();
					const allCodewords = this.addEccAndInterleave(dataCodewords);
					this.drawCodewords(allCodewords);
					if (msk == -1) {
						let minPenalty = 1e9;
						for (let i = 0; i < 8; i++) {
							this.applyMask(i);
							this.drawFormatBits(i);
							const penalty = this.getPenaltyScore();
							if (penalty < minPenalty) {
								msk = i;
								minPenalty = penalty;
							}
							this.applyMask(i);
						}
					}
					assert(0 <= msk && msk <= 7);
					this.mask = msk;
					this.applyMask(msk);
					this.drawFormatBits(msk);
					this.isFunction = [];
				}
				static encodeText(text, ecl) {
					const segs = qrcodegen2.QrSegment.makeSegments(text);
					return _QrCode.encodeSegments(segs, ecl);
				}
				static encodeBinary(data, ecl) {
					const seg = qrcodegen2.QrSegment.makeBytes(data);
					return _QrCode.encodeSegments([seg], ecl);
				}
				static encodeSegments(segs, ecl, minVersion = 1, maxVersion = 40, mask = -1, boostEcl = true) {
					if (!(_QrCode.MIN_VERSION <= minVersion && minVersion <= maxVersion && maxVersion <= _QrCode.MAX_VERSION) || mask < -1 || mask > 7) throw new RangeError("Invalid value");
					let version;
					let dataUsedBits;
					for (version = minVersion;; version++) {
						const dataCapacityBits2 = _QrCode.getNumDataCodewords(version, ecl) * 8;
						const usedBits = QrSegment.getTotalBits(segs, version);
						if (usedBits <= dataCapacityBits2) {
							dataUsedBits = usedBits;
							break;
						}
						if (version >= maxVersion) throw new RangeError("Data too long");
					}
					for (const newEcl of [
						_QrCode.Ecc.MEDIUM,
						_QrCode.Ecc.QUARTILE,
						_QrCode.Ecc.HIGH
					]) if (boostEcl && dataUsedBits <= _QrCode.getNumDataCodewords(version, newEcl) * 8) ecl = newEcl;
					let bb = [];
					for (const seg of segs) {
						appendBits(seg.mode.modeBits, 4, bb);
						appendBits(seg.numChars, seg.mode.numCharCountBits(version), bb);
						for (const b of seg.getData()) bb.push(b);
					}
					assert(bb.length == dataUsedBits);
					const dataCapacityBits = _QrCode.getNumDataCodewords(version, ecl) * 8;
					assert(bb.length <= dataCapacityBits);
					appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb);
					appendBits(0, (8 - bb.length % 8) % 8, bb);
					assert(bb.length % 8 == 0);
					for (let padByte = 236; bb.length < dataCapacityBits; padByte ^= 253) appendBits(padByte, 8, bb);
					let dataCodewords = [];
					while (dataCodewords.length * 8 < bb.length) dataCodewords.push(0);
					bb.forEach((b, i) => dataCodewords[i >>> 3] |= b << 7 - (i & 7));
					return new _QrCode(version, ecl, dataCodewords, mask);
				}
				getModule(x, y) {
					return 0 <= x && x < this.size && 0 <= y && y < this.size && this.modules[y][x];
				}
				getModules() {
					return this.modules;
				}
				drawFunctionPatterns() {
					for (let i = 0; i < this.size; i++) {
						this.setFunctionModule(6, i, i % 2 == 0);
						this.setFunctionModule(i, 6, i % 2 == 0);
					}
					this.drawFinderPattern(3, 3);
					this.drawFinderPattern(this.size - 4, 3);
					this.drawFinderPattern(3, this.size - 4);
					const alignPatPos = this.getAlignmentPatternPositions();
					const numAlign = alignPatPos.length;
					for (let i = 0; i < numAlign; i++) for (let j = 0; j < numAlign; j++) if (!(i == 0 && j == 0 || i == 0 && j == numAlign - 1 || i == numAlign - 1 && j == 0)) this.drawAlignmentPattern(alignPatPos[i], alignPatPos[j]);
					this.drawFormatBits(0);
					this.drawVersion();
				}
				drawFormatBits(mask) {
					const data = this.errorCorrectionLevel.formatBits << 3 | mask;
					let rem = data;
					for (let i = 0; i < 10; i++) rem = rem << 1 ^ (rem >>> 9) * 1335;
					const bits = (data << 10 | rem) ^ 21522;
					assert(bits >>> 15 == 0);
					for (let i = 0; i <= 5; i++) this.setFunctionModule(8, i, getBit(bits, i));
					this.setFunctionModule(8, 7, getBit(bits, 6));
					this.setFunctionModule(8, 8, getBit(bits, 7));
					this.setFunctionModule(7, 8, getBit(bits, 8));
					for (let i = 9; i < 15; i++) this.setFunctionModule(14 - i, 8, getBit(bits, i));
					for (let i = 0; i < 8; i++) this.setFunctionModule(this.size - 1 - i, 8, getBit(bits, i));
					for (let i = 8; i < 15; i++) this.setFunctionModule(8, this.size - 15 + i, getBit(bits, i));
					this.setFunctionModule(8, this.size - 8, true);
				}
				drawVersion() {
					if (this.version < 7) return;
					let rem = this.version;
					for (let i = 0; i < 12; i++) rem = rem << 1 ^ (rem >>> 11) * 7973;
					const bits = this.version << 12 | rem;
					assert(bits >>> 18 == 0);
					for (let i = 0; i < 18; i++) {
						const color = getBit(bits, i);
						const a = this.size - 11 + i % 3;
						const b = Math.floor(i / 3);
						this.setFunctionModule(a, b, color);
						this.setFunctionModule(b, a, color);
					}
				}
				drawFinderPattern(x, y) {
					for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
						const dist = Math.max(Math.abs(dx), Math.abs(dy));
						const xx = x + dx;
						const yy = y + dy;
						if (0 <= xx && xx < this.size && 0 <= yy && yy < this.size) this.setFunctionModule(xx, yy, dist != 2 && dist != 4);
					}
				}
				drawAlignmentPattern(x, y) {
					for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) != 1);
				}
				setFunctionModule(x, y, isDark) {
					this.modules[y][x] = isDark;
					this.isFunction[y][x] = true;
				}
				addEccAndInterleave(data) {
					const ver = this.version;
					const ecl = this.errorCorrectionLevel;
					if (data.length != _QrCode.getNumDataCodewords(ver, ecl)) throw new RangeError("Invalid argument");
					const numBlocks = _QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
					const blockEccLen = _QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver];
					const rawCodewords = Math.floor(_QrCode.getNumRawDataModules(ver) / 8);
					const numShortBlocks = numBlocks - rawCodewords % numBlocks;
					const shortBlockLen = Math.floor(rawCodewords / numBlocks);
					let blocks = [];
					const rsDiv = _QrCode.reedSolomonComputeDivisor(blockEccLen);
					for (let i = 0, k = 0; i < numBlocks; i++) {
						let dat = data.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
						k += dat.length;
						const ecc = _QrCode.reedSolomonComputeRemainder(dat, rsDiv);
						if (i < numShortBlocks) dat.push(0);
						blocks.push(dat.concat(ecc));
					}
					let result = [];
					for (let i = 0; i < blocks[0].length; i++) blocks.forEach((block, j) => {
						if (i != shortBlockLen - blockEccLen || j >= numShortBlocks) result.push(block[i]);
					});
					assert(result.length == rawCodewords);
					return result;
				}
				drawCodewords(data) {
					if (data.length != Math.floor(_QrCode.getNumRawDataModules(this.version) / 8)) throw new RangeError("Invalid argument");
					let i = 0;
					for (let right = this.size - 1; right >= 1; right -= 2) {
						if (right == 6) right = 5;
						for (let vert = 0; vert < this.size; vert++) for (let j = 0; j < 2; j++) {
							const x = right - j;
							const y = (right + 1 & 2) == 0 ? this.size - 1 - vert : vert;
							if (!this.isFunction[y][x] && i < data.length * 8) {
								this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
								i++;
							}
						}
					}
					assert(i == data.length * 8);
				}
				applyMask(mask) {
					if (mask < 0 || mask > 7) throw new RangeError("Mask value out of range");
					for (let y = 0; y < this.size; y++) for (let x = 0; x < this.size; x++) {
						let invert;
						switch (mask) {
							case 0:
								invert = (x + y) % 2 == 0;
								break;
							case 1:
								invert = y % 2 == 0;
								break;
							case 2:
								invert = x % 3 == 0;
								break;
							case 3:
								invert = (x + y) % 3 == 0;
								break;
							case 4:
								invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 == 0;
								break;
							case 5:
								invert = x * y % 2 + x * y % 3 == 0;
								break;
							case 6:
								invert = (x * y % 2 + x * y % 3) % 2 == 0;
								break;
							case 7:
								invert = ((x + y) % 2 + x * y % 3) % 2 == 0;
								break;
							default: throw new Error("Unreachable");
						}
						if (!this.isFunction[y][x] && invert) this.modules[y][x] = !this.modules[y][x];
					}
				}
				getPenaltyScore() {
					let result = 0;
					for (let y = 0; y < this.size; y++) {
						let runColor = false;
						let runX = 0;
						let runHistory = [
							0,
							0,
							0,
							0,
							0,
							0,
							0
						];
						for (let x = 0; x < this.size; x++) if (this.modules[y][x] == runColor) {
							runX++;
							if (runX == 5) result += _QrCode.PENALTY_N1;
							else if (runX > 5) result++;
						} else {
							this.finderPenaltyAddHistory(runX, runHistory);
							if (!runColor) result += this.finderPenaltyCountPatterns(runHistory) * _QrCode.PENALTY_N3;
							runColor = this.modules[y][x];
							runX = 1;
						}
						result += this.finderPenaltyTerminateAndCount(runColor, runX, runHistory) * _QrCode.PENALTY_N3;
					}
					for (let x = 0; x < this.size; x++) {
						let runColor = false;
						let runY = 0;
						let runHistory = [
							0,
							0,
							0,
							0,
							0,
							0,
							0
						];
						for (let y = 0; y < this.size; y++) if (this.modules[y][x] == runColor) {
							runY++;
							if (runY == 5) result += _QrCode.PENALTY_N1;
							else if (runY > 5) result++;
						} else {
							this.finderPenaltyAddHistory(runY, runHistory);
							if (!runColor) result += this.finderPenaltyCountPatterns(runHistory) * _QrCode.PENALTY_N3;
							runColor = this.modules[y][x];
							runY = 1;
						}
						result += this.finderPenaltyTerminateAndCount(runColor, runY, runHistory) * _QrCode.PENALTY_N3;
					}
					for (let y = 0; y < this.size - 1; y++) for (let x = 0; x < this.size - 1; x++) {
						const color = this.modules[y][x];
						if (color == this.modules[y][x + 1] && color == this.modules[y + 1][x] && color == this.modules[y + 1][x + 1]) result += _QrCode.PENALTY_N2;
					}
					let dark = 0;
					for (const row of this.modules) dark = row.reduce((sum, color) => sum + (color ? 1 : 0), dark);
					const total = this.size * this.size;
					const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
					assert(0 <= k && k <= 9);
					result += k * _QrCode.PENALTY_N4;
					assert(0 <= result && result <= 2568888);
					return result;
				}
				getAlignmentPatternPositions() {
					if (this.version == 1) return [];
					else {
						const numAlign = Math.floor(this.version / 7) + 2;
						const step = this.version == 32 ? 26 : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2;
						let result = [6];
						for (let pos = this.size - 7; result.length < numAlign; pos -= step) result.splice(1, 0, pos);
						return result;
					}
				}
				static getNumRawDataModules(ver) {
					if (ver < _QrCode.MIN_VERSION || ver > _QrCode.MAX_VERSION) throw new RangeError("Version number out of range");
					let result = (16 * ver + 128) * ver + 64;
					if (ver >= 2) {
						const numAlign = Math.floor(ver / 7) + 2;
						result -= (25 * numAlign - 10) * numAlign - 55;
						if (ver >= 7) result -= 36;
					}
					assert(208 <= result && result <= 29648);
					return result;
				}
				static getNumDataCodewords(ver, ecl) {
					return Math.floor(_QrCode.getNumRawDataModules(ver) / 8) - _QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver] * _QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
				}
				static reedSolomonComputeDivisor(degree) {
					if (degree < 1 || degree > 255) throw new RangeError("Degree out of range");
					let result = [];
					for (let i = 0; i < degree - 1; i++) result.push(0);
					result.push(1);
					let root = 1;
					for (let i = 0; i < degree; i++) {
						for (let j = 0; j < result.length; j++) {
							result[j] = _QrCode.reedSolomonMultiply(result[j], root);
							if (j + 1 < result.length) result[j] ^= result[j + 1];
						}
						root = _QrCode.reedSolomonMultiply(root, 2);
					}
					return result;
				}
				static reedSolomonComputeRemainder(data, divisor) {
					let result = divisor.map((_) => 0);
					for (const b of data) {
						const factor = b ^ result.shift();
						result.push(0);
						divisor.forEach((coef, i) => result[i] ^= _QrCode.reedSolomonMultiply(coef, factor));
					}
					return result;
				}
				static reedSolomonMultiply(x, y) {
					if (x >>> 8 != 0 || y >>> 8 != 0) throw new RangeError("Byte out of range");
					let z = 0;
					for (let i = 7; i >= 0; i--) {
						z = z << 1 ^ (z >>> 7) * 285;
						z ^= (y >>> i & 1) * x;
					}
					assert(z >>> 8 == 0);
					return z;
				}
				finderPenaltyCountPatterns(runHistory) {
					const n = runHistory[1];
					assert(n <= this.size * 3);
					const core = n > 0 && runHistory[2] == n && runHistory[3] == n * 3 && runHistory[4] == n && runHistory[5] == n;
					return (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0) + (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0);
				}
				finderPenaltyTerminateAndCount(currentRunColor, currentRunLength, runHistory) {
					if (currentRunColor) {
						this.finderPenaltyAddHistory(currentRunLength, runHistory);
						currentRunLength = 0;
					}
					currentRunLength += this.size;
					this.finderPenaltyAddHistory(currentRunLength, runHistory);
					return this.finderPenaltyCountPatterns(runHistory);
				}
				finderPenaltyAddHistory(currentRunLength, runHistory) {
					if (runHistory[0] == 0) currentRunLength += this.size;
					runHistory.pop();
					runHistory.unshift(currentRunLength);
				}
			};
			_QrCode.MIN_VERSION = 1;
			_QrCode.MAX_VERSION = 40;
			_QrCode.PENALTY_N1 = 3;
			_QrCode.PENALTY_N2 = 3;
			_QrCode.PENALTY_N3 = 40;
			_QrCode.PENALTY_N4 = 10;
			_QrCode.ECC_CODEWORDS_PER_BLOCK = [
				[
					-1,
					7,
					10,
					15,
					20,
					26,
					18,
					20,
					24,
					30,
					18,
					20,
					24,
					26,
					30,
					22,
					24,
					28,
					30,
					28,
					28,
					28,
					28,
					30,
					30,
					26,
					28,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30
				],
				[
					-1,
					10,
					16,
					26,
					18,
					24,
					16,
					18,
					22,
					22,
					26,
					30,
					22,
					22,
					24,
					24,
					28,
					28,
					26,
					26,
					26,
					26,
					28,
					28,
					28,
					28,
					28,
					28,
					28,
					28,
					28,
					28,
					28,
					28,
					28,
					28,
					28,
					28,
					28,
					28,
					28
				],
				[
					-1,
					13,
					22,
					18,
					26,
					18,
					24,
					18,
					22,
					20,
					24,
					28,
					26,
					24,
					20,
					30,
					24,
					28,
					28,
					26,
					30,
					28,
					30,
					30,
					30,
					30,
					28,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30
				],
				[
					-1,
					17,
					28,
					22,
					16,
					22,
					28,
					26,
					26,
					24,
					28,
					24,
					28,
					22,
					24,
					24,
					30,
					28,
					28,
					26,
					28,
					30,
					24,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30,
					30
				]
			];
			_QrCode.NUM_ERROR_CORRECTION_BLOCKS = [
				[
					-1,
					1,
					1,
					1,
					1,
					1,
					2,
					2,
					2,
					2,
					4,
					4,
					4,
					4,
					4,
					6,
					6,
					6,
					6,
					7,
					8,
					8,
					9,
					9,
					10,
					12,
					12,
					12,
					13,
					14,
					15,
					16,
					17,
					18,
					19,
					19,
					20,
					21,
					22,
					24,
					25
				],
				[
					-1,
					1,
					1,
					1,
					2,
					2,
					4,
					4,
					4,
					5,
					5,
					5,
					8,
					9,
					9,
					10,
					10,
					11,
					13,
					14,
					16,
					17,
					17,
					18,
					20,
					21,
					23,
					25,
					26,
					28,
					29,
					31,
					33,
					35,
					37,
					38,
					40,
					43,
					45,
					47,
					49
				],
				[
					-1,
					1,
					1,
					2,
					2,
					4,
					4,
					6,
					6,
					8,
					8,
					8,
					10,
					12,
					16,
					12,
					17,
					16,
					18,
					21,
					20,
					23,
					23,
					25,
					27,
					29,
					34,
					34,
					35,
					38,
					40,
					43,
					45,
					48,
					51,
					53,
					56,
					59,
					62,
					65,
					68
				],
				[
					-1,
					1,
					1,
					2,
					4,
					4,
					4,
					5,
					6,
					8,
					8,
					11,
					11,
					16,
					16,
					18,
					16,
					19,
					21,
					25,
					25,
					25,
					34,
					30,
					32,
					35,
					37,
					40,
					42,
					45,
					48,
					51,
					54,
					57,
					60,
					63,
					66,
					70,
					74,
					77,
					81
				]
			];
			qrcodegen2.QrCode = _QrCode;
			function appendBits(val, len, bb) {
				if (len < 0 || len > 31 || val >>> len != 0) throw new RangeError("Value out of range");
				for (let i = len - 1; i >= 0; i--) bb.push(val >>> i & 1);
			}
			function getBit(x, i) {
				return (x >>> i & 1) != 0;
			}
			function assert(cond) {
				if (!cond) throw new Error("Assertion error");
			}
			const _QrSegment = class _QrSegment {
				constructor(mode, numChars, bitData) {
					this.mode = mode;
					this.numChars = numChars;
					this.bitData = bitData;
					if (numChars < 0) throw new RangeError("Invalid argument");
					this.bitData = bitData.slice();
				}
				static makeBytes(data) {
					let bb = [];
					for (const b of data) appendBits(b, 8, bb);
					return new _QrSegment(_QrSegment.Mode.BYTE, data.length, bb);
				}
				static makeNumeric(digits) {
					if (!_QrSegment.isNumeric(digits)) throw new RangeError("String contains non-numeric characters");
					let bb = [];
					for (let i = 0; i < digits.length;) {
						const n = Math.min(digits.length - i, 3);
						appendBits(parseInt(digits.substring(i, i + n), 10), n * 3 + 1, bb);
						i += n;
					}
					return new _QrSegment(_QrSegment.Mode.NUMERIC, digits.length, bb);
				}
				static makeAlphanumeric(text) {
					if (!_QrSegment.isAlphanumeric(text)) throw new RangeError("String contains unencodable characters in alphanumeric mode");
					let bb = [];
					let i;
					for (i = 0; i + 2 <= text.length; i += 2) {
						let temp = _QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45;
						temp += _QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1));
						appendBits(temp, 11, bb);
					}
					if (i < text.length) appendBits(_QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bb);
					return new _QrSegment(_QrSegment.Mode.ALPHANUMERIC, text.length, bb);
				}
				static makeSegments(text) {
					if (text == "") return [];
					else if (_QrSegment.isNumeric(text)) return [_QrSegment.makeNumeric(text)];
					else if (_QrSegment.isAlphanumeric(text)) return [_QrSegment.makeAlphanumeric(text)];
					else return [_QrSegment.makeBytes(_QrSegment.toUtf8ByteArray(text))];
				}
				static makeEci(assignVal) {
					let bb = [];
					if (assignVal < 0) throw new RangeError("ECI assignment value out of range");
					else if (assignVal < 128) appendBits(assignVal, 8, bb);
					else if (assignVal < 16384) {
						appendBits(2, 2, bb);
						appendBits(assignVal, 14, bb);
					} else if (assignVal < 1e6) {
						appendBits(6, 3, bb);
						appendBits(assignVal, 21, bb);
					} else throw new RangeError("ECI assignment value out of range");
					return new _QrSegment(_QrSegment.Mode.ECI, 0, bb);
				}
				static isNumeric(text) {
					return _QrSegment.NUMERIC_REGEX.test(text);
				}
				static isAlphanumeric(text) {
					return _QrSegment.ALPHANUMERIC_REGEX.test(text);
				}
				getData() {
					return this.bitData.slice();
				}
				static getTotalBits(segs, version) {
					let result = 0;
					for (const seg of segs) {
						const ccbits = seg.mode.numCharCountBits(version);
						if (seg.numChars >= 1 << ccbits) return Infinity;
						result += 4 + ccbits + seg.bitData.length;
					}
					return result;
				}
				static toUtf8ByteArray(str) {
					str = encodeURI(str);
					let result = [];
					for (let i = 0; i < str.length; i++) if (str.charAt(i) != "%") result.push(str.charCodeAt(i));
					else {
						result.push(parseInt(str.substring(i + 1, i + 3), 16));
						i += 2;
					}
					return result;
				}
			};
			_QrSegment.NUMERIC_REGEX = /^[0-9]*$/;
			_QrSegment.ALPHANUMERIC_REGEX = /^[A-Z0-9 $%*+.\/:-]*$/;
			_QrSegment.ALPHANUMERIC_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
			let QrSegment = _QrSegment;
			qrcodegen2.QrSegment = _QrSegment;
		})(qrcodegen || (qrcodegen = {}));
		((qrcodegen2) => {
			((QrCode2) => {
				const _Ecc = class _Ecc {
					constructor(ordinal, formatBits) {
						this.ordinal = ordinal;
						this.formatBits = formatBits;
					}
				};
				_Ecc.LOW = new _Ecc(0, 1);
				_Ecc.MEDIUM = new _Ecc(1, 0);
				_Ecc.QUARTILE = new _Ecc(2, 3);
				_Ecc.HIGH = new _Ecc(3, 2);
				QrCode2.Ecc = _Ecc;
			})(qrcodegen2.QrCode || (qrcodegen2.QrCode = {}));
		})(qrcodegen || (qrcodegen = {}));
		((qrcodegen2) => {
			((QrSegment2) => {
				const _Mode = class _Mode {
					constructor(modeBits, numBitsCharCount) {
						this.modeBits = modeBits;
						this.numBitsCharCount = numBitsCharCount;
					}
					numCharCountBits(ver) {
						return this.numBitsCharCount[Math.floor((ver + 7) / 17)];
					}
				};
				_Mode.NUMERIC = new _Mode(1, [
					10,
					12,
					14
				]);
				_Mode.ALPHANUMERIC = new _Mode(2, [
					9,
					11,
					13
				]);
				_Mode.BYTE = new _Mode(4, [
					8,
					16,
					16
				]);
				_Mode.KANJI = new _Mode(8, [
					8,
					10,
					12
				]);
				_Mode.ECI = new _Mode(7, [
					0,
					0,
					0
				]);
				QrSegment2.Mode = _Mode;
			})(qrcodegen2.QrSegment || (qrcodegen2.QrSegment = {}));
		})(qrcodegen || (qrcodegen = {}));
		var qrcodegen_default = qrcodegen;
		/**
		* @license qrcode.react
		* Copyright (c) Paul O'Shannessy
		* SPDX-License-Identifier: ISC
		*/
		var ERROR_LEVEL_MAP = {
			L: qrcodegen_default.QrCode.Ecc.LOW,
			M: qrcodegen_default.QrCode.Ecc.MEDIUM,
			Q: qrcodegen_default.QrCode.Ecc.QUARTILE,
			H: qrcodegen_default.QrCode.Ecc.HIGH
		};
		var DEFAULT_SIZE = 128;
		var DEFAULT_LEVEL = "L";
		var DEFAULT_BGCOLOR = "#FFFFFF";
		var DEFAULT_FGCOLOR = "#000000";
		var DEFAULT_INCLUDEMARGIN = false;
		var DEFAULT_MINVERSION = 1;
		var SPEC_MARGIN_SIZE = 4;
		var DEFAULT_MARGIN_SIZE = 0;
		var DEFAULT_IMG_SCALE = .1;
		function generatePath(modules, margin = 0) {
			const ops = [];
			modules.forEach(function(row, y) {
				let start = null;
				row.forEach(function(cell, x) {
					if (!cell && start !== null) {
						ops.push(`M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`);
						start = null;
						return;
					}
					if (x === row.length - 1) {
						if (!cell) return;
						if (start === null) ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`);
						else ops.push(`M${start + margin},${y + margin} h${x + 1 - start}v1H${start + margin}z`);
						return;
					}
					if (cell && start === null) start = x;
				});
			});
			return ops.join("");
		}
		function excavateModules(modules, excavation) {
			return modules.slice().map((row, y) => {
				if (y < excavation.y || y >= excavation.y + excavation.h) return row;
				return row.map((cell, x) => {
					if (x < excavation.x || x >= excavation.x + excavation.w) return cell;
					return false;
				});
			});
		}
		function getImageSettings(cells, size, margin, imageSettings) {
			if (imageSettings == null) return null;
			const numCells = cells.length + margin * 2;
			const defaultSize = Math.floor(size * DEFAULT_IMG_SCALE);
			const scale = numCells / size;
			const w = (imageSettings.width || defaultSize) * scale;
			const h = (imageSettings.height || defaultSize) * scale;
			const x = imageSettings.x == null ? cells.length / 2 - w / 2 : imageSettings.x * scale;
			const y = imageSettings.y == null ? cells.length / 2 - h / 2 : imageSettings.y * scale;
			const opacity = imageSettings.opacity == null ? 1 : imageSettings.opacity;
			let excavation = null;
			if (imageSettings.excavate) {
				let floorX = Math.floor(x);
				let floorY = Math.floor(y);
				excavation = {
					x: floorX,
					y: floorY,
					w: Math.ceil(w + x - floorX),
					h: Math.ceil(h + y - floorY)
				};
			}
			const crossOrigin = imageSettings.crossOrigin;
			return {
				x,
				y,
				h,
				w,
				excavation,
				opacity,
				crossOrigin
			};
		}
		function getMarginSize(includeMargin, marginSize) {
			if (marginSize != null) return Math.max(Math.floor(marginSize), 0);
			return includeMargin ? SPEC_MARGIN_SIZE : DEFAULT_MARGIN_SIZE;
		}
		function useQRCode({ value, level, minVersion, includeMargin, marginSize, imageSettings, size, boostLevel }) {
			let qrcode = react.default.useMemo(() => {
				const segments = (Array.isArray(value) ? value : [value]).reduce((accum, v) => {
					accum.push(...qrcodegen_default.QrSegment.makeSegments(v));
					return accum;
				}, []);
				return qrcodegen_default.QrCode.encodeSegments(segments, ERROR_LEVEL_MAP[level], minVersion, void 0, void 0, boostLevel);
			}, [
				value,
				level,
				minVersion,
				boostLevel
			]);
			const { cells, margin, numCells, calculatedImageSettings } = react.default.useMemo(() => {
				let cells2 = qrcode.getModules();
				const margin2 = getMarginSize(includeMargin, marginSize);
				return {
					cells: cells2,
					margin: margin2,
					numCells: cells2.length + margin2 * 2,
					calculatedImageSettings: getImageSettings(cells2, size, margin2, imageSettings)
				};
			}, [
				qrcode,
				size,
				imageSettings,
				includeMargin,
				marginSize
			]);
			return {
				qrcode,
				margin,
				cells,
				numCells,
				calculatedImageSettings
			};
		}
		var SUPPORTS_PATH2D = function() {
			try {
				new Path2D().addPath(new Path2D());
			} catch (e) {
				return false;
			}
			return true;
		}();
		var QRCodeCanvas = react.default.forwardRef(function QRCodeCanvas2(props, forwardedRef) {
			const _a = props, { value, size = DEFAULT_SIZE, level = DEFAULT_LEVEL, bgColor = DEFAULT_BGCOLOR, fgColor = DEFAULT_FGCOLOR, includeMargin = DEFAULT_INCLUDEMARGIN, minVersion = DEFAULT_MINVERSION, boostLevel, marginSize, imageSettings } = _a;
			const _b = __objRest(_a, [
				"value",
				"size",
				"level",
				"bgColor",
				"fgColor",
				"includeMargin",
				"minVersion",
				"boostLevel",
				"marginSize",
				"imageSettings"
			]), { style } = _b, otherProps = __objRest(_b, ["style"]);
			const imgSrc = imageSettings == null ? void 0 : imageSettings.src;
			const _canvas = react.default.useRef(null);
			const _image = react.default.useRef(null);
			const setCanvasRef = react.default.useCallback((node) => {
				_canvas.current = node;
				if (typeof forwardedRef === "function") forwardedRef(node);
				else if (forwardedRef) forwardedRef.current = node;
			}, [forwardedRef]);
			const [isImgLoaded, setIsImageLoaded] = react.default.useState(false);
			const { margin, cells, numCells, calculatedImageSettings } = useQRCode({
				value,
				level,
				minVersion,
				boostLevel,
				includeMargin,
				marginSize,
				imageSettings,
				size
			});
			react.default.useEffect(() => {
				if (_canvas.current != null) {
					const canvas = _canvas.current;
					const ctx = canvas.getContext("2d");
					if (!ctx) return;
					let cellsToDraw = cells;
					const image = _image.current;
					const haveImageToRender = calculatedImageSettings != null && image !== null && image.complete && image.naturalHeight !== 0 && image.naturalWidth !== 0;
					if (haveImageToRender) {
						if (calculatedImageSettings.excavation != null) cellsToDraw = excavateModules(cells, calculatedImageSettings.excavation);
					}
					const pixelRatio = window.devicePixelRatio || 1;
					canvas.height = canvas.width = size * pixelRatio;
					const scale = size / numCells * pixelRatio;
					ctx.scale(scale, scale);
					ctx.fillStyle = bgColor;
					ctx.fillRect(0, 0, numCells, numCells);
					ctx.fillStyle = fgColor;
					if (SUPPORTS_PATH2D) ctx.fill(new Path2D(generatePath(cellsToDraw, margin)));
					else cells.forEach(function(row, rdx) {
						row.forEach(function(cell, cdx) {
							if (cell) ctx.fillRect(cdx + margin, rdx + margin, 1, 1);
						});
					});
					if (calculatedImageSettings) ctx.globalAlpha = calculatedImageSettings.opacity;
					if (haveImageToRender) ctx.drawImage(image, calculatedImageSettings.x + margin, calculatedImageSettings.y + margin, calculatedImageSettings.w, calculatedImageSettings.h);
				}
			});
			react.default.useEffect(() => {
				setIsImageLoaded(false);
			}, [imgSrc]);
			const canvasStyle = __spreadValues({
				height: size,
				width: size
			}, style);
			let img = null;
			if (imgSrc != null) img = /* @__PURE__ */ react.default.createElement("img", {
				src: imgSrc,
				key: imgSrc,
				style: { display: "none" },
				onLoad: () => {
					setIsImageLoaded(true);
				},
				ref: _image,
				crossOrigin: calculatedImageSettings == null ? void 0 : calculatedImageSettings.crossOrigin
			});
			return /* @__PURE__ */ react.default.createElement(react.default.Fragment, null, /* @__PURE__ */ react.default.createElement("canvas", __spreadValues({
				style: canvasStyle,
				height: size,
				width: size,
				ref: setCanvasRef,
				role: "img"
			}, otherProps)), img);
		});
		QRCodeCanvas.displayName = "QRCodeCanvas";
		var QRCodeSVG = react.default.forwardRef(function QRCodeSVG2(props, forwardedRef) {
			const _a = props, { value, size = DEFAULT_SIZE, level = DEFAULT_LEVEL, bgColor = DEFAULT_BGCOLOR, fgColor = DEFAULT_FGCOLOR, includeMargin = DEFAULT_INCLUDEMARGIN, minVersion = DEFAULT_MINVERSION, boostLevel, title, marginSize, imageSettings } = _a, otherProps = __objRest(_a, [
				"value",
				"size",
				"level",
				"bgColor",
				"fgColor",
				"includeMargin",
				"minVersion",
				"boostLevel",
				"title",
				"marginSize",
				"imageSettings"
			]);
			const { margin, cells, numCells, calculatedImageSettings } = useQRCode({
				value,
				level,
				minVersion,
				boostLevel,
				includeMargin,
				marginSize,
				imageSettings,
				size
			});
			let cellsToDraw = cells;
			let image = null;
			if (imageSettings != null && calculatedImageSettings != null) {
				if (calculatedImageSettings.excavation != null) cellsToDraw = excavateModules(cells, calculatedImageSettings.excavation);
				image = /* @__PURE__ */ react.default.createElement("image", {
					href: imageSettings.src,
					height: calculatedImageSettings.h,
					width: calculatedImageSettings.w,
					x: calculatedImageSettings.x + margin,
					y: calculatedImageSettings.y + margin,
					preserveAspectRatio: "none",
					opacity: calculatedImageSettings.opacity,
					crossOrigin: calculatedImageSettings.crossOrigin
				});
			}
			const fgPath = generatePath(cellsToDraw, margin);
			return /* @__PURE__ */ react.default.createElement("svg", __spreadValues({
				height: size,
				width: size,
				viewBox: `0 0 ${numCells} ${numCells}`,
				ref: forwardedRef,
				role: "img"
			}, otherProps), !!title && /* @__PURE__ */ react.default.createElement("title", null, title), /* @__PURE__ */ react.default.createElement("path", {
				fill: bgColor,
				d: `M0,0 h${numCells}v${numCells}H0z`,
				shapeRendering: "crispEdges"
			}), /* @__PURE__ */ react.default.createElement("path", {
				fill: fgColor,
				d: fgPath,
				shapeRendering: "crispEdges"
			}), image);
		});
		QRCodeSVG.displayName = "QRCodeSVG";
		//#endregion
		//#region src/client/pair-api.ts
		/**
		* Mint a fresh pairing token (one active token at a time — this invalidates
		* any previous link).
		* @param workspaceId - optional current workspace to deep-link the phone into.
		* @param address - optional LAN IP literal the QR must be built from (the
		* default is the first interface); unknown literals refuse with
		* 'unknown-address'.
		* @returns the issued link, the lan-required refusal (server never bound
		* 0.0.0.0), or the forbidden refusal (the loopback-only fence rejected this
		* origin — the panel is a desktop control endpoint).
		*/
		async function issuePair(workspaceId, address) {
			const response = await fetch("/api/pair/issue", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					...workspaceId !== void 0 ? { workspaceId } : {},
					...address !== void 0 ? { address } : {}
				})
			});
			if (!response.ok) {
				if (response.status === 409) return {
					ok: false,
					code: "lan-required"
				};
				if (response.status === 403) return {
					ok: false,
					code: "forbidden"
				};
				if (response.status === 400) return {
					ok: false,
					code: "unknown-address"
				};
				throw new Error(`remote-web-ui: issue failed with ${String(response.status)}`);
			}
			return await response.json();
		}
		/**
		* Accept a pairing token (the phone's first open of the QR link). Success
		* sets the device cookie; the page then reloads to boot with it.
		* @param token - the token from the URL.
		* @returns the wire result.
		*/
		async function acceptPair(token) {
			const response = await fetch("/api/pair/accept", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ token })
			});
			if (response.ok) return { ok: true };
			if (response.status === 404) return {
				ok: false,
				code: "invalid"
			};
			if (response.status === 409) return {
				ok: false,
				code: "used"
			};
			return {
				ok: false,
				code: "forbidden"
			};
		}
		/** Revoke mobile access (paired devices + the current token). */
		async function stopPair() {
			const response = await fetch("/api/pair/stop", { method: "POST" });
			if (!response.ok) throw new Error(`remote-web-ui: stop failed with ${String(response.status)}`);
		}
		/** Presence heartbeat from a paired phone (unpaired heartbeats 401 harmlessly). */
		async function sendHeartbeat() {
			await fetch("/api/pair/heartbeat", { method: "POST" });
		}
		/** Whether the current page URL carries a pairing token / workspace target. */
		function readPairParams(search) {
			const params = new URLSearchParams(search);
			const pair = params.get("pair");
			const workspace = params.get("workspace");
			return {
				...pair !== null && pair !== "" ? { pair } : {},
				...workspace !== null && workspace !== "" ? { workspace } : {}
			};
		}
		function formatClock(epochMs) {
			const date = new Date(epochMs);
			return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
		}
		/**
		* Copy text to the clipboard with a fallback for insecure contexts
		* (plain-HTTP LAN origins lack navigator.clipboard).
		* @param text - the text to copy.
		* @returns whether the copy succeeded.
		*/
		async function copyText(text) {
			if (typeof navigator !== "undefined" && navigator.clipboard !== void 0) try {
				await navigator.clipboard.writeText(text);
				return true;
			} catch {}
			try {
				const area = document.createElement("textarea");
				area.value = text;
				area.style.position = "fixed";
				area.style.opacity = "0";
				document.body.appendChild(area);
				area.select();
				const ok = document.execCommand("copy");
				area.remove();
				return ok;
			} catch {
				return false;
			}
		}
		//#endregion
		//#region src/client/RemotePanel.tsx
		/**
		* The mobile remote-control panel body: status card (state text + badge),
		* the QR code, the open-on-phone hint with the link text, and the three
		* actions (stop / refresh / copy). Pure presentation — all state and
		* actions arrive through props from the entry's behavior component.
		*/
		/** Badge text + tone per phase (ready states only). */
		function statusOf(t, state) {
			switch (state.phase) {
				case "connected": return {
					text: t("status.connected", { n: state.onlineCount }),
					tone: "connected"
				};
				case "disconnected": return {
					text: t("status.disconnected"),
					tone: "disconnected"
				};
				case "stopped": return {
					text: t("status.stopped"),
					tone: "stopped"
				};
				case "lan-required": return {
					text: t("status.lanRequired"),
					tone: "stopped"
				};
				case "waiting": return {
					text: t("status.waiting"),
					tone: "waiting"
				};
			}
		}
		/**
		* Render the pairing panel.
		* @param props - copy, state, and actions.
		* @returns the panel element tree.
		*/
		function RemotePanel({ t, state, copied, embedded, onClose, onStop, onRefresh, onCopy, onPickAddress, onPickPublic }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: embedded === true ? remote_module_css_default.panelEmbedded : remote_module_css_default.panel,
				role: embedded === true ? "region" : "dialog",
				"aria-modal": embedded === true ? void 0 : "true",
				"aria-label": t("title"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: remote_module_css_default.header,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: remote_module_css_default.heading,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
							className: remote_module_css_default.title,
							children: t("title")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: remote_module_css_default.subtitle,
							children: t("subtitle")
						})]
					}), embedded !== true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: remote_module_css_default.close,
						"aria-label": t("close.label"),
						onClick: onClose,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 14 })
					})]
				}), state.kind === "lan-required" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: remote_module_css_default.banner,
					role: "alert",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: remote_module_css_default.bannerTitle,
						children: t("status.lanRequired")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: remote_module_css_default.bannerHint,
						children: t("status.lanRequiredHint")
					})]
				}) : state.kind === "loopback-required" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: remote_module_css_default.banner,
					role: "alert",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: remote_module_css_default.bannerTitle,
						children: t("status.loopbackRequired")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: remote_module_css_default.bannerHint,
						children: t("status.loopbackRequiredHint")
					})]
				}) : state.kind === "unreachable" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: remote_module_css_default.banner,
					role: "alert",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: remote_module_css_default.bannerTitle,
						children: t("status.unreachable")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: remote_module_css_default.bannerHint,
						children: t("status.unreachableHint")
					})]
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: remote_module_css_default.card,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: remote_module_css_default.cardHeader,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: remote_module_css_default.cardTitle,
									children: t("card.title")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: remote_module_css_default.badges,
									children: [state.public && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: clsx(remote_module_css_default.badge, remote_module_css_default.badgePublic),
										children: t("public.badge")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: clsx(remote_module_css_default.badge, remote_module_css_default[`badge-${statusOf(t, state).tone}`]),
										children: statusOf(t, state).text
									})]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: remote_module_css_default.qrWrap,
								"data-testid": "remote-qr",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(QRCodeSVG, {
									value: state.url,
									size: 184,
									level: "M",
									marginSize: 1,
									className: remote_module_css_default.qr
								})
							}),
							state.expired ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: remote_module_css_default.expired,
								children: t("pair.expired")
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: remote_module_css_default.expiry,
								children: t("pair.expires", { time: formatClock(state.expiresAt) })
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: remote_module_css_default.hint,
						children: state.public ? t("pair.publicHint") : t("pair.hint")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: remote_module_css_default.link,
						title: state.url,
						children: state.url
					}),
					state.phase === "stopped" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: remote_module_css_default.stoppedHint,
						children: t("stopped.hint")
					}),
					state.tunnel !== void 0 && state.tunnel.state !== "running" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: state.tunnel.state === "failed" ? remote_module_css_default.tunnelFailed : remote_module_css_default.tunnelNote,
						role: "status",
						children: state.tunnel.state === "failed" ? t("tunnel.failed", { error: state.tunnel.error ?? t("tunnel.unknownError") }) : t("tunnel.starting")
					}),
					(state.publicBaseUrl !== void 0 || state.lanAddresses.length > 1) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("fieldset", {
						className: remote_module_css_default.addresses,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("legend", { children: t("address.label") }),
							state.publicBaseUrl !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: remote_module_css_default.address,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "radio",
										name: "lan-address",
										"aria-label": t("address.public"),
										checked: state.public,
										onChange: onPickPublic
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("address.public") }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
										className: remote_module_css_default.addressValue,
										children: state.publicBaseUrl
									})
								]
							}, "public"),
							state.lanAddresses.map((address) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: remote_module_css_default.address,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "radio",
										name: "lan-address",
										"aria-label": address,
										checked: !state.public && address === state.address,
										onChange: () => onPickAddress(address)
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("address.lan") }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
										className: remote_module_css_default.addressValue,
										children: address
									})
								]
							}, address)),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: remote_module_css_default.addressHint,
								children: t("address.hint")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: remote_module_css_default.actions,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: remote_module_css_default.action,
								onClick: onStop,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconStopFill16, { size: 14 }), t("action.stop")]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: remote_module_css_default.action,
								onClick: onRefresh,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline16, { size: 14 }), t("action.refresh")]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: remote_module_css_default.action,
								onClick: onCopy,
								children: [copied ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, { size: 14 }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLinkOutline16, { size: 14 }), copied ? t("action.copied") : t("action.copy")]
							})
						]
					})
				] })]
			});
		}
		//#endregion
		//#region src/client/RemotePairing.tsx
		/**
		* Pairing body used by the settings section: mints a QR on mount, keeps the
		* status stream, and renders {@link RemotePanel} inline.
		*/
		/** Apply one status frame onto the current ready state. */
		function mergeFrame(state, frame) {
			if (state.kind !== "ready") return state;
			return {
				...state,
				phase: frame.phase,
				deviceCount: frame.deviceCount,
				onlineCount: frame.onlineCount,
				...frame.tunnel !== void 0 ? { tunnel: frame.tunnel } : {}
			};
		}
		/**
		* Render the inline pairing panel.
		* @param props - locale seat.
		* @returns the pairing element tree.
		*/
		function RemotePairing({ t }) {
			const [state, setState] = (0, react.useState)({ kind: "lan-required" });
			const [copied, setCopied] = (0, react.useState)(false);
			const eventSource = (0, react.useRef)(void 0);
			const closeEventSource = (0, react.useCallback)(() => {
				eventSource.current?.close();
				eventSource.current = void 0;
			}, []);
			const mint = (0, react.useCallback)(async (address) => {
				let result;
				try {
					result = await issuePair(void 0, address);
				} catch {
					return { kind: "unreachable" };
				}
				if (!result.ok) {
					if (result.code === "forbidden") return { kind: "loopback-required" };
					if (result.code === "unknown-address") return { kind: "unreachable" };
					return { kind: "lan-required" };
				}
				const publicBaseUrl = result.publicBaseUrl;
				return {
					kind: "ready",
					url: result.url,
					expiresAt: result.expiresAt,
					expired: Date.now() > result.expiresAt,
					phase: "waiting",
					deviceCount: 0,
					onlineCount: 0,
					public: publicBaseUrl !== void 0 && result.url.startsWith(publicBaseUrl),
					...publicBaseUrl !== void 0 ? { publicBaseUrl } : {},
					address: address ?? result.lanAddresses[0] ?? "",
					lanAddresses: result.lanAddresses
				};
			}, []);
			const listen = (0, react.useCallback)((next) => {
				closeEventSource();
				if (next.kind !== "ready") return;
				const source = new EventSource("/api/pair/events");
				eventSource.current = source;
				source.onmessage = (event) => {
					try {
						const frame = JSON.parse(event.data);
						if (frame.type !== "state") return;
						setState((previous) => mergeFrame(previous, frame));
					} catch {}
				};
			}, [closeEventSource]);
			(0, react.useEffect)(() => {
				mint().then((next) => {
					setState(next);
					listen(next);
				});
				return closeEventSource;
			}, [
				closeEventSource,
				listen,
				mint
			]);
			(0, react.useEffect)(() => {
				if (state.kind !== "ready") return;
				if (state.expired) return;
				const delay = state.expiresAt - Date.now();
				if (delay <= 0) {
					setState((previous) => previous.kind === "ready" ? {
						...previous,
						expired: true
					} : previous);
					return;
				}
				const timer = window.setTimeout(() => {
					setState((previous) => previous.kind === "ready" ? {
						...previous,
						expired: true
					} : previous);
				}, delay);
				return () => {
					window.clearTimeout(timer);
				};
			}, [state]);
			const handleStop = (0, react.useCallback)(() => {
				stopPair().catch(() => {});
				setState((previous) => previous.kind === "ready" ? {
					...previous,
					phase: "stopped"
				} : previous);
			}, []);
			const handleRefresh = (0, react.useCallback)(() => {
				mint().then((next) => {
					setState(next);
					listen(next);
				});
			}, [listen, mint]);
			const handlePickAddress = (0, react.useCallback)((address) => {
				mint(address).then((next) => {
					setState(next);
					listen(next);
				});
			}, [listen, mint]);
			const handlePickPublic = (0, react.useCallback)(() => {
				mint().then((next) => {
					setState(next);
					listen(next);
				});
			}, [listen, mint]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RemotePanel, {
				t,
				state,
				copied,
				embedded: true,
				onClose: () => {},
				onStop: handleStop,
				onRefresh: handleRefresh,
				onCopy: (0, react.useCallback)(() => {
					if (state.kind !== "ready") return;
					copyText(state.url).then((ok) => {
						if (!ok) return;
						setCopied(true);
						window.setTimeout(() => {
							setCopied(false);
						}, 1500);
					});
				}, [state]),
				onPickAddress: handlePickAddress,
				onPickPublic: handlePickPublic
			});
		}
		//#endregion
		//#region src/client/RemoteSettingsSection.tsx
		/**
		* Render the remote-control settings page.
		* @param props - section owner share, locale, card face, and committed enable flag.
		* @returns the section.
		*/
		function RemoteSettingsSection(props) {
			const enabled = props.useRemoteEnabled((value) => value);
			const card = {
				t: props.t,
				useRemoteSettingsCard: props.useRemoteSettingsCard,
				save: props.save,
				discard: props.discard,
				edit: props.edit,
				resetField: props.resetField
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: remote_module_css_default.section,
				children: [enabled ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RemotePairing, { t: props.t }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: remote_module_css_default.sectionHint,
					role: "status",
					children: props.t("settings.disabledHint")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
					className: remote_module_css_default.cardList,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RemoteSettingsCard, { ...card })
				})]
			});
		}
		//#endregion
		//#region src/client/locales.ts
		/** `remote` namespace dictionaries: the mobile remote-control surface copy. */
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"entry.label": "移动端远程控制",
			"footer.status": "正在远程操控",
			"title": "移动端远程控制",
			"subtitle": "扫码或在手机上打开链接，即可远程控制当前工作区",
			"card.title": "手机扫码连接",
			"public.badge": "公网",
			"status.waiting": "等待手机连接",
			"status.connected": "已连接 {n} 台设备",
			"status.disconnected": "已配对设备离线",
			"status.stopped": "已停止移动端访问",
			"status.lanRequired": "此功能需要以 --host 0.0.0.0 启动 dsh web，或配置公网地址才能使用",
			"status.lanRequiredHint": "当前服务仅绑定在 127.0.0.1 且未配置公网地址，手机无法访问。请用 dsh web --host 0.0.0.0 重新启动，或在设置中填写内网穿透的公网地址。",
			"status.loopbackRequired": "配对面板仅限本机使用",
			"status.loopbackRequiredHint": "请通过 http://127.0.0.1 打开此页面后重试；手机请使用配对链接访问。",
			"status.unreachable": "无法连接配对服务",
			"status.unreachableHint": "请刷新页面后重试。",
			"pair.hint": "无法扫码？可以在手机上打开链接",
			"pair.publicHint": "公网链接：手机无需与电脑在同一网络",
			"address.label": "选择二维码指向的网络",
			"address.public": "公网地址",
			"address.lan": "局域网",
			"address.hint": "公网地址适合手机不在同一网络时使用；局域网地址仅在手机与电脑同一网络时可用。",
			"pair.expires": "二维码有效至 {time}",
			"pair.expired": "二维码已过期，请刷新",
			"pair.failed.title": "配对失败",
			"pair.failed.detail": "链接无效或已使用，请回到电脑端刷新二维码后重新扫码。",
			"action.stop": "停止",
			"action.refresh": "刷新二维码",
			"action.copy": "复制链接",
			"action.copied": "已复制",
			"stopped.hint": "已停止移动端访问。点击\"刷新二维码\"重新开启。",
			"tunnel.starting": "公网隧道启动中，二维码将自动变为公网链接…",
			"tunnel.failed": "公网隧道启动失败：{error}",
			"tunnel.unknownError": "未知错误",
			"close.label": "关闭移动端远程控制面板",
			"settings.title": "移动端远程控制",
			"settings.nav": "远程",
			"settings.description": "配对安全、设备限额与任务完成提醒。",
			"settings.enabled": "启用移动端远程控制",
			"settings.enabledHint": "关闭后去掉侧栏状态，并停用配对路由与局域网栅栏。",
			"settings.disabledHint": "远程控制已关闭。打开下方开关并保存后，即可生成扫码二维码。",
			"settings.tokenTtlMs": "配对令牌有效期（毫秒）",
			"settings.tokenTtlMsHint": "新生成的二维码链接在此时间后失效。",
			"settings.offlineAfterMs": "设备离线判定（毫秒）",
			"settings.offlineAfterMsHint": "配对设备超过该时长未上报心跳即视为离线。",
			"settings.maxDevices": "已配对设备上限",
			"settings.maxDevicesHint": "超过上限时淘汰最旧的设备会话。",
			"settings.cookieName": "设备 Cookie 名",
			"settings.cookieNameHint": "携带已配对设备标识的 Cookie 名称。",
			"settings.requirePairingForLan": "局域网访问要求配对",
			"settings.requirePairingForLanHint": "开启：所有非本机回环的 /api 请求必须携带有效配对 Cookie；关闭：局域网栅栏放开，配对仅用于令牌与状态管理。",
			"settings.publicBaseUrl": "公网地址（可选）",
			"settings.publicBaseUrlHint": "内网穿透的公网地址，如 Cloudflare Tunnel：https://xxx.trycloudflare.com。填写后二维码将生成公网链接，手机不在同一网络也能配对；留空则仅局域网可用。",
			"settings.autoTunnel": "自动公网隧道",
			"settings.autoTunnelHint": "开启后插件自动启动 Cloudflare quick tunnel（无需安装任何工具），并自动更新公网地址与信任配置，手机随时可用公网配对；关闭时使用上方手动填写的公网地址。",
			"settings.notifyOnComplete": "任务完成提醒",
			"settings.notifyOnCompleteHint": "智能体结束一轮任务时，电脑和已打开的手机页面播放提示音，并在浏览器授权后弹出系统通知。手机需保持该页面开启；通知正文只含会话标题。",
			"settings.inherit": "继承",
			"settings.on": "开",
			"settings.off": "关",
			"settings.overridden": "已覆盖",
			"settings.reset": "恢复默认",
			"settings.notExposed": "当前 DSH 版本未向设置页暴露本插件的配置命名空间，表单不可用。可编辑 ~/.dsh/settings.yaml 直接配置，或为 dsh-host-apiproxy 的 WEB_SETTINGS_NAMESPACES 白名单补充本命名空间后重启。",
			"settings.readOnly": "当前部署的设置只读。",
			"settings.expand": "展开设置",
			"settings.collapse": "收起设置",
			"settings.save": "保存",
			"settings.saving": "保存中…",
			"settings.discard": "放弃",
			"settings.unsaved": "未保存",
			"settings.saveFailed": "部署未接受这些值，已保留供你修改。",
			"settings.invalidNumber": "请输入数字，留空则使用默认值。",
			"update.label": "检查更新",
			"update.title": "检查更新",
			"update.checking": "正在检查远程仓库中的新版本…",
			"update.upToDate": "当前已是最新版本",
			"update.upToDateDetail": "{name} 已是最新版本 v{version}。",
			"update.found": "发现新版本",
			"update.foundDetail": "{name} 有新版本 v{version}，正在自动更新…",
			"update.updating": "正在更新 {name} 至 v{version}，可能需要 1-2 分钟…",
			"update.updatingTitle": "正在自动更新…",
			"update.done": "更新完成",
			"update.doneDetail": "所有组件已更新到最新版本。",
			"update.restartHint": "请重启 dsh web 使新版本生效：在终端按 Ctrl+C 停止后重新运行 dsh web。",
			"update.linkMode": "当前为本地开发模式",
			"update.linkModeDetail": "dsh-web-ui 通过本地链接安装（开发模式），无法自动更新。npm 上最新版本：{version}。请在仓库中执行 git pull 更新。",
			"update.missing": "未找到 dsh-web-ui 安装",
			"update.missingDetail": "无法定位已安装的 Haibala 聚合包。请先运行 dsh plugin --profile <profile> add @haibala-aii/dsh-extensions-remotelink。",
			"update.offline": "无法连接更新源",
			"update.offlineDetail": "网络不可用或更新服务异常，请稍后重试。",
			"update.error": "更新失败",
			"update.packages": "组件版本",
			"update.retry": "重新检查",
			"update.close": "关闭更新面板",
			"update.error.pnpmMissing": "未找到 pnpm，请先安装 pnpm（brew install pnpm 或 corepack enable）。",
			"update.error.timeout": "更新超时，已终止安装进程，请重试。",
			"update.error.notFound": "未找到 dsh-web-ui 聚合包安装，无法更新。",
			"update.error.link": "当前为本地开发模式（链接安装），无法自动更新。",
			"update.error.pnpmFailed": "更新执行失败（pnpm 退出码 {code}），详见下方输出。",
			"update.error.unknown": "更新失败，请重试。"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"entry.label": "Mobile remote control",
			"footer.status": "Remote control active",
			"title": "Mobile remote control",
			"subtitle": "Scan the QR code or open the link on your phone to control this workspace remotely",
			"card.title": "Scan to connect",
			"public.badge": "Public",
			"status.waiting": "Waiting for a phone",
			"status.connected": "{n} device(s) connected",
			"status.disconnected": "Paired devices offline",
			"status.stopped": "Mobile access stopped",
			"status.lanRequired": "This feature needs dsh web started with --host 0.0.0.0, or a configured public address",
			"status.lanRequiredHint": "The server is bound to 127.0.0.1 and no public address is configured, so a phone cannot reach it. Restart with dsh web --host 0.0.0.0, or set the tunneled public address in settings.",
			"status.loopbackRequired": "The pairing panel works on this machine only",
			"status.loopbackRequiredHint": "Open this page at http://127.0.0.1 to mint a QR code; phones use the paired link.",
			"status.unreachable": "Cannot reach the pairing service",
			"status.unreachableHint": "Refresh the page and try again.",
			"pair.hint": "Cannot scan? Open the link on your phone",
			"pair.publicHint": "Public link: the phone does not need to be on the same network",
			"address.label": "Network the QR code points to",
			"address.public": "Public",
			"address.lan": "LAN",
			"address.hint": "Use the public address when the phone is not on the same network; LAN addresses only work on the same network.",
			"pair.expires": "QR code valid until {time}",
			"pair.expired": "QR code expired — refresh it",
			"pair.failed.title": "Pairing failed",
			"pair.failed.detail": "The link is invalid or was already used. Refresh the QR code on your computer and scan again.",
			"action.stop": "Stop",
			"action.refresh": "Refresh QR",
			"action.copy": "Copy link",
			"action.copied": "Copied",
			"stopped.hint": "Mobile access is stopped. Click \"Refresh QR\" to re-enable it.",
			"tunnel.starting": "The public tunnel is starting; the QR code will switch to a public link shortly…",
			"tunnel.failed": "The public tunnel failed to start: {error}",
			"tunnel.unknownError": "unknown error",
			"close.label": "Close mobile remote control panel",
			"settings.title": "Mobile remote control",
			"settings.nav": "Remote",
			"settings.description": "Pairing security, device limits, and task-complete alerts.",
			"settings.enabled": "Enable mobile remote control",
			"settings.enabledHint": "When off, the sidebar status is removed and pairing routes plus the LAN fence stop.",
			"settings.disabledHint": "Remote control is off. Turn the switch on below and save to mint a QR code.",
			"settings.tokenTtlMs": "Pairing token lifetime (ms)",
			"settings.tokenTtlMsHint": "How long a minted QR link stays valid before it dies.",
			"settings.offlineAfterMs": "Device offline threshold (ms)",
			"settings.offlineAfterMsHint": "A paired device flips to offline when it has not been seen for this long.",
			"settings.maxDevices": "Paired device cap",
			"settings.maxDevicesHint": "Hard cap on paired device sessions; the oldest is evicted when full.",
			"settings.cookieName": "Device cookie name",
			"settings.cookieNameHint": "Cookie that carries the paired device id.",
			"settings.requirePairingForLan": "Require pairing for LAN access",
			"settings.requirePairingForLanHint": "On: every non-loopback /api request must carry a live paired-device cookie. Off: the LAN fence is open and pairing only manages tokens/status.",
			"settings.publicBaseUrl": "Public address (optional)",
			"settings.publicBaseUrlHint": "The public URL of a tunnel in front of this server, e.g. a Cloudflare Tunnel: https://xxx.trycloudflare.com. When set, the QR link is built from it so a phone anywhere can pair; leave blank for LAN-only usage.",
			"settings.autoTunnel": "Auto public tunnel",
			"settings.autoTunnelHint": "When on, the plugin runs its own Cloudflare quick tunnel (no tool installation needed) and keeps the public address and trust config in sync automatically, so a phone anywhere can pair at any time; when off, the manually entered public address above applies.",
			"settings.notifyOnComplete": "Task-complete alerts",
			"settings.notifyOnCompleteHint": "When an agent goes idle after running, the desktop and an open phone page play a chime and show a system notification (after the browser grants permission). Keep the page open on the phone. The notification body is the session title only.",
			"settings.inherit": "Inherit",
			"settings.on": "On",
			"settings.off": "Off",
			"settings.overridden": "Overridden",
			"settings.reset": "Reset to default",
			"settings.notExposed": "This DSH version does not expose this plugin's settings namespace to the configuration page, so the form is unavailable. Edit ~/.dsh/settings.yaml directly, or add the namespace to dsh-host-apiproxy's WEB_SETTINGS_NAMESPACES allowlist and restart.",
			"settings.readOnly": "This deployment stores settings read-only.",
			"settings.expand": "Show settings",
			"settings.collapse": "Hide settings",
			"settings.save": "Save",
			"settings.saving": "Saving…",
			"settings.discard": "Discard",
			"settings.unsaved": "Unsaved",
			"settings.saveFailed": "The deployment did not accept these values; they were left for you to correct.",
			"settings.invalidNumber": "Enter a number, or leave blank to use the default.",
			"update.label": "Check for updates",
			"update.title": "Check for updates",
			"update.checking": "Checking the remote repository for newer releases…",
			"update.upToDate": "Everything is up to date",
			"update.upToDateDetail": "{name} is at the latest version v{version}.",
			"update.found": "A new version is available",
			"update.foundDetail": "{name} has a newer release v{version}; updating automatically…",
			"update.updating": "Updating {name} to v{version}; this may take 1-2 minutes…",
			"update.updatingTitle": "Updating automatically…",
			"update.done": "Update complete",
			"update.doneDetail": "All components are up to date.",
			"update.restartHint": "Restart dsh web for the new version to take effect: stop it with Ctrl+C in the terminal, then run dsh web again.",
			"update.linkMode": "Local development mode",
			"update.linkModeDetail": "dsh-web-ui is installed via a local link (development mode) and cannot be updated remotely. Latest npm release: {version}. Run git pull in the repository to update.",
			"update.missing": "dsh-web-ui not found",
			"update.missingDetail": "Could not locate the installed Haibala package. Install it with: dsh plugin --profile <profile> add @haibala-aii/dsh-extensions-remotelink",
			"update.offline": "Cannot reach the update source",
			"update.offlineDetail": "The network is unavailable or the update service is failing; try again later.",
			"update.error": "Update failed",
			"update.packages": "Component versions",
			"update.retry": "Check again",
			"update.close": "Close update panel",
			"update.error.pnpmMissing": "pnpm was not found. Install it first (brew install pnpm or corepack enable).",
			"update.error.timeout": "The update timed out and the install process was killed; try again.",
			"update.error.notFound": "The dsh-web-ui aggregate package is not installed; nothing to update.",
			"update.error.link": "Local development mode (link install) — automatic update is unavailable.",
			"update.error.pnpmFailed": "The update failed (pnpm exited with code {code}); see the output below.",
			"update.error.unknown": "Update failed; try again."
		};
		//#endregion
		//#region src/client/deep-link.ts
		/** sessionStorage key for the failed-pair notice. */
		const PAIR_FAILED_MARKER = "dsh-remote-pair-failed";
		/** Poll budget for the runtime services (activation order is unconstrained). */
		const SERVICE_WAIT_MS = 1e4;
		/** The browser implementation of {@link PageSurface}. */
		const browserPage = {
			get href() {
				return window.location.href;
			},
			replaceState(url) {
				window.history.replaceState(null, "", url);
			},
			navigate(url) {
				window.location.assign(url);
			},
			reload() {
				window.location.reload();
			}
		};
		/**
		* Run the pair/workspace boot flow for this page load.
		* @param ctx - client root context (workspaces/sessions read at need time).
		* @param search - the current location.search.
		* @param page - the page surface (defaults to the browser).
		*/
		function runPairBootFlow(ctx, search, page = browserPage) {
			const params = readPairParams(search);
			if (params.pair !== void 0) {
				runAccept(params.pair, page);
				return;
			}
			if (params.workspace !== void 0) runDeepLink(ctx, params.workspace, page);
		}
		/** Accept the token, then reload (the workspace param survives the reload). */
		async function runAccept(token, page) {
			let ok = false;
			let failureCode;
			try {
				const result = await acceptPair(token);
				ok = result.ok;
				if (!ok) if (await hasLivePairCookie()) ok = true;
				else failureCode = result.code;
			} catch {
				failureCode = "network";
			}
			if (failureCode !== void 0) sessionStorage.setItem(PAIR_FAILED_MARKER, failureCode);
			const url = new URL(page.href);
			url.searchParams.delete("pair");
			page.replaceState(`${url.pathname}${url.search}${url.hash}`);
			if (ok) page.reload();
		}
		/** Whether this browser already holds a live paired-device cookie. */
		async function hasLivePairCookie() {
			try {
				const response = await fetch("/api/pair/status");
				if (!response.ok) return false;
				const body = await response.json();
				return body.ok === true && body.paired === true;
			} catch {
				return false;
			}
		}
		/**
		* Connect the deep-linked workspace and open its session. Waits for the
		* runtime services AND for the target workspace to appear in the workspace
		* list (both are asynchronous after boot), then connects and opens; gives
		* up silently within the budget — the workspace param is stripped either
		* way, so a late failure cannot loop.
		* @param ctx - client root context.
		* @param workspaceId - the target workspace.
		* @param page - the page surface.
		*/
		async function runDeepLink(ctx, workspaceId, page) {
			const target = workspaceId;
			const deadline = Date.now() + SERVICE_WAIT_MS;
			while (Date.now() < deadline) {
				const workspaces = ctx.get("workspaces");
				const sessions = ctx.get("sessions");
				if (workspaces !== void 0 && sessions !== void 0) {
					if (workspaces.list.getSnapshot().items.some((item) => item.workspaceId === target)) {
						try {
							const sessionId = await workspaces.connectWorkspace(target);
							sessions.open(sessionId);
						} catch {}
						break;
					}
				}
				await new Promise((resolve) => setTimeout(resolve, 200));
			}
			const url = new URL(page.href);
			url.searchParams.delete("workspace");
			page.replaceState(`${url.pathname}${url.search}${url.hash}`);
		}
		/**
		* Detects running→idle edges. The first ingest only seeds; reconnects must
		* {@link RunningIdleWatcher.reset} so a list refresh does not fire a burst.
		*/
		var RunningIdleWatcher = class {
			running = /* @__PURE__ */ new Map();
			titles = /* @__PURE__ */ new Map();
			seeded = false;
			/** Drop remembered bits (call on a new connection generation). */
			reset() {
				this.running.clear();
				this.titles.clear();
				this.seeded = false;
			}
			/**
			* Fold one snapshot or increment.
			* @param rows - current running bits; a partial list does not prune unseen ids.
			* @returns sessions that just went idle (empty before the first ingest).
			*/
			ingest(rows) {
				const idle = [];
				for (const row of rows) {
					if (row.title !== void 0 && row.title !== "") this.titles.set(row.sessionId, row.title);
					const previous = this.running.get(row.sessionId);
					if (this.seeded && previous === true && !row.running) idle.push({
						sessionId: row.sessionId,
						title: this.titles.get(row.sessionId) ?? "会话"
					});
					this.running.set(row.sessionId, row.running);
				}
				this.seeded = true;
				return idle;
			}
		};
		const NOTIFY_TITLE = "任务已完成";
		const NOTIFY_TAG = "dsh-task-complete";
		let audio;
		/** The AudioContext constructor this browser exposes, if any. */
		function AudioCtor() {
			const g = globalThis;
			return g.AudioContext ?? g.webkitAudioContext;
		}
		/** Lazily create (or reuse) the chime context. */
		function audioContext() {
			const Ctor = AudioCtor();
			if (Ctor === void 0) return void 0;
			audio ??= new Ctor();
			return audio;
		}
		/**
		* Resume the chime context after a user gesture. Browsers refuse to start
		* audio until then; call from pointerdown.
		*/
		function unlockTaskCompleteAudio() {
			const ctx = audioContext();
			if (ctx === void 0) return;
			if (ctx.state === "suspended") ctx.resume();
		}
		/**
		* Ask the browser for Notification permission. Safe to call without a
		* gesture; some browsers then leave permission at `default`.
		* @returns the permission string, or `unsupported` when the API is absent.
		*/
		async function requestTaskCompletePermission() {
			if (typeof Notification === "undefined") return "unsupported";
			if (Notification.permission !== "default") return Notification.permission;
			try {
				return await Notification.requestPermission();
			} catch {
				return Notification.permission;
			}
		}
		/**
		* Play the chime, vibrate on phones, and show a system notification when
		* permission is already granted. Hidden documents skip the chime (the OS
		* notification sound covers backgrounded tabs) so a visible page does not
		* double-play against the OS banner.
		* @param title - session label already reduced to display text.
		*/
		function alertTaskComplete(title) {
			const hidden = typeof document !== "undefined" && document.hidden;
			if (!hidden) playChime();
			vibrate();
			showNotification(title, hidden);
		}
		/** Short two-note chime through Web Audio. */
		function playChime() {
			const ctx = audioContext();
			if (ctx === void 0) return;
			ctx.resume();
			const start = ctx.currentTime;
			tone(ctx, 880, start, .12);
			tone(ctx, 1174.7, start + .13, .18);
		}
		/** One decaying sine beep. */
		function tone(ctx, frequency, start, duration) {
			const oscillator = ctx.createOscillator();
			const gain = ctx.createGain();
			oscillator.type = "sine";
			oscillator.frequency.value = frequency;
			gain.gain.setValueAtTime(1e-4, start);
			gain.gain.exponentialRampToValueAtTime(.16, start + .015);
			gain.gain.exponentialRampToValueAtTime(1e-4, start + duration);
			oscillator.connect(gain);
			gain.connect(ctx.destination);
			oscillator.start(start);
			oscillator.stop(start + duration + .02);
		}
		/** Best-effort vibration; absent on desktop. */
		function vibrate() {
			const nav = typeof navigator === "undefined" ? void 0 : navigator;
			if (nav === void 0 || typeof nav.vibrate !== "function") return;
			try {
				nav.vibrate(180);
			} catch {}
		}
		/**
		* System notification. `silent` is true while the page is visible (the chime
		* already played); backgrounded tabs let the OS play its own sound.
		*/
		function showNotification(body, backgrounded) {
			if (typeof Notification === "undefined") return;
			if (Notification.permission !== "granted") return;
			try {
				const notification = new Notification(NOTIFY_TITLE, {
					body,
					tag: NOTIFY_TAG,
					silent: !backgrounded,
					renotify: true
				});
				notification.onclick = () => {
					try {
						window.focus();
					} catch {}
					notification.close();
				};
			} catch {}
		}
		//#endregion
		//#region src/client/index.ts
		/**
		* Mobile remote control — browser half. Registers the `remote` dictionaries,
		* the sidebar-foot entry (phone trigger + pairing panel) into the
		* ui-sidebar-declared `sidebar.remote` seat, and runs the phone-side boot
		* flow (pair accept + workspace deep-link + presence heartbeats) plus the
		* one-time failed-pair notice. Export discipline: packages/client/AGENTS.md
		* — the /client surface carries only what cordis loading needs plus types.
		*/
		if (typeof crypto !== "undefined" && typeof crypto.randomUUID !== "function") try {
			const cryptoObject = crypto;
			cryptoObject.randomUUID = () => {
				const bytes = crypto.getRandomValues(new Uint8Array(16));
				bytes[6] = bytes[6] & 15 | 64;
				bytes[8] = bytes[8] & 63 | 128;
				const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
				return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
			};
		} catch {}
		/** Dictionary namespace owned by this plugin. */
		const NS = "remote";
		/** Settings namespace the remote-control card edits (the Host plugin registers it). */
		const REMOTE_WEB_UI_NS = "remote-web-ui";
		/** Heartbeat cadence from a paired phone (presence + revocation liveness). */
		const HEARTBEAT_INTERVAL_MS = 1e4;
		/** Services required by this plugin. */
		const inject = [
			"slots",
			"locale",
			"connection",
			"settingsScope",
			"remote",
			"sessions"
		];
		/**
		* Register the remote-control surface.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => {
				const style = document.createElement("style");
				style.dataset.plugin = "remote-web-ui/mobile-overrides";
				style.textContent = `
      @media (max-width: 640px) {
        [class*="handle"] { display: none !important; }
        [class*="composerSeat"], [class*="scrollBody"], [class*="header"] {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
        [class*="chatMsg"] { max-width: 92% !important; }
        [class*="row"], [class*="navItem"], [class*="iconButton"] {
          touch-action: manipulation;
        }
      }
    `;
				document.head.appendChild(style);
				return () => {
					style.remove();
				};
			}, "remote-web-ui: mobile web overrides");
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "remote-web-ui: dictionaries");
			const t = ctx.locale.bind(NS);
			const settingsScope = (ctx.get("webUiSettings") ?? ctx.settingsScope).bind({ namespace: REMOTE_WEB_UI_NS });
			const enabled = () => {
				const snapshot = settingsScope.getSnapshot();
				return snapshot.status === "ready" ? snapshot.value?.enabled ?? true : snapshot.status === "unavailable";
			};
			ctx.slots.inject("sidebar.footer.action", () => {
				let disposeEntry;
				const syncEntry = () => {
					if (enabled() && disposeEntry === void 0) disposeEntry = ctx.slots.register({
						name: "sidebar.footer.action",
						id: "remote-web-ui",
						locale: NS
					}, FooterRemoteEntry);
					else if (!enabled() && disposeEntry !== void 0) {
						disposeEntry();
						disposeEntry = void 0;
					}
				};
				const unsubscribe = settingsScope.subscribe(syncEntry);
				syncEntry();
				return () => {
					unsubscribe();
					disposeEntry?.();
				};
			});
			const remoteSettings = new RemoteSettingsCardController(settingsScope);
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "remote",
				order: 20,
				label: () => t("settings.nav"),
				locale: NS,
				inject: () => {
					const face = remoteSettings.inject();
					return {
						...face,
						hooks: {
							...face.hooks,
							remoteEnabled: {
								getSnapshot: enabled,
								subscribe: (listener) => settingsScope.subscribe(listener)
							}
						}
					};
				}
			}, RemoteSettingsSection));
			ctx.slots.inject("web-ui.plugin.item", () => ctx.slots.register({
				name: "web-ui.plugin.item",
				id: "remote-web-ui",
				order: 90,
				locale: NS,
				inject: () => remoteSettings.inject()
			}, RemoteSettingsCard));
			let disposeRuntime;
			const syncRuntime = () => {
				if (enabled() && disposeRuntime === void 0) disposeRuntime = ctx.effect(() => {
					const loopback = ctx.get("connection")?.isLoopback ?? true;
					runPairBootFlow(ctx, window.location.search);
					if (loopback) return () => {};
					const timer = window.setInterval(() => {
						sendHeartbeat().catch(() => {});
					}, HEARTBEAT_INTERVAL_MS);
					return () => {
						window.clearInterval(timer);
					};
				}, "remote-web-ui: pair flow + heartbeats");
				else if (!enabled() && disposeRuntime !== void 0) {
					disposeRuntime();
					disposeRuntime = void 0;
				}
			};
			settingsScope.subscribe(syncRuntime);
			syncRuntime();
			ctx.effect(() => {
				const watcher = new RunningIdleWatcher();
				const notifyEnabled = () => {
					const snapshot = settingsScope.getSnapshot();
					if (snapshot.status !== "ready") return true;
					return snapshot.value?.notifyOnComplete ?? true;
				};
				const onList = () => {
					const list = ctx.sessions.list.getSnapshot();
					const idle = watcher.ingest(list.ids.flatMap((id) => {
						const row = list.byId[id];
						if (row === void 0) return [];
						return [{
							sessionId: id,
							running: row.running,
							title: row.displayTitle
						}];
					}));
					if (!notifyEnabled()) return;
					for (const event of idle) alertTaskComplete(event.title);
				};
				onList();
				const unsubList = ctx.sessions.list.subscribe(onList);
				const unsubReset = ctx.on("connection/reset", () => {
					watcher.reset();
				});
				const onGesture = () => {
					unlockTaskCompleteAudio();
					if (notifyEnabled()) requestTaskCompletePermission();
				};
				window.addEventListener("pointerdown", onGesture, { once: true });
				return () => {
					unsubList();
					unsubReset();
					window.removeEventListener("pointerdown", onGesture);
				};
			}, "remote-web-ui: task-complete alerts");
			ctx.effect(() => {
				const timer = window.setTimeout(() => {
					const code = sessionStorage.getItem(PAIR_FAILED_MARKER);
					if (code === null) return;
					sessionStorage.removeItem(PAIR_FAILED_MARKER);
					const mount = document.createElement("div");
					document.body.appendChild(mount);
					(0, react_dom_client.createRoot)(mount).render((0, react.createElement)(PairFailedNotice, {
						t,
						code
					}));
				}, 1500);
				return () => {
					window.clearTimeout(timer);
				};
			}, "remote-web-ui: failed-pair notice");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map