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

const POLL_INTERVAL = 30_000

export function useOracle() {
  const oracles = useState<OracleStatus[]>('oracle-status', () => [])
  const loading = ref(false)
  const pollId = ref<ReturnType<typeof setInterval> | null>(null)

  async function fetchOracles() {
    loading.value = true
    try {
      oracles.value = await $fetch<OracleStatus[]>('/api/oracle/status')
    } catch {
      // keep previous data on error
    }
    loading.value = false
  }

  function startPolling() {
    stopPolling()
    pollId.value = setInterval(() => fetchOracles(), POLL_INTERVAL)
  }

  function stopPolling() {
    if (pollId.value) {
      clearInterval(pollId.value)
      pollId.value = null
    }
  }

  return {
    oracles,
    loading: readonly(loading),
    fetchOracles,
    startPolling,
    stopPolling,
  }
}
