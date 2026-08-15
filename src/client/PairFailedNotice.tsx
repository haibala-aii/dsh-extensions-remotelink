/**
 * One-time failed-pairing notice: a fixed toast rendered on the phone after
 * a QR accept failed (invalid/used token or a network error). Mounted by
 * the client apply with a plain React root — no slot machinery for a
 * transient diagnostic.
 */
import { useEffect, useState } from 'react'
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots'
import css from './remote.module.css'

/** Notice props: localized copy and the diagnostic failure code. */
export interface PairFailedNoticeProps {
  t: TranslateNS<'remote'>
  /** Failure code stored by the boot flow: invalid | used | forbidden | network | failed. */
  code?: string
}

/** Human-readable diagnostic for each failure code (concise, for bug reports). */
function detailFor(code: string | undefined, t: TranslateNS<'remote'>): string {
  switch (code) {
    case 'invalid': return `${t('pair.failed.detail')}（code: invalid）`
    case 'used': return `${t('pair.failed.detail')}（code: used）`
    case 'forbidden': return `${t('pair.failed.detail')}（code: forbidden）`
    case 'network': return `${t('pair.failed.detail')}（code: network）`
    default: return t('pair.failed.detail')
  }
}

/**
 * Render the failed-pair toast (auto-dismisses).
 * @param props - localized copy and failure code.
 * @returns the toast element.
 */
export function PairFailedNotice({ t, code }: PairFailedNoticeProps) {  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const timer = window.setTimeout(() => { setVisible(false) }, 8000)
    return () => { window.clearTimeout(timer) }
  }, [])
  if (!visible) return null
  return (
    <div className={css.notice} role="alert">
      <p className={css.noticeTitle}>{t('pair.failed.title')}</p>
      <p className={css.noticeDetail}>{detailFor(code, t)}</p>
    </div>
  )
}
