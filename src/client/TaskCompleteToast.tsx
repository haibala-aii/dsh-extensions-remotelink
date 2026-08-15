/**
 * In-app task-complete toast: a small non-blocking banner shown on every
 * surface (desktop and phone web UI) when one agent task finishes. This is a
 * companion to the system Notification — it works even before the user
 * grants Notification permission.
 */
import { useEffect, useState } from 'react'
import css from './remote.module.css'

/** Toast props: the session title to show and the dismissal callback. */
export interface TaskCompleteToastProps {
  title: string
  /** Called when the toast auto-dismisses so the caller can unmount. */
  onDone(): void
}

/**
 * Render the task-complete toast (auto-dismisses).
 * @param props - session title and completion callback.
 * @returns the toast element.
 */
export function TaskCompleteToast({ title, onDone }: TaskCompleteToastProps) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false)
      onDone()
    }, 4000)
    return () => { window.clearTimeout(timer) }
  }, [onDone])
  if (!visible) return null
  return (
    <div className={css.taskToast} role="status">
      <p className={css.taskToastTitle}>任务已完成</p>
      <p className={css.taskToastDetail}>{title}</p>
    </div>
  )
}
