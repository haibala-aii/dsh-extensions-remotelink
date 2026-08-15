/**
 * Sidebar footer-seat wrapper: the live "正在远程操控" chip above Settings.
 */
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { RemoteStatus } from './RemoteStatus.tsx'

/** Entry props: the footer seat's column state + the standard locale seat. */
export type FooterRemoteEntryProps = PropsLocale<'remote'> & { wide: boolean }

/**
 * Render the remote-control status chip from the footer seat.
 * @param props - composed slot props (footer seat subset).
 * @returns the status element.
 */
export function FooterRemoteEntry(props: FooterRemoteEntryProps) {
  return <RemoteStatus wide={props.wide} t={props.t} />
}
