/**
 * Settings page for mobile remote control: pairing QR plus the enable form.
 */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { RemotePairing } from './RemotePairing.tsx'
import { RemoteSettingsCard, type RemoteSettingsCardFace, type RemoteSettingsCardProps } from './RemoteSettingsCard.tsx'
import css from './remote.module.css'

/** Section inject face: the settings card plus the committed enable flag. */
export type RemoteSettingsSectionFace = RemoteSettingsCardFace & {
  hooks: RemoteSettingsCardFace['hooks'] & {
    /** Committed master switch (not the staged form draft). */
    remoteEnabled: { getSnapshot(): boolean; subscribe(listener: () => void): () => void }
  }
}

/** Props the renderer binds for the remote-control settings section. */
export type RemoteSettingsSectionProps =
  PropsRuntime<'settings.section'>
  & PropsLocale<'remote'>
  & InjectFace<RemoteSettingsSectionFace>

/**
 * Render the remote-control settings page.
 * @param props - section owner share, locale, card face, and committed enable flag.
 * @returns the section.
 */
export function RemoteSettingsSection(props: RemoteSettingsSectionProps) {
  const enabled = props.useRemoteEnabled(value => value)
  const card = {
    t: props.t,
    useRemoteSettingsCard: props.useRemoteSettingsCard,
    save: props.save,
    discard: props.discard,
    edit: props.edit,
    resetField: props.resetField,
  } as RemoteSettingsCardProps
  return (
    <div className={css.section}>
      {enabled
        ? <RemotePairing t={props.t} />
        : <p className={css.sectionHint} role="status">{props.t('settings.disabledHint')}</p>}
      <ul className={css.cardList}>
        <RemoteSettingsCard {...card} />
      </ul>
    </div>
  )
}
