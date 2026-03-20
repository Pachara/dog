import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

export type OracleActivity = 'overdrive' | 'online' | 'idle' | 'offline'

export interface OracleStatus {
  id: string
  name: string
  role: string
  path: string
  status: OracleActivity
  cpu: number
  inboxCount: number
  lastCommitMessage: string | null
  lastCommitTime: string | null
}

const PROJECTS_DIR = '/Users/pachara/Projects'

interface DetectionResult {
  status: OracleActivity
  cpu: number
}

function cpuToStatus(cpu: number): OracleActivity {
  if (cpu > 30) return 'overdrive'
  if (cpu > 0.5) return 'online'
  return 'idle'
}

function detectTmuxActivity(sessionName: string): DetectionResult {
  try {
    const panePid = execSync(
      `tmux list-panes -t "${sessionName}" -F "#{pane_pid}" 2>/dev/null`,
      { encoding: 'utf-8', timeout: 3000, stdio: ['pipe', 'pipe', 'pipe'] },
    ).trim().split('\n')[0]

    if (!panePid) return { status: 'idle', cpu: 0 }

    const psOutput = execSync(
      `ps -eo pid,ppid,pcpu,comm 2>/dev/null`,
      { encoding: 'utf-8', timeout: 3000, stdio: ['pipe', 'pipe', 'pipe'] },
    ).trim()

    for (const line of psOutput.split('\n')) {
      const parts = line.trim().split(/\s+/)
      if (parts.length < 4) continue
      const ppid = parts[1]
      const cpu = parseFloat(parts[2])
      const comm = parts.slice(3).join(' ')
      if (comm !== 'claude') continue
      if (ppid === panePid) {
        return { status: cpuToStatus(cpu), cpu: Math.round(cpu * 10) / 10 }
      }
    }

    // Fallback: search ps aux for claude with session name in args
    try {
      const fullPs = execSync(
        `ps aux 2>/dev/null`,
        { encoding: 'utf-8', timeout: 3000, stdio: ['pipe', 'pipe', 'pipe'] },
      ).trim()

      for (const line of fullPs.split('\n')) {
        if (!line.includes(sessionName)) continue
        if (line.includes('Claude.app')) continue
        const parts = line.trim().split(/\s+/)
        if (parts.length < 3) continue
        const cpu = parseFloat(parts[2])
        const cmd = parts.slice(10).join(' ')
        if (!/\bclaude\b/.test(cmd)) continue
        return { status: cpuToStatus(cpu), cpu: Math.round(cpu * 10) / 10 }
      }
    } catch {}

    return { status: 'idle', cpu: 0 }
  } catch {
    return { status: 'offline', cpu: 0 }
  }
}

function detectProcessActivity(oracleDir: string, fullPath: string): DetectionResult {
  try {
    const lsofOutput = execSync(
      `lsof -d cwd 2>/dev/null | grep "${oracleDir}"`,
      { encoding: 'utf-8', timeout: 5000, stdio: ['pipe', 'pipe', 'pipe'] },
    ).trim()

    if (!lsofOutput) throw new Error('no match')

    const pids = [...new Set(
      lsofOutput.split('\n')
        .map(line => line.trim().split(/\s+/)[1])
        .filter(Boolean),
    )]

    for (const pid of pids) {
      try {
        const psLine = execSync(
          `ps -p ${pid} -o pid=,pcpu=,comm= 2>/dev/null`,
          { encoding: 'utf-8', timeout: 2000, stdio: ['pipe', 'pipe', 'pipe'] },
        ).trim()
        if (!/\bclaude$/.test(psLine)) continue
        const parts = psLine.trim().split(/\s+/)
        const cpu = parseFloat(parts[1])
        return { status: cpuToStatus(cpu), cpu: Math.round(cpu * 10) / 10 }
      } catch {}
    }
  } catch {}

  // Fallback: recent git commits
  try {
    const logOutput = execSync(
      'git log -1 --format="%aI"',
      { cwd: fullPath, encoding: 'utf-8', timeout: 5000 },
    ).trim()
    if (logOutput) {
      const commitTime = new Date(logOutput).getTime()
      const tenMinutesAgo = Date.now() - 10 * 60 * 1000
      if (commitTime > tenMinutesAgo) return { status: 'online', cpu: 0 }
    }
  } catch {}

  return { status: 'idle', cpu: 0 }
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

    const detection = tmuxSessions.includes(dir)
      ? detectTmuxActivity(dir)
      : detectProcessActivity(dir, fullPath)

    oracles.push({
      id: dir,
      name,
      role,
      path: fullPath,
      status: detection.status,
      cpu: detection.cpu,
      inboxCount,
      lastCommitMessage,
      lastCommitTime,
    })
  }

  return oracles
}
