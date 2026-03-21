export default defineEventHandler(async () => {
  const urls = await db.select().from(urlsTable)
  return urls.map(row => ({
    id: row.id,
    url: row.url,
    normalizedUrl: row.normalizedUrl ?? '',
    status: row.status ?? 'pending',
    statusCode: row.statusCode ?? null,
    responseTime: row.responseTime ?? null,
    checkedAt: row.checkedAt ?? null,
    error: row.error ?? null,
  }))
})
