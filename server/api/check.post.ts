export default defineEventHandler(async (event) => {
  const body = await readBody<{ url: string }>(event)

  if (!body.url) {
    throw createError({ statusCode: 400, statusMessage: 'URL is required' })
  }

  let targetUrl = body.url
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl
  }

  try {
    new URL(targetUrl)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid URL' })
  }

  const start = Date.now()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(targetUrl, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    }).catch(() => {
      return fetch(targetUrl, {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
      })
    })

    clearTimeout(timeoutId)

    return {
      url: targetUrl,
      status: response.ok ? 'up' : 'down',
      statusCode: response.status,
      responseTime: Date.now() - start,
      checkedAt: new Date().toISOString(),
    }
  } catch (error: any) {
    return {
      url: targetUrl,
      status: 'down' as const,
      statusCode: null,
      responseTime: Date.now() - start,
      checkedAt: new Date().toISOString(),
      error: error.name === 'AbortError' ? 'Timeout (10s)' : error.message,
    }
  }
})
