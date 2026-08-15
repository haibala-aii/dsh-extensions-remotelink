/** host-status: parse session-status SSE lines; ignore other host frames. */
import { describe, expect, it } from 'vitest'
import { parseSessionStatusFrame } from './host-status.ts'

/** One server-request envelope carrying a host frame. */
function envelope(payload: unknown): string {
  return JSON.stringify({ type: 'server-request', rpcId: 'h1', method: 'events.host', payload })
}

describe('parseSessionStatusFrame', () => {
  it('returns a session-status frame', () => {
    expect(parseSessionStatusFrame(envelope({
      type: 'host/session-status',
      sessionId: 's1',
      running: false,
    }))).toEqual({ type: 'host/session-status', sessionId: 's1', running: false })
  })

  it('drops other host frames, malformed JSON, and empty lines', () => {
    expect(parseSessionStatusFrame(envelope({
      type: 'host/session-removed',
      sessionId: 's1',
    }))).toBeUndefined()
    expect(parseSessionStatusFrame('not-json')).toBeUndefined()
    expect(parseSessionStatusFrame('')).toBeUndefined()
  })
})
