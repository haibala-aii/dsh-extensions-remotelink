/**
 * Pairing body used by the settings section: mints a QR on mount, keeps the
 * status stream, and renders {@link RemotePanel} inline.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { PairingPhase } from '../pairing.ts'
import { RemotePanel, type PanelState } from './RemotePanel.tsx'
import { copyText, issuePair, stopPair, type IssueResponse, type PairStateFrame, type TunnelStatusFrame } from './pair-api.ts'

/** Pairing-body props: locale seat only (settings has no workspace owner share). */
export type RemotePairingProps = PropsLocale<'remote'>

/** Apply one status frame onto the current ready state. */
function mergeFrame(state: PanelState, frame: PairStateFrame): PanelState {
  if (state.kind !== 'ready') return state
  return {
    ...state,
    phase: frame.phase,
    deviceCount: frame.deviceCount,
    onlineCount: frame.onlineCount,
    ...(frame.tunnel !== undefined ? { tunnel: frame.tunnel as TunnelStatusFrame } : {}),
  }
}

/**
 * Render the inline pairing panel.
 * @param props - locale seat.
 * @returns the pairing element tree.
 */
export function RemotePairing({ t }: RemotePairingProps) {
  const [state, setState] = useState<PanelState>({ kind: 'lan-required' })
  const [copied, setCopied] = useState(false)
  const eventSource = useRef<EventSource | undefined>(undefined)

  const closeEventSource = useCallback(() => {
    eventSource.current?.close()
    eventSource.current = undefined
  }, [])

  const mint = useCallback(async (address?: string): Promise<PanelState> => {
    let result: IssueResponse
    try {
      result = await issuePair(undefined, address)
    } catch {
      return { kind: 'unreachable' }
    }
    if (!result.ok) {
      if (result.code === 'forbidden') return { kind: 'loopback-required' }
      if (result.code === 'unknown-address') return { kind: 'unreachable' }
      return { kind: 'lan-required' }
    }
    const publicBaseUrl = result.publicBaseUrl
    return {
      kind: 'ready',
      url: result.url,
      expiresAt: result.expiresAt,
      expired: Date.now() > result.expiresAt,
      phase: 'waiting',
      deviceCount: 0,
      onlineCount: 0,
      public: publicBaseUrl !== undefined && result.url.startsWith(publicBaseUrl),
      ...(publicBaseUrl !== undefined ? { publicBaseUrl } : {}),
      address: address ?? result.lanAddresses[0] ?? '',
      lanAddresses: result.lanAddresses,
    }
  }, [])

  const listen = useCallback((next: PanelState) => {
    closeEventSource()
    if (next.kind !== 'ready') return
    const source = new EventSource('/api/pair/events')
    eventSource.current = source
    source.onmessage = (event) => {
      try {
        const frame = JSON.parse(event.data as string) as PairStateFrame
        if (frame.type !== 'state') return
        setState(previous => mergeFrame(previous, frame))
      } catch {
        // Malformed frames are dropped; the snapshot on open is authoritative.
      }
    }
  }, [closeEventSource])

  useEffect(() => {
    void mint().then((next) => {
      setState(next)
      listen(next)
    })
    return closeEventSource
  }, [closeEventSource, listen, mint])

  useEffect(() => {
    if (state.kind !== 'ready') return
    if (state.expired) return
    const delay = state.expiresAt - Date.now()
    if (delay <= 0) {
      setState(previous => previous.kind === 'ready' ? { ...previous, expired: true } : previous)
      return
    }
    const timer = window.setTimeout(() => {
      setState(previous => previous.kind === 'ready' ? { ...previous, expired: true } : previous)
    }, delay)
    return () => { window.clearTimeout(timer) }
  }, [state])

  const handleStop = useCallback(() => {
    void stopPair().catch(() => {})
    setState(previous => previous.kind === 'ready' ? { ...previous, phase: 'stopped' as PairingPhase } : previous)
  }, [])

  const handleRefresh = useCallback(() => {
    void mint().then((next) => {
      setState(next)
      listen(next)
    })
  }, [listen, mint])

  const handlePickAddress = useCallback((address: string) => {
    void mint(address).then((next) => {
      setState(next)
      listen(next)
    })
  }, [listen, mint])

  const handlePickPublic = useCallback(() => {
    void mint().then((next) => {
      setState(next)
      listen(next)
    })
  }, [listen, mint])

  const handleCopy = useCallback(() => {
    if (state.kind !== 'ready') return
    void copyText(state.url).then((ok) => {
      if (!ok) return
      setCopied(true)
      window.setTimeout(() => { setCopied(false) }, 1500)
    })
  }, [state])

  return (
    <RemotePanel
      t={t}
      state={state}
      copied={copied}
      embedded
      onClose={() => {}}
      onStop={handleStop}
      onRefresh={handleRefresh}
      onCopy={handleCopy}
      onPickAddress={handlePickAddress}
      onPickPublic={handlePickPublic}
    />
  )
}
