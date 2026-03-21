export default defineEventHandler(async (event) => {
  const body = await readBody<{ url: string }>(event)

  if (!body.url?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'URL is required' })
  }

  const id = crypto.randomUUID()
  const url = body.url.trim()

  await db.insert(urlsTable).values({
    id,
    url,
    status: 'pending',
  })

  return {
    id,
    url,
    normalizedUrl: '',
    status: 'pending' as const,
    statusCode: null,
    responseTime: null,
    checkedAt: null,
    error: null,
  }
})
