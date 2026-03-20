import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

type OracleActivity = 'online' | 'idle' | 'offline'

interface OracleStatus {
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

// Patterns that indicate Claude is actively working
const ACTIVE_PATTERNS = [
  /Churned/i,
  /Baked/i,
  /Brewed/i,
  /Cooked/i,
  /Worked/i,
  /Crunched/i,
  /Proofing/i,
  /Drafting/i,
  /Composing/i,
  /Thinking/i,
  /Running/i,
  /Streaming/i,
  /⠋|⠙|⠹|⠸|⠼|⠴|⠦|⠧|⠇|⠏/,    // spinner characters
  /●|◐|◓|◑|◒/,                       // dot spinners
  /\.\.\./,                            // ellipsis progress
  /█|▓|░/,                            // progress bar characters
]

// Patterns that indicate an idle prompt
const IDLE_PATTERNS = [
  /^❯\s*$/m,                          // empty prompt
  /^\$\s*$/m,                          // bash empty prompt
  /^>\s*$/m,                           // generic empty prompt
  /waiting for input/i,
  /^claude\s*$/m,                      // just "claude" with no activity
]

function detectTmuxActivity(sessionName: string): OracleActivity {
  try {
    const output = execSync(
      `tmux capture-pane -t "${sessionName}" -p 2>/dev/null`,
      { encoding: 'utf-8', timeout: 5000, stdio: ['pipe', 'pipe', 'pipe'] },
    )

    // Get last 15 non-empty lines for analysis
    const lines = output.split('\n').filter(l => l.trim()).slice(-15)
    const recentText = lines.join('\n')

    if (!recentText.trim()) return 'idle'

    // Check for active work patterns first
    for (const pattern of ACTIVE_PATTERNS) {
      if (pattern.test(recentText)) return 'online'
    }

    // Check if the last few lines are just an idle prompt
    const lastLines = lines.slice(-3).join('\n')
    for (const pattern of IDLE_PATTERNS) {
      if (pattern.test(lastLines)) return 'idle'
    }

    // If there's recent text but no clear signal, lean toward idle
    return 'idle'
  } catch {
    return 'offline'
  }
}

// Detect activity for Oracles that run directly in a terminal (no tmux)
// Checks: 1) Claude process with matching cwd, 2) recent git commits
function detectProcessActivity(oracleDir: string, fullPath: string): OracleActivity {
  // Check if a Claude process is running in this Oracle's directory
  try {
    const psOutput = execSync(
      `ps aux 2>/dev/null | grep -i claude | grep "${oracleDir}" | grep -v grep`,
      { encoding: 'utf-8', timeout: 5000, stdio: ['pipe', 'pipe', 'pipe'] },
    ).trim()
    if (psOutput) return 'online'
  } catch {
    // No matching process — not an error
  }

  // Fallback: check if there were git commits in the last 10 minutes
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
    const output = execSync('tmux list-sessions -F "#{session_name}" 2>/dev/null', {
      encoding: 'utf-8',
      timeout: 5000,
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    tmuxSessions = output.trim().split('\n').map(s => s.trim()).filter(Boolean)
  } catch {
    try {
      const output = execSync('tmux list-sessions 2>/dev/null', {
        encoding: 'utf-8',
        timeout: 5000,
        stdio: ['pipe', 'pipe', 'pipe'],
      })
      tmuxSessions = output.trim().split('\n')
        .map(line => line.split(':')[0]?.trim())
        .filter(Boolean)
    } catch {
      // tmux not running
    }
  }

  for (const dir of oracleDirs) {
    const fullPath = join(PROJECTS_DIR, dir)

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
      // No CLAUDE.md
    }

    // Count inbox messages
    let inboxCount = 0
    try {
      const inboxPath = join(fullPath, 'ψ', 'inbox')
      const inboxFiles = await readdir(inboxPath)
      inboxCount = inboxFiles.filter(f => f.endsWith('.md')).length
    } catch {}

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
    } catch {}

    // Detect activity status
    // 1) Check tmux session (e.g. tony-oracle)
    // 2) If no tmux session, check for Claude process or recent commits (e.g. my-oracle)
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
})
