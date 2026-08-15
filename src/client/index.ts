/**
 * Mobile remote control — browser half. Registers the `remote` dictionaries,
 * the sidebar-foot entry (phone trigger + pairing panel) into the
 * ui-sidebar-declared `sidebar.remote` seat, and runs the phone-side boot
 * flow (pair accept + workspace deep-link + presence heartbeats) plus the
 * one-time failed-pair notice. Export discipline: packages/client/AGENTS.md
 * — the /client surface carries only what cordis loading needs plus types.
 */
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import type { ClientContext, SettingsScope, SettingsScopeSpec } from '@deepseek-ai/dsh-client-runtime/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale) and the
// ui-sidebar SlotMap merge (the 'sidebar.remote' hole).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the settings-surface SlotMap merge (the 'settings.section'
// entry) and the ctx.settingsScope Context merge.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client'
import { FooterRemoteEntry } from './FooterRemoteEntry.tsx'
import { PairFailedNotice } from './PairFailedNotice.tsx'
import { RemoteSettingsCard, RemoteSettingsCardController, type RemoteSettings } from './RemoteSettingsCard.tsx'
import { RemoteSettingsSection } from './RemoteSettingsSection.tsx'
import { en, zh, type RemoteKey } from './locales.ts'
import { PAIR_FAILED_MARKER, runPairBootFlow } from './deep-link.ts'
import { sendHeartbeat } from './pair-api.ts'
import {
  alertTaskComplete,
  requestTaskCompletePermission,
  RunningIdleWatcher,
  unlockTaskCompleteAudio,
} from '../task-complete.ts'

// Safety net for plain-http LAN origins: the web UI calls crypto.randomUUID
// for client RPC/draft ids, but that API only exists in secure contexts. The
// host also injects this polyfill into index.html; this module-level copy
// covers cached/old index responses too.
if (typeof crypto !== 'undefined' && typeof crypto.randomUUID !== 'function') {
  try {
    const cryptoObject = crypto as unknown as { randomUUID?: () => string }
    cryptoObject.randomUUID = () => {
      const bytes = crypto.getRandomValues(new Uint8Array(16))
      bytes[6] = (bytes[6] & 0x0f) | 0x40
      bytes[8] = (bytes[8] & 0x3f) | 0x80
      const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
    }
  } catch {
    // If the Crypto object is non-extensible, the index.html polyfill is the
    // authoritative fallback.
  }
}

export type { RemoteEntryProps } from './RemoteEntry.tsx'
export type { PanelState, RemotePanelProps } from './RemotePanel.tsx'
export type { PairFailedNoticeProps } from './PairFailedNotice.tsx'
export type { RemoteKey } from './locales.ts'
export type { RemoteSettingsCardFace, RemoteSettingsCardState } from './RemoteSettingsCard.tsx'
export type { RemoteSettingsSectionFace, RemoteSettingsSectionProps } from './RemoteSettingsSection.tsx'
export type { RemoteStatusProps } from './RemoteStatus.tsx'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Mobile remote-control surface copy. */
    remote: RemoteKey
  }

  interface SlotMap {
    /**
     * The sidebar foot seat beside the settings trigger, declared by the
     * sidebar shell on deployments that carry the feature seat; the shell
     * passes only its column display state.
     */
    'sidebar.remote': { kind: 'single'; scope: 'root'; owner: SidebarRemoteOwnerProps }
    /**
     * The child slot the Web UI plugin group declares; this card registers
     * into the group instead of the top-level `settings.plugin.item` list.
     * Spelled here with the same shape so this package can register without
     * depending on the sibling UI package.
     */
    'web-ui.plugin.item': { kind: 'list'; scope: 'root'; owner: SettingsPluginItemOwnerProps }
  }
}

/** Owner share of the sidebar remote-control seat: the column display state the trigger renders against. */
export interface SidebarRemoteOwnerProps {
  /** Whether the sidebar renders wide content (false = 56px rail). */
  wide: boolean
}

/** Owner share of a plugin card (the section supplies nothing). */
export interface SettingsPluginItemOwnerProps {
  /** Marker field: card owner props are intentionally empty. */
  children?: never
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    /**
     * Optional rc.6 compatibility binder provided by dsh-web-ui-settings;
     * absent when that group plugin is not installed, so callers fall back to
     * the official settings scope.
     */
    webUiSettings?: { bind<S>(spec: SettingsScopeSpec<S>): SettingsScope<S> }
  }
}


/** Dictionary namespace owned by this plugin. */
const NS = 'remote'

/** Settings namespace the remote-control card edits (the Host plugin registers it). */
const REMOTE_WEB_UI_NS = 'remote-web-ui'

/** Heartbeat cadence from a paired phone (presence + revocation liveness). */
const HEARTBEAT_INTERVAL_MS = 10_000

/** Services required by this plugin. */
export const inject = ['slots', 'locale', 'connection', 'settingsScope', 'remote', 'sessions']

/**
 * Register the remote-control surface.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  // Small-screen overrides for the shared web UI. The desktop app already
  // collapses its sidebar/details on narrow viewports; these tweaks reduce
  // padding and enlarge touch targets so the same UI is usable on a phone.
  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.plugin = 'remote-web-ui/mobile-overrides'
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
    `
    document.head.appendChild(style)
    return () => { style.remove() }
  }, 'remote-web-ui: mobile web overrides')

  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'remote-web-ui: dictionaries')

  const t = ctx.locale.bind(NS)
  const binder = ctx.get('webUiSettings') ?? ctx.settingsScope
  const settingsScope = binder.bind<RemoteSettings>({ namespace: REMOTE_WEB_UI_NS })
  const enabled = (): boolean => {
    const snapshot = settingsScope.getSnapshot()
    return snapshot.status === 'ready'
      ? snapshot.value?.enabled ?? true
      : snapshot.status === 'unavailable'
  }

  // Status chip above Settings while remote control is on. Pairing lives on
  // the settings.section page; this seat is display-only.
  ctx.slots.inject('sidebar.footer.action', () => {
    let disposeEntry: (() => void) | undefined
    const syncEntry = (): void => {
      if (enabled() && disposeEntry === undefined) {
        disposeEntry = ctx.slots.register({ name: 'sidebar.footer.action', id: 'remote-web-ui', locale: NS }, FooterRemoteEntry)
      } else if (!enabled() && disposeEntry !== undefined) {
        disposeEntry()
        disposeEntry = undefined
      }
    }
    const unsubscribe = settingsScope.subscribe(syncEntry)
    syncEntry()
    return () => {
      unsubscribe()
      disposeEntry?.()
    }
  })

  // Plugin configuration card: one staged form over the `remote-web-ui`
  // settings namespace, contributed to the Web UI plugin group.
  const remoteSettings = new RemoteSettingsCardController(settingsScope)
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'remote',
    order: 20,
    label: () => t('settings.nav'),
    locale: NS,
    inject: () => {
      const face = remoteSettings.inject()
      return {
        ...face,
        hooks: {
          ...face.hooks,
          remoteEnabled: {
            getSnapshot: enabled,
            subscribe: (listener: () => void) => settingsScope.subscribe(listener),
          },
        },
      }
    },
  }, RemoteSettingsSection))

  ctx.slots.inject('web-ui.plugin.item', () => ctx.slots.register({
    name: 'web-ui.plugin.item',
    id: 'remote-web-ui',
    order: 90,
    locale: NS,
    inject: () => remoteSettings.inject(),
  }, RemoteSettingsCard))

  // Phone-side boot flow + heartbeats. Loopback pages (the desktop) never
  // heartbeat; the server ignores unpaired heartbeats anyway. Both run only
  // while the plugin is enabled.
  let disposeRuntime: (() => void) | undefined
  const syncRuntime = (): void => {
    if (enabled() && disposeRuntime === undefined) {
      disposeRuntime = ctx.effect(() => {
        const connection = ctx.get('connection') as ConnectionHandle | undefined
        const loopback = connection?.isLoopback ?? true
        runPairBootFlow(ctx, window.location.search)
        if (loopback) return () => {}
        const timer = window.setInterval(() => { void sendHeartbeat().catch(() => {}) }, HEARTBEAT_INTERVAL_MS)
        return () => { window.clearInterval(timer) }
      }, 'remote-web-ui: pair flow + heartbeats')
    } else if (!enabled() && disposeRuntime !== undefined) {
      disposeRuntime()
      disposeRuntime = undefined
    }
  }
  settingsScope.subscribe(syncRuntime)
  syncRuntime()

  // Task-complete chime + system notification. The first pointerdown unlocks
  // Web Audio (browsers block it until a gesture) and asks for Notification
  // permission. Running→idle edges come from the session list, which already
  // folds host/session-status; reconnect resets the watcher so a list refresh
  // does not burst.
  ctx.effect(() => {
    const watcher = new RunningIdleWatcher()
    const notifyEnabled = (): boolean => {
      const snapshot = settingsScope.getSnapshot()
      if (snapshot.status !== 'ready') return true
      return snapshot.value?.notifyOnComplete ?? true
    }
    const onList = (): void => {
      const list = ctx.sessions.list.getSnapshot()
      const idle = watcher.ingest(list.ids.flatMap((id) => {
        const row = list.byId[id]
        if (row === undefined) return []
        return [{ sessionId: id, running: row.running, title: row.displayTitle }]
      }))
      if (!notifyEnabled()) return
      for (const event of idle) alertTaskComplete(event.title)
    }
    onList()
    const unsubList = ctx.sessions.list.subscribe(onList)
    const unsubReset = ctx.on('connection/reset', () => { watcher.reset() })
    const onGesture = (): void => {
      unlockTaskCompleteAudio()
      if (notifyEnabled()) void requestTaskCompletePermission()
    }
    window.addEventListener('pointerdown', onGesture, { once: true })
    return () => {
      unsubList()
      unsubReset()
      window.removeEventListener('pointerdown', onGesture)
    }
  }, 'remote-web-ui: task-complete alerts')

  // One-time failed-pair toast. The accept result lands asynchronously, so
  // the marker check is deferred past the accept round trip.
  ctx.effect(() => {
    const timer = window.setTimeout(() => {
      const code = sessionStorage.getItem(PAIR_FAILED_MARKER)
      if (code === null) return
      sessionStorage.removeItem(PAIR_FAILED_MARKER)
      const mount = document.createElement('div')
      document.body.appendChild(mount)
      const root = createRoot(mount)
      root.render(createElement(PairFailedNotice, { t, code }))
      // The toast owns its dismissal; the root lives for the page lifetime.
      void root
    }, 1500)
    return () => { window.clearTimeout(timer) }
  }, 'remote-web-ui: failed-pair notice')
}
