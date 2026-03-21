import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ url: string; id?: string }>(event)

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

  let result: {
    url: string
    status: 'up' | 'down'
    statusCode: number | null
    responseTime: number
    checkedAt: string
    error?: string
  }

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

    result = {
      url: targetUrl,
      status: response.ok ? 'up' : 'down',
      statusCode: response.status,
      responseTime: Date.now() - start,
      checkedAt: new Date().toISOString(),
    }
  } catch (error: any) {
    result = {
      url: targetUrl,
      status: 'down',
      statusCode: null,
      responseTime: Date.now() - start,
      checkedAt: new Date().toISOString(),
      error: error.name === 'AbortError' ? 'Timeout (10s)' : error.message,
    }
  }

  // Save result to DB if an entry ID was provided
  if (body.id) {
    try {
      await db.update(urlsTable)
        .set({
          normalizedUrl: result.url,
          status: result.status,
          statusCode: result.statusCode,
          responseTime: result.responseTime,
          checkedAt: result.checkedAt,
          error: result.error ?? null,
        })
        .where(eq(urlsTable.id, body.id))
    } catch {
      // DB write failed — still return result to client
    }
  }

  return result
})
