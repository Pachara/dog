import { eq } from 'drizzle-orm'
import * as v from 'valibot'

const CheckSchema = v.object({
  url: v.pipe(v.string(), v.minLength(1)),
  id: v.optional(v.string()),
})

export default defineEventHandler(async (event) => {
  // Rate limiting: 10 requests per minute per IP
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const rateCheck = checkRateLimit(ip, 10, 60_000)
  if (!rateCheck.allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: `Too many requests. Try again in ${Math.ceil(rateCheck.resetMs / 1000)}s`,
    })
  }

  const raw = await readBody(event)
  const parsed = v.safeParse(CheckSchema, raw)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'URL is required' })
  }
  const body = parsed.output

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

  let checkResult: {
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

    checkResult = {
      url: targetUrl,
      status: response.ok ? 'up' : 'down',
      statusCode: response.status,
      responseTime: Date.now() - start,
      checkedAt: new Date().toISOString(),
    }
  } catch (error: any) {
    checkResult = {
      url: targetUrl,
      status: 'down',
      statusCode: null,
      responseTime: Date.now() - start,
      checkedAt: new Date().toISOString(),
      error: error.name === 'AbortError' ? 'Timeout (10s)' : error.message,
    }
  }

  // Save to DB + history if entry ID provided
  if (body.id) {
    try {
      await db.update(urlsTable)
        .set({
          normalizedUrl: checkResult.url,
          status: checkResult.status,
          statusCode: checkResult.statusCode,
          responseTime: checkResult.responseTime,
          checkedAt: checkResult.checkedAt,
          error: checkResult.error ?? null,
        })
        .where(eq(urlsTable.id, body.id))

      // Record in check history
      insertHistory.run({
        id: crypto.randomUUID(),
        urlId: body.id,
        status: checkResult.status,
        statusCode: checkResult.statusCode,
        responseTime: checkResult.responseTime,
        checkedAt: checkResult.checkedAt,
      })
    } catch {
      // DB write failed — still return result
    }
  }

  return checkResult
})
