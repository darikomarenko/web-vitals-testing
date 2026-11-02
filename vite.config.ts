import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isDocumentRequest(req: IncomingMessage) {
  const url = req.url ?? '/'
  const path = url.split('?')[0]
  const accept = req.headers.accept ?? ''
  return (
    path === '/' ||
    path === '/index.html' ||
    (accept.includes('text/html') &&
      !path.startsWith('/src') &&
      !path.startsWith('/@') &&
      !path.startsWith('/node_modules') &&
      !path.startsWith('/api'))
  )
}

function ttfbLabPlugin(): Plugin {
  return {
    name: 'ttfb-lab',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost')

        if (url.pathname === '/api/slow') {
          const ms = Math.min(Math.max(Number(url.searchParams.get('ms') ?? 800), 0), 8000)
          await sleep(ms)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ delayedMs: ms, servedAt: Date.now() }))
          return
        }

        const delay = Number(url.searchParams.get('ttfb') ?? 0)
        if (delay > 0 && isDocumentRequest(req)) {
          await sleep(Math.min(delay, 8000))
        }

        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [ttfbLabPlugin(), react()],
})
