// In-memory sliding window rate limiter
// Zero dependencies — per-IP, auto-prunes expired entries

interface RateWindow {
  timestamps: number[]
}

const store = new Map<string, RateWindow>()
let lastPrune = Date.now()
const PRUNE_INTERVAL = 5 * 60 * 1000 // 5 minutes

function pruneExpired(windowMs: number) {
  const now = Date.now()
  if (now - lastPrune < PRUNE_INTERVAL) return
  lastPrune = now
  const cutoff = now - windowMs
  for (const [key, window] of store) {
    window.timestamps = window.timestamps.filter(t => t > cutoff)
    if (window.timestamps.length === 0) store.delete(key)
  }
}

export function checkRateLimit(
  ip: string,
  maxRequests: number = 10,
  windowMs: number = 60_000,
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now()
  const cutoff = now - windowMs

  pruneExpired(windowMs)

  let window = store.get(ip)
  if (!window) {
    window = { timestamps: [] }
    store.set(ip, window)
  }

  // Remove expired timestamps
  window.timestamps = window.timestamps.filter(t => t > cutoff)

  if (window.timestamps.length >= maxRequests) {
    const oldestValid = window.timestamps[0]
    return {
      allowed: false,
      remaining: 0,
      resetMs: oldestValid + windowMs - now,
    }
  }

  window.timestamps.push(now)
  return {
    allowed: true,
    remaining: maxRequests - window.timestamps.length,
    resetMs: windowMs,
  }
}
