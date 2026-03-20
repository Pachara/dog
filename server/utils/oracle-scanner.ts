import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

export type OracleActivity = 'online' | 'idle' | 'offline'

export interface OracleStatus {
  id: string
  name: string
  role: string
  path: string
  status: OracleActivity
  inboxCount: number
  lastCommitMessage: string | null
  lastCommitTime: string | null
}

const PROJECTS_DIR = '/Users/pachara/Projects'

// Patterns that indicate Claude is CURRENTLY working (checked against last 5 lines only).
// These must be things that only appear while Claude is actively generating,
// NOT in historical output that scrolled up.
const ACTIVE_PATTERNS = [
  // Claude Code completion verbs (appear in status line while working)
  /Churned for/i,
  /Baked for/i,
  /Brewed for/i,
  /Cooked for/i,
  /Worked for/i,
  /Crunched for/i,
  /Cogitated for/i,
  /Proofing/i,
  /Combobulating/i,
  // Claude Code active status bar (only visible while Claude is running)
  /esc to interrupt/,
  /shift\+tab to cycle/,
  // Active generation indicators
  /⏺/,                                // Claude output marker during streaming
  /Running…|Running\.\.\./,
  /Thinking…|Thinking\.\.\./,
  // Spinner characters (braille spinners used by Claude Code)
  /[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]/,
]

function detectTmuxActivity(sessionName: string): OracleActivity {
  try {
    const output = execSync(
      `tmux capture-pane -t "${sessionName}" -p 2>/dev/null`,
      { encoding: 'utf-8', timeout: 5000, stdio: ['pipe', 'pipe', 'pipe'] },
    )

    // Only check the LAST 5 non-empty lines — this is what's currently visible,
    // not historical scrollback. Default is IDLE unless proven active.
    const lines = output.split('\n').filter(l => l.trim()).slice(-5)
    const recentText = lines.join('\n')

    if (!recentText.trim()) return 'idle'

    // Check for active patterns in the last 5 lines
    for (const pattern of ACTIVE_PATTERNS) {
      if (pattern.test(recentText)) return 'online'
    }

    // No active indicators found — idle (even if there's text, it's old output)
    return 'idle'
  } catch {
    return 'offline'
  }
}

function detectProcessActivity(oracleDir: string, fullPath: string): OracleActivity {
  try {
    const psOutput = execSync(
      `ps aux 2>/dev/null | grep -i claude | grep "${oracleDir}" | grep -v grep`,
      { encoding: 'utf-8', timeout: 5000, stdio: ['pipe', 'pipe', 'pipe'] },
    ).trim()
    if (psOutput) return 'online'
  } catch {}
  try {
    const logOutput = execSync(
      'git log -1 --format="%aI"',
      { cwd: fullPath, encoding: 'utf-8', timeout: 5000 },
    ).trim()
    if (logOutput) {
      const commitTime = new Date(logOutput).getTime()
      const tenMinutesAgo = Date.now() - 10 * 60 * 1000
      if (commitTime > tenMinutesAgo) return 'online'
    }
  } catch {}
  return 'idle'
}

function getTmuxSessions(): string[] {
  try {
    const output = execSync('tmux list-sessions -F "#{session_name}" 2>/dev/null', {
      encoding: 'utf-8',
      timeout: 5000,
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    return output.trim().split('\n').map(s => s.trim()).filter(Boolean)
  } catch {
    try {
      const output = execSync('tmux list-sessions 2>/dev/null', {
        encoding: 'utf-8',
        timeout: 5000,
        stdio: ['pipe', 'pipe', 'pipe'],
      })
      return output.trim().split('\n')
        .map(line => line.split(':')[0]?.trim())
        .filter(Boolean)
    } catch {
      return []
    }
  }
}

export async function scanOracles(): Promise<OracleStatus[]> {
  const oracles: OracleStatus[] = []

  let dirs: string[]
  try {
    dirs = await readdir(PROJECTS_DIR)
  } catch {
    return []
  }

  const oracleDirs = dirs.filter(d => d.endsWith('-oracle'))
  const tmuxSessions = getTmuxSessions()

  for (const dir of oracleDirs) {
    const fullPath = join(PROJECTS_DIR, dir)

    try {
      const s = await stat(fullPath)
      if (!s.isDirectory()) continue
    } catch {
      continue
    }

    let name = dir
    let role = ''
    try {
      const claude = await readFile(join(fullPath, 'CLAUDE.md'), 'utf-8')
      const nameMatch = claude.match(/\*?\*?I am\*?\*?:?\s*(.+?)(?:\n|$)/)
        || claude.match(/^#\s+(.+?)(?:\n|$)/m)
      if (nameMatch) {
        name = nameMatch[1].replace(/\*\*/g, '').split('—')[0].trim()
      }
      const purposeMatch = claude.match(/\*?\*?Purpose\*?\*?:?\s*(.+?)(?:\n|$)/)
      if (purposeMatch) {
        role = purposeMatch[1].replace(/\*\*/g, '').trim()
      }
    } catch {}

    let inboxCount = 0
    try {
      const inboxPath = join(fullPath, 'ψ', 'inbox')
      const inboxFiles = await readdir(inboxPath)
      inboxCount = inboxFiles.filter(f => f.endsWith('.md')).length
    } catch {}

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
    } catch {}

    let status: OracleActivity
    if (tmuxSessions.includes(dir)) {
      status = detectTmuxActivity(dir)
    } else {
      status = detectProcessActivity(dir, fullPath)
    }

    oracles.push({
      id: dir,
      name,
      role,
      path: fullPath,
      status,
      inboxCount,
      lastCommitMessage,
      lastCommitTime,
    })
  }

  return oracles
}
