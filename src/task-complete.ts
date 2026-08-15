/**
 * Task-complete alerts for the desktop web GUI and open phone pages.
 * Watches agent running→idle edges and plays a short chime plus an optional
 * Notification. Copy never includes origins, URLs, or filesystem paths.
 */

/** One session row the idle watcher understands. */
export interface RunningRow {
  sessionId: string
  running: boolean
  /** Human title already reduced to a label (never a URL or absolute path). */
  title?: string
}

/** One running→idle transition the watcher reports. */
export interface IdleEvent {
  sessionId: string
  title: string
}

/** Fallback label when a session has no projected title yet. */
export const FALLBACK_SESSION_TITLE = '会话'

/**
 * Detects running→idle edges. The first ingest only seeds; reconnects must
 * {@link RunningIdleWatcher.reset} so a list refresh does not fire a burst.
 */
export class RunningIdleWatcher {
  private readonly running = new Map<string, boolean>()
  private readonly titles = new Map<string, string>()
  private seeded = false

  /** Drop remembered bits (call on a new connection generation). */
  reset(): void {
    this.running.clear()
    this.titles.clear()
    this.seeded = false
  }

  /**
   * Fold one snapshot or increment.
   * @param rows - current running bits; a partial list does not prune unseen ids.
   * @returns sessions that just went idle (empty before the first ingest).
   */
  ingest(rows: Iterable<RunningRow>): IdleEvent[] {
    const idle: IdleEvent[] = []
    for (const row of rows) {
      if (row.title !== undefined && row.title !== '') this.titles.set(row.sessionId, row.title)
      const previous = this.running.get(row.sessionId)
      if (this.seeded && previous === true && !row.running) {
        idle.push({
          sessionId: row.sessionId,
          title: this.titles.get(row.sessionId) ?? FALLBACK_SESSION_TITLE,
        })
      }
      this.running.set(row.sessionId, row.running)
    }
    this.seeded = true
    return idle
  }
}

/**
 * Watches the live mux stream for per-turn completions. A `turn/end` with
 * reason `completed` means ONE agent task finished, even when the session
 * itself stays running for more queued work — that is the signal the UI
 * should notify on for each completed task.
 */
export class TurnCompleteWatcher {
  private readonly titles = new Map<string, string>()
  private readonly seen = new Set<string>()

  /** Forget all remembered titles/seen turn keys (call on connection reset). */
  reset(): void {
    this.titles.clear()
    this.seen.clear()
  }

  /** Remember a session title for notification copy. */
  setTitle(sessionId: string, title: string): void {
    if (title !== '') this.titles.set(sessionId, title)
  }

  /**
   * Fold one mux frame.
   * @param frame - a mux payload (duck-typed; unknown shapes are ignored).
   * @returns tasks that just completed (one event per turn/end completed).
   */
  ingestFrame(frame: unknown): IdleEvent[] {
    if (typeof frame !== 'object' || frame === null) return []
    const candidate = frame as {
      type?: unknown
      sessionId?: unknown
      event?: { type?: unknown; data?: { turn?: unknown; reason?: { kind?: unknown } } }
    }
    if (candidate.type !== 'session/event' || typeof candidate.sessionId !== 'string') return []
    const event = candidate.event
    if (event === undefined || event.type !== 'turn/end') return []
    const turn = event.data?.turn
    if (typeof turn !== 'number') return []
    if (event.data?.reason?.kind !== 'completed') return []
    const sessionId = candidate.sessionId
    const key = `${sessionId}:${turn}`
    if (this.seen.has(key)) return []
    this.seen.add(key)
    return [{
      sessionId,
      title: this.titles.get(sessionId) ?? FALLBACK_SESSION_TITLE,
    }]
  }
}

const NOTIFY_TITLE = '任务已完成'
const NOTIFY_TAG = 'dsh-task-complete'

let audio: AudioContext | undefined

/** The AudioContext constructor this browser exposes, if any. */
function AudioCtor(): typeof AudioContext | undefined {
  const g = globalThis as typeof globalThis & { webkitAudioContext?: typeof AudioContext }
  return g.AudioContext ?? g.webkitAudioContext
}

/** Lazily create (or reuse) the chime context. */
function audioContext(): AudioContext | undefined {
  const Ctor = AudioCtor()
  if (Ctor === undefined) return undefined
  audio ??= new Ctor()
  return audio
}

/**
 * Resume the chime context after a user gesture. Browsers refuse to start
 * audio until then; call from pointerdown.
 */
export function unlockTaskCompleteAudio(): void {
  const ctx = audioContext()
  if (ctx === undefined) return
  if (ctx.state === 'suspended') void ctx.resume()
}

/**
 * Ask the browser for Notification permission. Safe to call without a
 * gesture; some browsers then leave permission at `default`.
 * @returns the permission string, or `unsupported` when the API is absent.
 */
export async function requestTaskCompletePermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof Notification === 'undefined') return 'unsupported'
  if (Notification.permission !== 'default') return Notification.permission
  try {
    return await Notification.requestPermission()
  } catch {
    return Notification.permission
  }
}

/** Current Notification permission, or `unsupported`. */
export function taskCompletePermission(): NotificationPermission | 'unsupported' {
  if (typeof Notification === 'undefined') return 'unsupported'
  return Notification.permission
}

/**
 * Play the chime, vibrate on phones, and show a system notification when
 * permission is already granted. Hidden documents skip the chime (the OS
 * notification sound covers backgrounded tabs) so a visible page does not
 * double-play against the OS banner.
 * @param title - session label already reduced to display text.
 */
export function alertTaskComplete(title: string): void {
  const hidden = typeof document !== 'undefined' && document.hidden
  if (!hidden) playChime()
  vibrate()
  showNotification(title, hidden)
}

/** Short two-note chime through Web Audio. */
function playChime(): void {
  const ctx = audioContext()
  if (ctx === undefined) return
  void ctx.resume()
  const start = ctx.currentTime
  tone(ctx, 880, start, 0.12)
  tone(ctx, 1174.7, start + 0.13, 0.18)
}

/** One decaying sine beep. */
function tone(ctx: AudioContext, frequency: number, start: number, duration: number): void {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(0.16, start + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.02)
}

/** Best-effort vibration; absent on desktop. */
function vibrate(): void {
  const nav = typeof navigator === 'undefined' ? undefined : navigator
  if (nav === undefined || typeof nav.vibrate !== 'function') return
  try {
    nav.vibrate(180)
  } catch {
    // Some embeds expose vibrate but refuse it.
  }
}

/**
 * System notification. `silent` is true while the page is visible (the chime
 * already played); backgrounded tabs let the OS play its own sound.
 */
function showNotification(body: string, backgrounded: boolean): void {
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted') return
  try {
    const notification = new Notification(NOTIFY_TITLE, {
      body,
      tag: NOTIFY_TAG,
      silent: !backgrounded,
      renotify: true,
    })
    notification.onclick = () => {
      try {
        window.focus()
      } catch {
        // Focus can fail in a backgrounded iframe; the click still dismissed it.
      }
      notification.close()
    }
  } catch {
    // Permission can race to denied between the check and the constructor.
  }
}
