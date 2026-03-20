<template>
  <div class="cd-card" :class="'cd-card--' + entry.status">
    <div class="cd-card-header">
      <div class="cd-card-title">
        <span class="cd-url">{{ displayUrl }}</span>
        <DesignsCardStatusBadge :status="entry.status" />
      </div>
      <button class="cd-remove" title="Remove" @click="removeUrl(entry.id)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <div class="cd-card-body">
      <template v-if="entry.checkedAt">
        <div class="cd-metrics">
          <div class="cd-metric">
            <span class="cd-metric-value">{{ formatResponseTime(entry.responseTime) }}</span>
            <span class="cd-metric-label">Response</span>
          </div>
          <div class="cd-metric-divider" />
          <div class="cd-metric">
            <span class="cd-metric-value">{{ entry.statusCode || '-' }}</span>
            <span class="cd-metric-label">Status</span>
          </div>
          <div class="cd-metric-divider" />
          <div class="cd-metric">
            <span class="cd-metric-value">{{ timeAgo(entry.checkedAt) }}</span>
            <span class="cd-metric-label">Last Check</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="cd-waiting">
          <span class="cd-waiting-dot" />
          Waiting for first check...
        </div>
      </template>
    </div>
    <div v-if="entry.error" class="cd-card-error">
      {{ entry.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ entry: MonitorEntry }>()
const { removeUrl } = useMonitor()

const displayUrl = computed(() => {
  const url = props.entry.normalizedUrl || props.entry.url
  return url.replace(/^https?:\/\//, '')
})

function formatResponseTime(ms: number | null): string {
  if (ms === null) return '-'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function timeAgo(isoString: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  if (seconds < 5) return 'Just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}
</script>

<style scoped>
.cd-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5px solid transparent;
}

.cd-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.08),
    0 12px 32px rgba(0, 0, 0, 0.08);
}

.cd-card--up { border-color: rgba(34, 197, 94, 0.2); }
.cd-card--down { border-color: rgba(239, 68, 68, 0.2); }
.cd-card--pending { border-color: rgba(234, 179, 8, 0.2); }

.cd-card--up:hover { border-color: rgba(34, 197, 94, 0.35); }
.cd-card--down:hover { border-color: rgba(239, 68, 68, 0.35); }
.cd-card--pending:hover { border-color: rgba(234, 179, 8, 0.35); }

.cd-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.cd-card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
}

.cd-url {
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cd-remove {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.35rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.cd-card:hover .cd-remove {
  opacity: 1;
}

.cd-remove:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Metrics */
.cd-metrics {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cd-metric {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.cd-metric-value {
  font-size: 0.95rem;
  font-weight: 600;
}

.cd-metric-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.cd-metric-divider {
  width: 1px;
  height: 28px;
  background: var(--border-card-default);
}

/* Waiting state */
.cd-waiting {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.cd-waiting-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
  animation: cd-pulse 1.5s ease infinite;
}

/* Error */
.cd-card-error {
  margin-top: 0.75rem;
  padding: 0.6rem 0.85rem;
  background: rgba(239, 68, 68, 0.06);
  border-radius: 10px;
  font-size: 0.78rem;
  color: #ef4444;
  transition: background 0.3s ease;
}

[data-theme="dark"] .cd-card-error {
  background: rgba(239, 68, 68, 0.1);
}

@keyframes cd-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.6; }
}
</style>
