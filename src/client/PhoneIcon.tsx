/**
 * Phone-device glyph for the remote-control status row. Outline style with
 * currentColor strokes, matching ui-primitives icons.
 */

/** Icon props mirroring ui-primitives' IconProps. */
export interface PhoneIconProps {
  /** Glyph size in px (default 16). */
  size?: number
  /** Extra class for layout placement. */
  className?: string
}

/**
 * Render a smartphone glyph (not a telephone handset).
 * @param props - size and optional class.
 * @returns the svg element.
 */
export function PhoneIcon({ size = 16, className }: PhoneIconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="4.25"
        y="1.75"
        width="7.5"
        height="12.5"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path d="M7 12.35h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path
        d="M12.4 5.1a3.4 3.4 0 0 1 0 5.8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}
