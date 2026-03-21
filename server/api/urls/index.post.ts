import * as v from 'valibot'

const AddUrlSchema = v.object({
  url: v.pipe(v.string(), v.minLength(1)),
})

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const result = v.safeParse(AddUrlSchema, raw)
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: 'URL is required' })
  }

  const id = crypto.randomUUID()
  const url = result.output.url.trim()

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
