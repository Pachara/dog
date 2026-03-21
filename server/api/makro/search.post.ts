export default defineEventHandler(async (event) => {
  const body = await readBody<{ q: string; limit?: number }>(event)

  if (!body.q?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Search query is required' })
  }

  const response = await fetch(
    'https://search.maknet.siammakro.cloud/search/api/v1/indexes/products/search',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://www.makro.pro',
      },
      body: JSON.stringify({
        q: body.q.trim(),
        limit: body.limit || 20,
      }),
    },
  )

  if (!response.ok) {
    throw createError({ statusCode: response.status, statusMessage: 'Makro API error' })
  }

  const data = await response.json()
  return data
})
