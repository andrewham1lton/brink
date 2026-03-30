import {
  STARTUP_SESSION_CLOSE_PATH,
  STARTUP_SESSION_HEARTBEAT_INTERVAL_MS,
  STARTUP_SESSION_HEARTBEAT_PATH,
} from './startupSessionTracker'

const startupSessionId = import.meta.env.VITE_STARTUP_SESSION_ID

const postLifecycleEvent = (
  path: string,
  pageId: string,
  options: {
    beacon?: boolean
    keepalive?: boolean
  } = {},
) => {
  if (!startupSessionId) {
    return
  }

  const url = new URL(path, window.location.origin)
  url.searchParams.set('pageId', pageId)
  url.searchParams.set('sessionId', startupSessionId)

  if (options.beacon && typeof navigator.sendBeacon === 'function') {
    if (navigator.sendBeacon(url)) {
      return
    }
  }

  void fetch(url, {
    cache: 'no-store',
    keepalive: options.keepalive,
    method: 'POST',
  }).catch(() => {
    // The lifecycle endpoint is best-effort and should not affect the app.
  })
}

export const startStartupSession = () => {
  if (!startupSessionId) {
    return
  }

  const pageId = crypto.randomUUID()
  let closed = false

  const sendHeartbeat = () => {
    if (closed) {
      return
    }

    postLifecycleEvent(STARTUP_SESSION_HEARTBEAT_PATH, pageId)
  }

  const closeSession = () => {
    if (closed) {
      return
    }

    closed = true
    window.clearInterval(heartbeatTimer)
    postLifecycleEvent(STARTUP_SESSION_CLOSE_PATH, pageId, {
      beacon: true,
      keepalive: true,
    })
  }

  sendHeartbeat()

  const heartbeatTimer = window.setInterval(
    sendHeartbeat,
    STARTUP_SESSION_HEARTBEAT_INTERVAL_MS,
  )

  window.addEventListener('beforeunload', closeSession, { once: true })
  window.addEventListener('pagehide', closeSession, { once: true })
}
