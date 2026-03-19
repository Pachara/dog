<template>
  <div class="modern-card">
    <div class="card-top">
      <div class="card-header">
        <span class="card-url">{{ displayUrl }}</span>
        <button class="remove-btn" title="Remove" @click="removeUrl(entry.id)">&times;</button>
      </div>
      <DesignsModernStatusBadge :status="entry.status" />
    </div>
    <div class="card-bottom">
      <template v-if="entry.checkedAt">
        <span class="stat">
          <span class="stat-label">Response</span>
          <span class="stat-value">{{ formatResponseTime(entry.responseTime) }}</span>
        </span>
        <span class="stat-divider" />
        <span class="stat">
          <span class="stat-label">Checked</span>
          <span class="stat-value">{{ timeAgo(entry.checkedAt) }}</span>
        </span>
        <span v-if="entry.statusCode" class="stat-divider" />
        <span v-if="entry.statusCode" class="stat">
          <span class="stat-label">Status</span>
          <span class="stat-value">{{ entry.statusCode }}</span>
        </span>
      </template>
      <span v-else class="stat-value waiting">Waiting for first check...</span>
    </div>
    <div v-if="entry.error" class="card-error">{{ entry.error }}</div>
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
  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}
</script>

<style scoped>
.modern-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  transition: all 0.25s;
  border: 1px solid var(--border-card-default);
}

.modern-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;
}

.card-url {
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0 0.25rem;
  opacity: 0;
  transition: all 0.15s;
}

.modern-card:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  color: #f43f5e;
}

.card-bottom {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.stat-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.stat-value {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: var(--border-card-default);
  margin: 0 0.25rem;
}

.waiting {
  color: var(--text-muted);
  font-style: italic;
}

.card-error {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #f43f5e;
  padding: 0.35rem 0.6rem;
  background: rgba(244, 63, 94, 0.08);
  border-radius: 8px;
}
</style>
