export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')

  const body = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      let closed = false

      function send(data: string) {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        } catch {
          closed = true
        }
      }

      async function tick() {
        if (closed) return
        try {
          const oracles = await scanOracles()
          send(JSON.stringify(oracles))
        } catch {
          send('[]')
        }
      }

      // Send immediately on connect, then every 3 seconds
      tick()
      const intervalId = setInterval(tick, 3000)

      // Cleanup when client disconnects
      event.node.req.on('close', () => {
        closed = true
        clearInterval(intervalId)
        try { controller.close() } catch {}
      })
    },
  })

  return body
})
