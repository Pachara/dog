import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const monitoredUrls = sqliteTable('monitored_urls', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  normalizedUrl: text('normalized_url'),
  status: text('status', { enum: ['pending', 'up', 'down'] }).default('pending'),
  statusCode: integer('status_code'),
  responseTime: integer('response_time'),
  checkedAt: text('checked_at'),
  error: text('error'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
})
