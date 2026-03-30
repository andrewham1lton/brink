import { defineConfig } from 'vite'

import {
  STARTUP_SESSION_CLOSE_PATH,
  STARTUP_SESSION_HEARTBEAT_PATH,
  StartupSessionTracker,
} from './src/startupSessionTracker'

const startupSessionPlugin = () => {
  const sessionId = process.env.VITE_STARTUP_SESSION_ID

  if (!sessionId) {
    return {
      name: 'startup-session-plugin',
    }
  }

  let hasShutdown = false
  let tracker: StartupSessionTracker | null = null

  return {
    configureServer(server: {
      close: () => Promise<void>
      middlewares: {
        use: (handler: (req: { method?: string; url?: string }, res: { end: () => void; statusCode: number }, next: () => void) => void) => void
      }
    }) {
      const shutdownServer = async () => {
        if (hasShutdown) {
          return
        }

        hasShutdown = true
        await server.close()
        process.exit(0)
      }

      tracker = new StartupSessionTracker({
        onShutdown: () => {
          void shutdownServer()
        },
        sessionId,
      })

      server.middlewares.use((req, res, next) => {
        const requestUrl = req.url

        if (!requestUrl || req.method !== 'POST') {
          next()
          return
        }

        const url = new URL(requestUrl, 'http://127.0.0.1')

        if (
          url.pathname !== STARTUP_SESSION_HEARTBEAT_PATH &&
          url.pathname !== STARTUP_SESSION_CLOSE_PATH
        ) {
          next()
          return
        }

        const requestSessionId = url.searchParams.get('sessionId') ?? ''
        const pageId = url.searchParams.get('pageId') ?? ''

        if (url.pathname === STARTUP_SESSION_HEARTBEAT_PATH) {
          tracker?.heartbeat(requestSessionId, pageId)
        } else {
          tracker?.close(requestSessionId, pageId)
        }

        res.statusCode = 204
        res.end()
      })
    },
    name: 'startup-session-plugin',
  }
}

export default defineConfig({
  plugins: [startupSessionPlugin()],
})
