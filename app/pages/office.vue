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
        :class="{ 'oracle-card--online': oracle.online }"
      >
        <div class="card-header">
          <OracleAvatar :oracle-id="oracle.id" :online="oracle.online" />
          <div class="card-header-info">
            <div class="card-identity">
              <h2 class="card-name">{{ oracle.name }}</h2>
              <span class="status-badge" :class="oracle.online ? 'status-badge--on' : 'status-badge--off'">
                <span class="status-dot" />
                {{ oracle.online ? 'Online' : 'Offline' }}
              </span>
            </div>
            <p v-if="oracle.role" class="card-role">{{ oracle.role }}</p>
          </div>
        </div>

        <div class="card-meta">
          <div class="meta-item">
            <span class="meta-icon">&#128193;</span>
            <span class="meta-value meta-path">{{ oracle.path }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-icon">&#128233;</span>
            <span class="meta-value">
              {{ oracle.inboxCount }} message{{ oracle.inboxCount !== 1 ? 's' : '' }} in inbox
            </span>
          </div>
        </div>

        <div v-if="oracle.lastCommitMessage" class="card-commit">
          <span class="commit-msg">{{ oracle.lastCommitMessage }}</span>
          <span class="commit-time">{{ timeAgo(oracle.lastCommitTime) }}</span>
        </div>
        <div v-else class="card-commit card-commit--empty">
          No commits yet
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
const { oracles, loading, fetchOracles, startPolling, stopPolling } = useOracle()

const onlineCount = computed(() => oracles.value.filter(o => o.online).length)

function timeAgo(isoString: string | null): string {
  if (!isoString) return ''
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

onMounted(async () => {
  await fetchOracles()
  startPolling()
})

onUnmounted(() => {
  stopPolling()
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

.status-badge--on {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.status-badge--on .status-dot {
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
}

.status-badge--off {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.status-badge--off .status-dot {
  background: #9ca3af;
}

[data-theme="dark"] .status-badge--on {
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
}

[data-theme="dark"] .status-badge--off {
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

.meta-path {
  font-family: 'SF Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 0.7rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Commit */
.card-commit {
  padding-top: 0.6rem;
  border-top: 1px solid var(--border-card-default);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
}

.commit-msg {
  font-size: 0.78rem;
  color: var(--text-primary);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.commit-time {
  font-size: 0.7rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.card-commit--empty {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>
