/**
 * Sidebar-foot status chip shown above Settings while a phone is live.
 */
import { useEffect, useState } from 'react'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { PhoneIcon } from './PhoneIcon.tsx'
import type { PairStateFrame } from './pair-api.ts'
import css from './remote.module.css'

/** Status-chip props: column state plus the locale seat. */
export type RemoteStatusProps = PropsLocale<'remote'> & {
  /** Whether the sidebar renders wide content (false = 56px rail). */
  wide: boolean
}

/** True only while at least one paired phone is online. */
function isLive(frame: PairStateFrame): boolean {
  return frame.phase === 'connected' && frame.onlineCount > 0
}

/**
 * Render the "正在远程操控" chip above the settings trigger.
 * Hidden while waiting for a phone or after every paired phone goes offline.
 * @param props - column state and locale seat.
 * @returns the status element, or nothing.
 */
export function RemoteStatus({ wide, t }: RemoteStatusProps) {
  const [live, setLive] = useState(false)

  useEffect(() => {
    const source = new EventSource('/api/pair/events')
    source.onmessage = (event) => {
      try {
        const frame = JSON.parse(event.data as string) as PairStateFrame
        if (frame.type !== 'state') return
        setLive(isLive(frame))
      } catch {
        // Malformed frames are dropped; the next snapshot reconverges.
      }
    }
    source.onerror = () => { setLive(false) }
    return () => { source.close() }
  }, [])

  if (!live) return null

  return (
    <div
      className={wide ? css.status : css.statusRail}
      role="status"
      aria-label={t('footer.status')}
      title={t('footer.status')}
    >
      <PhoneIcon size={wide ? 16 : 18} />
      {wide && <span className={css.statusLabel}>{t('footer.status')}</span>}
    </div>
  )
}
