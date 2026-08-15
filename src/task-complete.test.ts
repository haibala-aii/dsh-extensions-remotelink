/** RunningIdleWatcher: first ingest seeds; later running→idle edges fire once. */
import { describe, expect, it } from 'vitest'
import { FALLBACK_SESSION_TITLE, RunningIdleWatcher } from './task-complete.ts'

describe('RunningIdleWatcher', () => {
  it('does not fire on the first snapshot, including already-idle rows', () => {
    const watcher = new RunningIdleWatcher()
    expect(watcher.ingest([
      { sessionId: 'a', running: false, title: 'one' },
      { sessionId: 'b', running: true, title: 'two' },
    ])).toEqual([])
  })

  it('fires once when a seeded running session goes idle', () => {
    const watcher = new RunningIdleWatcher()
    watcher.ingest([{ sessionId: 'a', running: true, title: 'alpha' }])
    expect(watcher.ingest([{ sessionId: 'a', running: false }])).toEqual([
      { sessionId: 'a', title: 'alpha' },
    ])
    expect(watcher.ingest([{ sessionId: 'a', running: false }])).toEqual([])
  })

  it('does not fire idle→idle or running→running', () => {
    const watcher = new RunningIdleWatcher()
    watcher.ingest([{ sessionId: 'a', running: false }])
    expect(watcher.ingest([{ sessionId: 'a', running: false }])).toEqual([])
    watcher.ingest([{ sessionId: 'b', running: true }])
    expect(watcher.ingest([{ sessionId: 'b', running: true }])).toEqual([])
  })

  it('uses the fallback title when none was ever supplied', () => {
    const watcher = new RunningIdleWatcher()
    watcher.ingest([{ sessionId: 'a', running: true }])
    expect(watcher.ingest([{ sessionId: 'a', running: false }])).toEqual([
      { sessionId: 'a', title: FALLBACK_SESSION_TITLE },
    ])
  })

  it('keeps a later title and ignores empty replacements', () => {
    const watcher = new RunningIdleWatcher()
    watcher.ingest([{ sessionId: 'a', running: true, title: 'kept' }])
    watcher.ingest([{ sessionId: 'a', running: true, title: '' }])
    expect(watcher.ingest([{ sessionId: 'a', running: false }])).toEqual([
      { sessionId: 'a', title: 'kept' },
    ])
  })

  it('does not treat a partial snapshot as pruning unseen sessions', () => {
    const watcher = new RunningIdleWatcher()
    watcher.ingest([
      { sessionId: 'a', running: true, title: 'alpha' },
      { sessionId: 'b', running: true, title: 'beta' },
    ])
    expect(watcher.ingest([{ sessionId: 'a', running: true }])).toEqual([])
    expect(watcher.ingest([{ sessionId: 'b', running: false }])).toEqual([
      { sessionId: 'b', title: 'beta' },
    ])
  })

  it('reset re-seeds so a reconnect does not burst', () => {
    const watcher = new RunningIdleWatcher()
    watcher.ingest([{ sessionId: 'a', running: true, title: 'alpha' }])
    watcher.reset()
    expect(watcher.ingest([{ sessionId: 'a', running: false, title: 'alpha' }])).toEqual([])
    watcher.ingest([{ sessionId: 'a', running: true }])
    expect(watcher.ingest([{ sessionId: 'a', running: false }])).toEqual([
      { sessionId: 'a', title: 'alpha' },
    ])
  })
})
