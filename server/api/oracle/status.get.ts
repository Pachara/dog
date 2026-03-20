import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

interface OracleStatus {
  id: string
  name: string
  role: string
  path: string
  online: boolean
  inboxCount: number
  lastCommitMessage: string | null
  lastCommitTime: string | null
}

const PROJECTS_DIR = '/Users/pachara/Projects'

export default defineEventHandler(async (): Promise<OracleStatus[]> => {
  const oracles: OracleStatus[] = []

  let dirs: string[]
  try {
    dirs = await readdir(PROJECTS_DIR)
  } catch {
    return []
  }

  const oracleDirs = dirs.filter(d => d.endsWith('-oracle'))

  // Get tmux sessions once
  let tmuxSessions: string[] = []
  try {
    const output = execSync('tmux list-sessions -F "#{session_name}"', {
      encoding: 'utf-8',
      timeout: 5000,
    })
    tmuxSessions = output.trim().split('\n').filter(Boolean)
  } catch {
    // tmux not running or no sessions
  }

  for (const dir of oracleDirs) {
    const fullPath = join(PROJECTS_DIR, dir)

    // Check it's a directory
    try {
      const s = await stat(fullPath)
      if (!s.isDirectory()) continue
    } catch {
      continue
    }

    // Parse CLAUDE.md for name and role
    let name = dir
    let role = ''
    try {
      const claude = await readFile(join(fullPath, 'CLAUDE.md'), 'utf-8')
      // Try multiple name patterns: "**I am**: Name", "I am: **Name**", or "# Name"
      const nameMatch = claude.match(/\*?\*?I am\*?\*?:?\s*(.+?)(?:\n|$)/)
        || claude.match(/^#\s+(.+?)(?:\n|$)/m)
      if (nameMatch) {
        name = nameMatch[1].replace(/\*\*/g, '').split('—')[0].trim()
      }
      const purposeMatch = claude.match(/\*?\*?Purpose\*?\*?:?\s*(.+?)(?:\n|$)/)
      if (purposeMatch) {
        role = purposeMatch[1].replace(/\*\*/g, '').trim()
      }
    } catch {
      // No CLAUDE.md or parse error
    }

    // Count inbox messages
    let inboxCount = 0
    try {
      const inboxPath = join(fullPath, 'ψ', 'inbox')
      const inboxFiles = await readdir(inboxPath)
      inboxCount = inboxFiles.filter(f => f.endsWith('.md')).length
    } catch {
      // No inbox
    }

    // Last git commit
    let lastCommitMessage: string | null = null
    let lastCommitTime: string | null = null
    try {
      const logOutput = execSync(
        'git log -1 --format="%s|||%aI"',
        { cwd: fullPath, encoding: 'utf-8', timeout: 5000 },
      ).trim()
      if (logOutput) {
        const [msg, time] = logOutput.split('|||')
        lastCommitMessage = msg || null
        lastCommitTime = time || null
      }
    } catch {
      // Not a git repo
    }

    // Check tmux session
    const online = tmuxSessions.includes(dir)

    oracles.push({
      id: dir,
      name,
      role,
      path: fullPath,
      online,
      inboxCount,
      lastCommitMessage,
      lastCommitTime,
    })
  }

  return oracles
})
