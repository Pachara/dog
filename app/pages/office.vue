<template>
  <div class="office">
    <nav class="office-nav">
      <NuxtLink to="/" class="back-link">&larr; Home</NuxtLink>
      <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        {{ isDark ? '&#9788;' : '&#9790;' }}
      </button>
    </nav>

    <header class="office-header">
      <h1 class="office-title">Oracle Office</h1>
      <p class="office-subtitle">
        {{ oracles.length }} Oracle{{ oracles.length !== 1 ? 's' : '' }} registered
        &middot;
        {{ onlineCount }} online
        &middot;
        <span class="live-indicator" :class="{ 'live-indicator--on': connected }">
          {{ connected ? 'Live' : 'Polling' }}
        </span>
        &middot;
        <span class="updated-indicator">{{ updatedAgo }}</span>
      </p>
    </header>

    <div v-if="loading && oracles.length === 0" class="office-loading">
      <span class="spinner" />
      <span>Scanning for Oracles...</span>
    </div>

    <div v-else-if="oracles.length === 0" class="office-empty">
      <div class="empty-icon">&#9678;</div>
      <p class="empty-title">No Oracles found</p>
      <p class="empty-desc">No *-oracle directories found in Projects</p>
    </div>

    <div v-else class="oracle-grid">
      <div
        v-for="oracle in oracles"
        :key="oracle.id"
        class="oracle-card"
        :class="{
          'oracle-card--online': oracle.status === 'online',
          'oracle-card--overdrive': oracle.status === 'overdrive',
        }"
      >
        <div class="card-header">
          <OracleAvatar :oracle-id="oracle.id" :status="oracle.status" />
          <div class="card-header-info">
            <div class="card-identity">
              <h2 class="card-name">{{ oracle.name }}</h2>
              <span class="status-badge" :class="'status-badge--' + oracle.status">
                <span class="status-dot" />
                {{ statusLabel(oracle) }}
              </span>
            </div>
            <p v-if="oracle.role" class="card-role">{{ oracle.role }}</p>
          </div>
        </div>

        <!-- CPU mini bar -->
        <div v-if="oracle.status === 'online' || oracle.status === 'overdrive'" class="cpu-bar-wrap">
          <div class="cpu-bar-track">
            <div class="cpu-bar-fill" :class="cpuBarClass(oracle.cpu)" :style="{ width: Math.min(oracle.cpu, 100) + '%' }" />
          </div>
          <span class="cpu-bar-label">{{ oracle.cpu }}%</span>
        </div>

        <div class="card-meta">
          <div class="meta-item">
            <span class="meta-icon">&#128233;</span>
            <span class="meta-value">
              {{ oracle.inboxCount }} message{{ oracle.inboxCount !== 1 ? 's' : '' }} in inbox
            </span>
          </div>
          <div v-if="oracle.lastCommitMessage" class="meta-item">
            <span class="meta-icon">&#128221;</span>
            <span class="meta-value meta-commit">{{ oracle.lastCommitMessage }}</span>
          </div>
        </div>

        <div class="card-footer">
          <div v-if="oracle.currentTask" class="card-task">
            <span class="task-text">{{ oracle.currentTask }}</span>
          </div>
          <div v-else-if="oracle.status === 'idle' || oracle.status === 'offline'" class="card-task card-task--sleeping">
            <span class="task-text">Sleeping...</span>
          </div>
          <div v-else class="card-task card-task--sleeping">
            <span class="task-text">Waiting...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
const { oracles, loading, connected, fetchOracles, connect, disconnect } = useOracle()

const onlineCount = computed(() => oracles.value.filter(o => o.status === 'online' || o.status === 'overdrive').length)

function statusLabel(oracle: { status: string, cpu: number }): string {
  switch (oracle.status) {
    case 'overdrive': return 'Overdrive!'
    case 'online': return 'Working'
    case 'idle': return 'Idle'
    case 'offline': return 'Offline'
    default: return oracle.status
  }
}

function cpuBarClass(cpu: number): string {
  if (cpu > 30) return 'cpu-bar--overdrive'
  if (cpu > 10) return 'cpu-bar--active'
  return 'cpu-bar--low'
}

// Updated ago indicator
const lastUpdatedAt = ref(Date.now())
const updatedAgo = ref('just now')
let tickId: ReturnType<typeof setInterval> | null = null

watch(oracles, () => { lastUpdatedAt.value = Date.now() }, { deep: true })

function updateTick() {
  const secs = Math.floor((Date.now() - lastUpdatedAt.value) / 1000)
  if (secs < 3) updatedAgo.value = 'just now'
  else if (secs < 60) updatedAgo.value = `${secs}s ago`
  else updatedAgo.value = `${Math.floor(secs / 60)}m ago`
}

onMounted(async () => {
  await fetchOracles()
  connect()
  tickId = setInterval(updateTick, 1000)
})

onUnmounted(() => {
  disconnect()
  if (tickId) clearInterval(tickId)
})
</script>

<style scoped>
.office {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: 100vh;
}

/* Nav */
.office-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--text-primary);
}

.theme-toggle {
  background: var(--bg-btn-secondary);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  color: var(--text-primary);
}

.theme-toggle:hover {
  background: var(--bg-btn-secondary-hover);
}

/* Header */
.office-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.office-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;
}

.office-subtitle {
  color: var(--text-secondary);
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
}

.live-indicator {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
}

.live-indicator--on {
  color: #22c55e;
}

.updated-indicator {
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* Loading */
.office-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 4rem 1rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-card-default);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty */
.office-empty {
  text-align: center;
  padding: 4rem 1.5rem;
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 4px 12px rgba(0, 0, 0, 0.04);
}

.empty-icon {
  font-size: 2.5rem;
  color: var(--text-muted);
  opacity: 0.4;
  margin-bottom: 0.75rem;
}

.empty-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.35rem;
}

.empty-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

/* Grid */
.oracle-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

@media (max-width: 680px) {
  .oracle-grid {
    grid-template-columns: 1fr;
  }
}

/* Card */
.oracle-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  border: 1.5px solid transparent;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.oracle-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.08),
    0 12px 32px rgba(0, 0, 0, 0.08);
}

.oracle-card--online {
  border-color: rgba(34, 197, 94, 0.2);
}

.oracle-card--online:hover {
  border-color: rgba(34, 197, 94, 0.35);
}

.oracle-card--overdrive {
  border-color: rgba(249, 115, 22, 0.35);
  animation: card-glow 1.5s ease-in-out infinite alternate;
}

.oracle-card--overdrive:hover {
  border-color: rgba(249, 115, 22, 0.5);
}

@keyframes card-glow {
  0% { box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04), 0 0 8px rgba(249,115,22,0.1); }
  100% { box-shadow: 0 4px 8px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.08), 0 0 20px rgba(249,115,22,0.2); }
}

/* Card header */
.card-header {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.card-header-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-identity {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.card-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}

/* Status badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.status-badge--overdrive {
  background: rgba(249, 115, 22, 0.12);
  color: #c2410c;
  animation: badge-pulse 0.8s ease-in-out infinite alternate;
}

.status-badge--overdrive .status-dot {
  background: #f97316;
  box-shadow: 0 0 8px rgba(249, 115, 22, 0.6);
  animation: dot-overdrive 0.4s ease infinite;
}

@keyframes badge-pulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}

@keyframes dot-overdrive {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.5); }
}

.status-badge--online {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.status-badge--online .status-dot {
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
}

.status-badge--idle {
  background: rgba(234, 179, 8, 0.1);
  color: #a16207;
}

.status-badge--idle .status-dot {
  background: #eab308;
  box-shadow: 0 0 6px rgba(234, 179, 8, 0.3);
}

.status-badge--offline {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.status-badge--offline .status-dot {
  background: #9ca3af;
}

[data-theme="dark"] .status-badge--overdrive {
  background: rgba(249, 115, 22, 0.15);
  color: #fb923c;
}

[data-theme="dark"] .status-badge--online {
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
}

[data-theme="dark"] .status-badge--idle {
  background: rgba(234, 179, 8, 0.12);
  color: #facc15;
}

[data-theme="dark"] .status-badge--offline {
  background: rgba(107, 114, 128, 0.12);
  color: #9ca3af;
}

/* Role */
.card-role {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* CPU mini bar */
.cpu-bar-wrap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.cpu-bar-track {
  flex: 1;
  height: 5px;
  background: var(--border-card-default);
  border-radius: 3px;
  overflow: hidden;
}

.cpu-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease, background 0.3s;
}

.cpu-bar--low { background: #22c55e; }
.cpu-bar--active { background: #eab308; }
.cpu-bar--overdrive { background: #f97316; animation: cpu-glow 0.8s ease infinite alternate; }

@keyframes cpu-glow {
  0% { box-shadow: none; }
  100% { box-shadow: 0 0 6px rgba(249, 115, 22, 0.5); }
}

.cpu-bar-label {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--text-muted);
  min-width: 2.5rem;
  text-align: right;
}

/* Commit in meta */
.meta-commit {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-style: italic;
}

/* Footer */
.card-footer {
  padding-top: 0.6rem;
  border-top: 1px solid var(--border-card-default);
  margin-top: auto;
}

.card-task {
  transition: all 0.3s ease;
}

.task-text {
  font-size: 0.78rem;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.card-task--sleeping .task-text {
  font-style: italic;
  color: var(--text-muted);
}

/* Meta */
.card-meta {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
}

.meta-icon {
  flex-shrink: 0;
  font-size: 0.85rem;
}

.meta-value {
  color: var(--text-secondary);
}


</style>
