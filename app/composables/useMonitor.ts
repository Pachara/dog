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

  function saveToStorage() {
    if (import.meta.server) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value))
  }

  async function addUrl(url: string) {
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

  function removeUrl(id: string) {
    entries.value = entries.value.filter(e => e.id !== id)
    saveToStorage()
  }

  async function checkUrl(entry: MonitorEntry) {
    try {
      const result = await $fetch('/api/check', {
        method: 'POST',
        body: { url: entry.url },
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
    await Promise.allSettled(entries.value.map(e => checkUrl(e)))
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
    loadFromStorage,
    addUrl,
    removeUrl,
    checkAll,
    startPolling,
    stopPolling,
  }
}
