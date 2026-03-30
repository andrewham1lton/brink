import { describe, expect, it, vi } from 'vitest'

import { StartupSessionTracker } from './startupSessionTracker'

class FakeClock {
  private nowMs = 0
  private nextTimerId = 1
  private readonly timers = new Map<number, { callback: () => void; dueAt: number }>()

  advanceBy(ms: number) {
    const target = this.nowMs + ms

    while (true) {
      let nextTimer: { callback: () => void; dueAt: number; id: number } | null = null

      for (const [id, timer] of this.timers) {
        if (timer.dueAt > target) {
          continue
        }

        if (!nextTimer || timer.dueAt < nextTimer.dueAt) {
          nextTimer = {
            callback: timer.callback,
            dueAt: timer.dueAt,
            id,
          }
        }
      }

      if (!nextTimer) {
        break
      }

      this.timers.delete(nextTimer.id)
      this.nowMs = nextTimer.dueAt
      nextTimer.callback()
    }

    this.nowMs = target
  }

  clearTimeout = (timerId: ReturnType<typeof setTimeout>) => {
    this.timers.delete(timerId as number)
  }

  now = () => this.nowMs

  setTimeout = (callback: () => void, delayMs: number) => {
    const timerId = this.nextTimerId++
    this.timers.set(timerId, {
      callback,
      dueAt: this.nowMs + delayMs,
    })
    return timerId as ReturnType<typeof setTimeout>
  }
}

describe('StartupSessionTracker', () => {
  it('shuts down after the startup grace period if no page connects', () => {
    const clock = new FakeClock()
    const onShutdown = vi.fn()

    new StartupSessionTracker({
      clock,
      onShutdown,
      sessionId: 'session-1',
      startupGraceMs: 5_000,
    })

    clock.advanceBy(4_999)
    expect(onShutdown).not.toHaveBeenCalled()

    clock.advanceBy(1)
    expect(onShutdown).toHaveBeenCalledTimes(1)
  })

  it('stays alive while the current page keeps heartbeating', () => {
    const clock = new FakeClock()
    const onShutdown = vi.fn()

    const tracker = new StartupSessionTracker({
      clock,
      onShutdown,
      sessionId: 'session-1',
      staleAfterMs: 10_000,
    })

    tracker.heartbeat('session-1', 'page-1')
    clock.advanceBy(9_999)
    expect(onShutdown).not.toHaveBeenCalled()

    tracker.heartbeat('session-1', 'page-1')
    clock.advanceBy(9_999)
    expect(onShutdown).not.toHaveBeenCalled()

    clock.advanceBy(1)
    expect(onShutdown).toHaveBeenCalledTimes(1)
  })

  it('uses a close grace period so reloads can reconnect without killing the server', () => {
    const clock = new FakeClock()
    const onShutdown = vi.fn()

    const tracker = new StartupSessionTracker({
      clock,
      closeGraceMs: 3_000,
      onShutdown,
      sessionId: 'session-1',
      staleAfterMs: 10_000,
    })

    tracker.heartbeat('session-1', 'page-1')
    tracker.close('session-1', 'page-1')
    clock.advanceBy(2_999)
    expect(onShutdown).not.toHaveBeenCalled()

    tracker.heartbeat('session-1', 'page-2')
    clock.advanceBy(3_001)
    expect(onShutdown).not.toHaveBeenCalled()
  })

  it('ignores lifecycle events from older sessions', () => {
    const clock = new FakeClock()
    const onShutdown = vi.fn()

    const tracker = new StartupSessionTracker({
      clock,
      closeGraceMs: 1_000,
      onShutdown,
      sessionId: 'session-2',
      staleAfterMs: 1_000,
    })

    expect(tracker.heartbeat('session-1', 'page-1')).toBe(false)
    expect(tracker.close('session-1', 'page-1')).toBe(false)

    clock.advanceBy(999)
    expect(onShutdown).not.toHaveBeenCalled()
  })
})
