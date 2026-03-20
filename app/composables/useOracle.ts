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

// --- Web Audio API sound effects ---

function getAudioContext(): AudioContext | null {
  if (import.meta.server) return null
  try {
    return new AudioContext()
  } catch {
    return null
  }
}

function playBellDing() {
  const ctx = getAudioContext()
  if (!ctx) return
  const t = ctx.currentTime

  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1200, t)
  osc.frequency.exponentialRampToValueAtTime(800, t + 0.15)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.3, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(t)
  osc.stop(t + 0.5)

  const osc2 = ctx.createOscillator()
  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(2400, t)
  osc2.frequency.exponentialRampToValueAtTime(1600, t + 0.1)
  const gain2 = ctx.createGain()
  gain2.gain.setValueAtTime(0.12, t)
  gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
  osc2.connect(gain2)
  gain2.connect(ctx.destination)
  osc2.start(t)
  osc2.stop(t + 0.3)

  setTimeout(() => ctx.close(), 600)
}

function playWaveSplash() {
  const ctx = getAudioContext()
  if (!ctx) return
  const t = ctx.currentTime

  const bufferSize = ctx.sampleRate * 0.4
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2)
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(2000, t)
  filter.frequency.exponentialRampToValueAtTime(400, t + 0.35)
  filter.Q.setValueAtTime(2, t)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.25, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  noise.start(t)

  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(500, t)
  osc.frequency.exponentialRampToValueAtTime(250, t + 0.3)
  const oscGain = ctx.createGain()
  oscGain.gain.setValueAtTime(0.15, t)
  oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
  osc.connect(oscGain)
  oscGain.connect(ctx.destination)
  osc.start(t)
  osc.stop(t + 0.35)

  setTimeout(() => ctx.close(), 500)
}

function playChime() {
  const ctx = getAudioContext()
  if (!ctx) return
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(660, t)
  osc.frequency.setValueAtTime(880, t + 0.12)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.2, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(t)
  osc.stop(t + 0.4)
  setTimeout(() => ctx.close(), 500)
}

const soundMap: Record<string, () => void> = {
  'my-oracle': playBellDing,
  'tony-oracle': playWaveSplash,
}

function playSoundForOracle(id: string) {
  const fn = soundMap[id] ?? playChime
  fn()
}

// --- Composable ---

export function useOracle() {
  const oracles = useState<OracleStatus[]>('oracle-status', () => [])
  const loading = ref(false)
  const connected = ref(false)
  const previousStatuses = ref<Record<string, OracleActivity>>({})
  let eventSource: EventSource | null = null
  let fallbackPollId: ReturnType<typeof setInterval> | null = null

  function checkTransitions(newOracles: OracleStatus[]) {
    if (import.meta.server) return
    for (const oracle of newOracles) {
      const prev = previousStatuses.value[oracle.id]
      const isActive = oracle.status === 'online' || oracle.status === 'overdrive'
      const wasActive = prev === 'online' || prev === 'overdrive'
      if (isActive && prev && !wasActive) {
        playSoundForOracle(oracle.id)
      }
      previousStatuses.value[oracle.id] = oracle.status
    }
  }

  function handleData(data: OracleStatus[]) {
    checkTransitions(data)
    oracles.value = data
    loading.value = false
  }

  // SSE connection
  function connect() {
    if (import.meta.server) return
    disconnect()
    loading.value = true

    eventSource = new EventSource('/api/oracle/stream')

    eventSource.onmessage = (event) => {
      connected.value = true
      try {
        const data = JSON.parse(event.data) as OracleStatus[]
        handleData(data)
      } catch {
        // malformed data, ignore
      }
    }

    eventSource.onerror = () => {
      connected.value = false
      // EventSource auto-reconnects, but start fallback polling
      // in case SSE is completely broken
      if (!fallbackPollId) {
        fallbackPollId = setInterval(async () => {
          if (connected.value) {
            // SSE reconnected, stop fallback
            if (fallbackPollId) {
              clearInterval(fallbackPollId)
              fallbackPollId = null
            }
            return
          }
          try {
            const data = await $fetch<OracleStatus[]>('/api/oracle/status')
            handleData(data)
          } catch {}
        }, 10_000)
      }
    }
  }

  function disconnect() {
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }
    connected.value = false
    if (fallbackPollId) {
      clearInterval(fallbackPollId)
      fallbackPollId = null
    }
  }

  // Initial fetch for SSR / immediate data
  async function fetchOracles() {
    loading.value = true
    try {
      const data = await $fetch<OracleStatus[]>('/api/oracle/status')
      handleData(data)
    } catch {}
    loading.value = false
  }

  return {
    oracles,
    loading: readonly(loading),
    connected: readonly(connected),
    fetchOracles,
    connect,
    disconnect,
  }
}
