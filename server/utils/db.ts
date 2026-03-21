import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { monitoredUrls } from '../database/schema'
import { join } from 'node:path'

const dbPath = join(process.cwd(), 'data', 'dog.db')
const sqlite = new Database(dbPath)
sqlite.pragma('journal_mode = WAL')

export const db = drizzle(sqlite)
export const urlsTable = monitoredUrls
