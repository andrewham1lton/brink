export const STARTUP_SESSION_HEARTBEAT_PATH = '/__startup_session__/heartbeat'
export const STARTUP_SESSION_CLOSE_PATH = '/__startup_session__/close'

export const STARTUP_SESSION_HEARTBEAT_INTERVAL_MS = 2_000
export const STARTUP_SESSION_STALE_AFTER_MS = 8_000
export const STARTUP_SESSION_CLOSE_GRACE_MS = 3_000
export const STARTUP_SESSION_STARTUP_GRACE_MS = 30_000

type StartupSessionTimer = ReturnType<typeof setTimeout>

type StartupSessionClock = {
  now: () => number
  setTimeout: (callback: () => void, delayMs: number) => StartupSessionTimer
  clearTimeout: (timer: StartupSessionTimer) => void
}

type StartupSessionTrackerOptions = {
  closeGraceMs?: number
  clock?: StartupSessionClock
  onShutdown: () => void
  sessionId: string
  staleAfterMs?: number
  startupGraceMs?: number
}

const defaultClock: StartupSessionClock = {
  clearTimeout: globalThis.clearTimeout,
  now: () => Date.now(),
  setTimeout: globalThis.setTimeout,
}

export class StartupSessionTracker {
  private readonly closeGraceMs: number
  private readonly clock: StartupSessionClock
  private readonly onShutdown: () => void
  private readonly pageLastSeen = new Map<string, number>()
  private readonly sessionId: string
  private readonly staleAfterMs: number
  private readonly startedAt: number
  private readonly startupGraceMs: number

  private hasSeenClient = false
  private shutdownRequested = false
  private timer: StartupSessionTimer | null = null
  private timerDueAt: number | null = null

  constructor({
    closeGraceMs = STARTUP_SESSION_CLOSE_GRACE_MS,
    clock = defaultClock,
    onShutdown,
    sessionId,
    staleAfterMs = STARTUP_SESSION_STALE_AFTER_MS,
    startupGraceMs = STARTUP_SESSION_STARTUP_GRACE_MS,
  }: StartupSessionTrackerOptions) {
    this.closeGraceMs = closeGraceMs
    this.clock = clock
    this.onShutdown = onShutdown
    this.sessionId = sessionId
    this.staleAfterMs = staleAfterMs
    this.startedAt = clock.now()
    this.startupGraceMs = startupGraceMs

    this.scheduleAt(this.startedAt + this.startupGraceMs)
  }

  close(sessionId: string, pageId: string) {
    if (!this.isMatchingSession(sessionId, pageId)) {
      return false
    }

    const now = this.clock.now()
    this.hasSeenClient = true
    this.pruneStalePages(now)
    this.pageLastSeen.delete(pageId)

    if (this.pageLastSeen.size === 0) {
      this.scheduleAt(now + this.closeGraceMs)
    } else {
      this.scheduleNextStaleCheck()
    }

    return true
  }

  dispose() {
    this.clearScheduledCheck()
  }

  heartbeat(sessionId: string, pageId: string) {
    if (!this.isMatchingSession(sessionId, pageId)) {
      return false
    }

    this.hasSeenClient = true
    this.pageLastSeen.set(pageId, this.clock.now())
    this.scheduleNextStaleCheck()
    return true
  }

  private clearScheduledCheck() {
    if (this.timer === null) {
      return
    }

    this.clock.clearTimeout(this.timer)
    this.timer = null
    this.timerDueAt = null
  }

  private evaluate() {
    if (this.shutdownRequested) {
      return
    }

    const now = this.clock.now()
    this.timer = null
    this.timerDueAt = null
    this.pruneStalePages(now)

    if (this.pageLastSeen.size === 0) {
      if (!this.hasSeenClient && now < this.startedAt + this.startupGraceMs) {
        this.scheduleAt(this.startedAt + this.startupGraceMs)
        return
      }

      this.requestShutdown()
      return
    }

    this.scheduleNextStaleCheck()
  }

  private isMatchingSession(sessionId: string, pageId: string) {
    return sessionId === this.sessionId && pageId.length > 0
  }

  private pruneStalePages(now: number) {
    for (const [pageId, lastSeenAt] of this.pageLastSeen) {
      if (now - lastSeenAt >= this.staleAfterMs) {
        this.pageLastSeen.delete(pageId)
      }
    }
  }

  private requestShutdown() {
    if (this.shutdownRequested) {
      return
    }

    this.shutdownRequested = true
    this.clearScheduledCheck()
    this.onShutdown()
  }

  private scheduleAt(dueAt: number) {
    if (this.shutdownRequested) {
      return
    }

    if (dueAt <= this.clock.now()) {
      this.evaluate()
      return
    }

    if (this.timerDueAt === dueAt) {
      return
    }

    this.clearScheduledCheck()
    this.timerDueAt = dueAt
    this.timer = this.clock.setTimeout(() => {
      this.evaluate()
    }, Math.max(dueAt - this.clock.now(), 0))
  }

  private scheduleNextStaleCheck() {
    if (this.shutdownRequested) {
      return
    }

    const now = this.clock.now()
    this.pruneStalePages(now)

    if (this.pageLastSeen.size === 0) {
      if (!this.hasSeenClient) {
        this.scheduleAt(this.startedAt + this.startupGraceMs)
      } else {
        this.clearScheduledCheck()
      }

      return
    }

    let nextExpiryAt = Number.POSITIVE_INFINITY

    for (const lastSeenAt of this.pageLastSeen.values()) {
      nextExpiryAt = Math.min(nextExpiryAt, lastSeenAt + this.staleAfterMs)
    }

    this.scheduleAt(nextExpiryAt)
  }
}
