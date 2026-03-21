import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import * as v from 'valibot'

const PROJECTS_DIR = '/Users/pachara/Projects'

const VALID_MOODS = ['focused', 'curious', 'excited', 'tired', 'chill', 'creative', 'frustrated'] as const

const MoodSchema = v.object({
  oracleId: v.pipe(v.string(), v.minLength(1)),
  mood: v.optional(v.picklist(VALID_MOODS)),
  statusText: v.optional(v.pipe(v.string(), v.maxLength(100))),
  statusEmoji: v.optional(v.pipe(v.string(), v.maxLength(4))),
  expiresInMinutes: v.optional(v.number()),
})

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const parsed = v.safeParse(MoodSchema, raw)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid mood data' })
  }

  const { oracleId, mood, statusText, statusEmoji, expiresInMinutes } = parsed.output

  // Validate oracle directory exists
  const oraclePath = join(PROJECTS_DIR, oracleId)
  try {
    const s = await import('node:fs/promises').then(fs => fs.stat(oraclePath))
    if (!s.isDirectory()) throw new Error()
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Oracle not found' })
  }

  const statusData = {
    mood: mood || null,
    statusText: statusText || null,
    statusEmoji: statusEmoji || null,
    statusSetAt: new Date().toISOString(),
    statusExpiresAt: expiresInMinutes
      ? new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString()
      : null,
  }

  const activePath = join(oraclePath, 'ψ', 'active')
  await mkdir(activePath, { recursive: true })
  await writeFile(join(activePath, 'status.json'), JSON.stringify(statusData, null, 2))

  return { ok: true, ...statusData }
})
