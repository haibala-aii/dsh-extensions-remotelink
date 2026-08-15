/**
 * Mobile live running-status client: the plugin's `/m/api/events.host` SSE
 * channel, which forwards only `host/session-status` frames. EventSource
 * reconnects by itself. When the tunnel does not deliver SSE, this client
 * polls `session.list` (first page) and re-emits running-bit changes as the
 * same frame type so the idle watcher stays live while the `/m` page is open.
 */

import type { HostFrame } from '@deepseek-ai/dsh-host-apiproxy/api/events'
import { listSessions, type SessionPage } from './api.ts'

/** Injectable seams for tests. */
export interface HostStatusClientOptions {
  /** EventSource factory (defaults to the browser EventSource). */
  sourceFactory?: (url: string) => EventSourceLike
  /** First-page session.list fetch for the polling fallback. */
  pollList?: () => Promise<SessionPage>
  /** Poll cadence while SSE is stalled (default 3000 ms). */
  pollIntervalMs?: number
  /** How long SSE must go without a frame before fallback kicks in (default 12000 ms). */
  stallThresholdMs?: number
  /** Clock seam for tests (defaults to Date.now). */
  now?: () => number
}

/** The EventSource subset this client uses. */
export interface EventSourceLike {
  onmessage: ((event: { data: string }) => void) | null
  onerror: ((event: unknown) => void) | null
  close(): void
}

/** Browser default source factory. */
function browserSource(url: string): EventSourceLike {
  return new EventSource(url) as unknown as EventSourceLike
}

/** The only host frame this client forwards. */
export type SessionStatusFrame = Extract<HostFrame, { type: 'host/session-status' }>

const DEFAULT_POLL_INTERVAL_MS = 3000
const DEFAULT_STALL_THRESHOLD_MS = 12_000

/** Runtime record guard for SSE JSON. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Parse one SSE data line into a session-status frame. Unknown envelopes and
 * other host frame types return undefined (the phone only needs running bits).
 * @param data - the EventSource `data:` payload.
 * @returns the status frame, or undefined when the line is not one.
 */
export function parseSessionStatusFrame(data: string): SessionStatusFrame | undefined {
  if (data === '') return undefined
  let parsed: unknown
  try {
    parsed = JSON.parse(data)
  } catch {
    return undefined
  }
  if (!isRecord(parsed) || parsed['type'] !== 'server-request') return undefined
  const payload = parsed['payload']
  if (!isRecord(payload) || payload['type'] !== 'host/session-status') return undefined
  const sessionId = payload['sessionId']
  const running = payload['running']
  if (typeof sessionId !== 'string' || sessionId === '' || typeof running !== 'boolean') return undefined
  return {
    type: 'host/session-status',
    sessionId: sessionId as SessionStatusFrame['sessionId'],
    running,
  }
}

/**
 * Keep one host-status SSE subscription open, plus a list-poll fallback when
 * the tunnel cannot forward Server-Sent Events.
 */
export class HostStatusClient {
  private readonly sourceFactory: (url: string) => EventSourceLike
  private readonly pollList: () => Promise<SessionPage>
  private readonly pollIntervalMs: number
  private readonly stallThresholdMs: number
  private readonly now: () => number
  private readonly listeners = new Set<(frame: SessionStatusFrame) => void>()
  private source: EventSourceLike | undefined
  private stopped = false
  private readonly url: string
  private lastDataAt = 0
  private sseAlive = false
  private stallTimer: ReturnType<typeof setInterval> | undefined
  private pollTimer: ReturnType<typeof setInterval> | undefined
  private polling = false

  /**
   * @param url - the mobile host-status endpoint.
   * @param options - seams.
   */
  constructor(url = '/m/api/events.host', options: HostStatusClientOptions = {}) {
    this.url = url
    this.sourceFactory = options.sourceFactory ?? browserSource
    this.pollList = options.pollList ?? (() => listSessions())
    this.pollIntervalMs = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS
    this.stallThresholdMs = options.stallThresholdMs ?? DEFAULT_STALL_THRESHOLD_MS
    this.now = options.now ?? (() => Date.now())
  }

  /** Open the stream (idempotent until {@link stop}). */
  start(): void {
    this.stopped = false
    this.lastDataAt = this.now()
    if (this.source === undefined) this.connect()
    this.startStallChecker()
  }

  /** Close for good. */
  stop(): void {
    this.stopped = true
    this.stopStallChecker()
    this.stopPolling()
    this.closeSource()
  }

  /** Subscribe to session-status frames; returns an unsubscribe function. */
  onFrame(listener: (frame: SessionStatusFrame) => void): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  private connect(): void {
    this.sseAlive = false
    const source = this.sourceFactory(this.url)
    this.source = source
    source.onmessage = (event) => {
      this.handleMessage(event.data)
    }
    source.onerror = () => {
      if (this.stopped && this.source === source) {
        this.closeSource()
        return
      }
      this.sseAlive = false
      this.startPolling()
    }
  }

  private startStallChecker(): void {
    this.stopStallChecker()
    this.stallTimer = setInterval(() => {
      if (this.stopped || this.polling || this.sseAlive) return
      if ((this.now() - this.lastDataAt) > this.stallThresholdMs) this.startPolling()
    }, 1000)
  }

  private stopStallChecker(): void {
    if (this.stallTimer === undefined) return
    clearInterval(this.stallTimer)
    this.stallTimer = undefined
  }

  private startPolling(): void {
    if (this.polling || this.stopped) return
    this.polling = true
    void this.pollTick()
    this.pollTimer = setInterval(() => { void this.pollTick() }, this.pollIntervalMs)
  }

  private stopPolling(): void {
    this.polling = false
    if (this.pollTimer === undefined) return
    clearInterval(this.pollTimer)
    this.pollTimer = undefined
  }

  private async pollTick(): Promise<void> {
    try {
      const page = await this.pollList()
      for (const item of page.items) {
        this.emit({
          type: 'host/session-status',
          sessionId: item.sessionId as SessionStatusFrame['sessionId'],
          running: item.running,
        })
      }
    } catch {
      // Transient; the next tick retries.
    }
  }

  private handleMessage(data: string): void {
    const frame = parseSessionStatusFrame(data)
    if (frame === undefined) return
    this.sseAlive = true
    this.lastDataAt = this.now()
    if (this.polling) this.stopPolling()
    this.emit(frame)
  }

  private emit(frame: SessionStatusFrame): void {
    for (const listener of this.listeners) {
      try {
        listener(frame)
      } catch {
        // A throwing subscriber must not break the emit loop.
      }
    }
  }

  private closeSource(): void {
    const source = this.source
    this.source = undefined
    if (source === undefined) return
    source.onmessage = null
    source.onerror = null
    try {
      source.close()
    } catch {
      // Already closed.
    }
  }
}
