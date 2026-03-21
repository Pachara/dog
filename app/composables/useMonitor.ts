export interface MonitorEntry {
  id: string
  url: string
  normalizedUrl: string
  status: 'pending' | 'up' | 'down'
  statusCode: number | null
  responseTime: number | null
  checkedAt: string | null
  error: string | null
}

const STORAGE_KEY = 'dog-monitor-entries'
const POLL_INTERVAL = 30_000

export function useMonitor() {
  const entries = useState<MonitorEntry[]>('monitor-entries', () => [])
  const isChecking = ref(false)
  const pollIntervalId = ref<ReturnType<typeof setInterval> | null>(null)

  // Cache to localStorage as offline fallback
  function saveToStorage() {
    if (import.meta.server) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value))
  }

  function loadFromStorage() {
    if (import.meta.server) return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        entries.value = JSON.parse(raw)
      } catch {
        entries.value = []
      }
    }
  }

  // Fetch entries from server DB
  async function fetchEntries() {
    try {
      const data = await $fetch<MonitorEntry[]>('/api/urls')
      entries.value = data
      saveToStorage()
    } catch {
      // Server unavailable — fall back to localStorage
      loadFromStorage()
    }
  }

  async function addUrl(url: string) {
    try {
      // Add to server DB
      const entry = await $fetch<MonitorEntry>('/api/urls', {
        method: 'POST',
        body: { url },
      })
      entries.value.push(entry)
      saveToStorage()
      // Immediately check the new URL
      await checkUrl(entry)
    } catch {
      // Fallback: add client-side only
      const entry: MonitorEntry = {
        id: crypto.randomUUID(),
        url: url.trim(),
        normalizedUrl: '',
        status: 'pending',
        statusCode: null,
        responseTime: null,
        checkedAt: null,
        error: null,
      }
      entries.value.push(entry)
      saveToStorage()
      await checkUrl(entry)
    }
  }

  async function removeUrl(id: string) {
    entries.value = entries.value.filter(e => e.id !== id)
    saveToStorage()
    try {
      await $fetch(`/api/urls/${id}`, { method: 'DELETE' })
    } catch {
      // DB delete failed — entry already removed from UI
    }
  }

  async function checkUrl(entry: MonitorEntry) {
    try {
      const result = await $fetch('/api/check', {
        method: 'POST',
        body: { url: entry.url, id: entry.id },
      })
      entry.normalizedUrl = result.url
      entry.status = result.status as 'up' | 'down'
      entry.statusCode = result.statusCode
      entry.responseTime = result.responseTime
      entry.checkedAt = result.checkedAt
      entry.error = (result as any).error ?? null
    } catch {
      entry.status = 'down'
      entry.checkedAt = new Date().toISOString()
      entry.error = 'Failed to reach check API'
    }
    saveToStorage()
  }

  async function checkAll() {
    if (isChecking.value || entries.value.length === 0) return
    isChecking.value = true
    // Concurrent limiter: max 10 parallel checks (prevents overload with many URLs)
    const tasks = entries.value.map(e => () => checkUrl(e))
    const limit = 10
    let idx = 0
    async function worker() {
      while (idx < tasks.length) {
        const i = idx++
        await tasks[i]()
      }
    }
    await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, () => worker()))
    isChecking.value = false
  }

  function startPolling() {
    stopPolling()
    pollIntervalId.value = setInterval(() => checkAll(), POLL_INTERVAL)
  }

  function stopPolling() {
    if (pollIntervalId.value) {
      clearInterval(pollIntervalId.value)
      pollIntervalId.value = null
    }
  }

  return {
    entries,
    isChecking: readonly(isChecking),
    fetchEntries,
    loadFromStorage,
    addUrl,
    removeUrl,
    checkAll,
    startPolling,
    stopPolling,
  }
}
