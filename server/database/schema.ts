import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'

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

export const checkHistory = sqliteTable('check_history', {
  id: text('id').primaryKey(),
  urlId: text('url_id').notNull(),
  status: text('status', { enum: ['up', 'down'] }).notNull(),
  statusCode: integer('status_code'),
  responseTime: integer('response_time'),
  checkedAt: text('checked_at').notNull().$defaultFn(() => new Date().toISOString()),
}, (table) => [
  index('idx_url_checked_at').on(table.urlId, table.checkedAt),
  index('idx_url_status_time').on(table.urlId, table.status, table.checkedAt),
  index('idx_checked_at').on(table.checkedAt),
])
