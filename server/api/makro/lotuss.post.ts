export default defineEventHandler(async (event) => {
  const body = await readBody<{ q: string; limit?: number }>(event)

  if (!body.q?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Search query is required' })
  }

  const limit = body.limit || 20
  const url = `https://api-o2o.lotuss.com/lotuss-mobile-bff/product/v5/search?sort=relevance:DESC&limit=${limit}&page=1&seller_id=3`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword: body.q.trim() }),
  })

  if (!response.ok) {
    throw createError({ statusCode: response.status, statusMessage: 'Lotus API error' })
  }

  const data = await response.json()
  return data
})
