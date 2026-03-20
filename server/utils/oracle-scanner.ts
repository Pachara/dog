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

function detectTmuxActivity(sessionName: string): OracleActivity {
  // Strategy: find the Claude CLI process running in this tmux session's pane
  // and check its CPU usage. This is far more reliable than parsing terminal
  // output, which contains TUI chrome, scrollback history, and unicode noise.
  //
  // CPU > 1% = actively working (generating, tool calls, streaming)
  // CPU ~ 0% = idle at prompt (waiting for user input)
  try {
    // Get the PID of the shell in the tmux pane
    const panePid = execSync(
      `tmux list-panes -t "${sessionName}" -F "#{pane_pid}" 2>/dev/null`,
      { encoding: 'utf-8', timeout: 3000, stdio: ['pipe', 'pipe', 'pipe'] },
    ).trim().split('\n')[0]

    if (!panePid) return 'idle'

    // Find CLI claude processes (exclude Claude.app Desktop processes).
    // Match only lines where comm ends with exactly "claude" (the CLI binary).
    const psOutput = execSync(
      `ps -eo pid,ppid,pcpu,comm 2>/dev/null`,
      { encoding: 'utf-8', timeout: 3000, stdio: ['pipe', 'pipe', 'pipe'] },
    ).trim()

    // Look for claude CLI process whose parent is the tmux pane shell
    // The process tree is: tmux → shell (panePid) → claude (child)
    for (const line of psOutput.split('\n')) {
      const parts = line.trim().split(/\s+/)
      if (parts.length < 4) continue
      const pid = parts[0]
      const ppid = parts[1]
      const cpu = parseFloat(parts[2])
      const comm = parts.slice(3).join(' ')
      // Match only the CLI claude binary, not Claude.app
      if (comm !== 'claude') continue
      // Check if this claude process is a child of the tmux pane shell
      if (ppid === panePid) {
        return cpu > 1 ? 'online' : 'idle'
      }
    }

    // No claude CLI process found as direct child of tmux pane.
    // Check if any claude CLI process has the session name in its args
    // (handles cases where there's an intermediate shell).
    try {
      const fullPs = execSync(
        `ps aux 2>/dev/null`,
        { encoding: 'utf-8', timeout: 3000, stdio: ['pipe', 'pipe', 'pipe'] },
      ).trim()

      for (const line of fullPs.split('\n')) {
        // Match lines with the claude CLI (not Claude.app) AND the session/dir name
        if (!line.includes(sessionName)) continue
        if (line.includes('Claude.app')) continue
        const parts = line.trim().split(/\s+/)
        if (parts.length < 3) continue
        const cpu = parseFloat(parts[2])
        const cmd = parts.slice(10).join(' ')
        if (!/\bclaude\b/.test(cmd)) continue
        return cpu > 1 ? 'online' : 'idle'
      }
    } catch {}

    // Tmux session exists but no claude process — idle
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
