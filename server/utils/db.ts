import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq, sql, and, lt } from 'drizzle-orm'
import { monitoredUrls, checkHistory } from '../database/schema'
import { join } from 'node:path'

const dbPath = join(process.cwd(), 'data', 'dog.db')
const sqlite = new Database(dbPath)

// --- SQLite Pragma Tuning (Richard's Research Drop #2) ---
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('synchronous = NORMAL')       // safe with WAL, 2-3x faster
sqlite.pragma('cache_size = -64000')         // 64MB page cache
sqlite.pragma('mmap_size = 536870912')       // 512MB memory-mapped IO
sqlite.pragma('busy_timeout = 5000')         // 5s wait on lock contention
sqlite.pragma('temp_store = MEMORY')         // temp tables in RAM

export const db = drizzle(sqlite)
export const urlsTable = monitoredUrls
export const historyTable = checkHistory

// --- Prepared Statements (reused every check cycle) ---
export const insertHistory = db.insert(historyTable).values({
  id: sql.placeholder('id'),
  urlId: sql.placeholder('urlId'),
  status: sql.placeholder('status'),
  statusCode: sql.placeholder('statusCode'),
  responseTime: sql.placeholder('responseTime'),
  checkedAt: sql.placeholder('checkedAt'),
}).prepare()

export const getUptime = db
  .select({
    total: sql<number>`count(*)`,
    up: sql<number>`sum(case when ${historyTable.status} = 'up' then 1 else 0 end)`,
  })
  .from(historyTable)
  .where(eq(historyTable.urlId, sql.placeholder('urlId')))
  .prepare()

// Cleanup: prune history older than 30 days
export function pruneOldHistory() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  db.delete(historyTable).where(lt(historyTable.checkedAt, thirtyDaysAgo)).run()
  sqlite.pragma('incremental_vacuum')
}
