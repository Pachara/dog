import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import { join } from 'node:path'

const dbPath = join(process.cwd(), 'data', 'dog.db')
const sqlite = new Database(dbPath)

// Enable WAL mode for better concurrent read/write performance
sqlite.pragma('journal_mode = WAL')

export const db = drizzle(sqlite, { schema })
export { schema }
