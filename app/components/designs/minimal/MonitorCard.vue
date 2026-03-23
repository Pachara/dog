<template>
  <div class="minimal-card">
    <div class="card-top">
      <div class="card-header">
        <span class="card-url">{{ displayUrl }}</span>
        <button class="remove-btn" title="Remove" @click="removeUrl(entry.id)">&times;</button>
      </div>
      <DesignsMinimalStatusBadge :status="entry.status" />
    </div>
    <div class="card-bottom">
      <template v-if="entry.checkedAt">
        <span class="stat">{{ formatResponseTime(entry.responseTime) }}</span>
        <span class="stat-sep">/</span>
        <span class="stat">{{ timeAgo(entry.checkedAt) }}</span>
        <template v-if="entry.statusCode">
          <span class="stat-sep">/</span>
          <span class="stat">{{ entry.statusCode }}</span>
        </template>
      </template>
      <span v-else class="stat waiting">Waiting...</span>
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
.minimal-card {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--border-card-default);
  transition: opacity 0.15s;
}

.minimal-card:last-child {
  border-bottom: none;
}

.minimal-card:hover {
  opacity: 0.8;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;
}

.card-url {
  font-weight: 500;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-primary);
}

.remove-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1rem;
  cursor: pointer;
  padding: 0 0.2rem;
  opacity: 0;
  transition: opacity 0.15s;
}

.minimal-card:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  color: #dc2626;
}

.card-bottom {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.stat {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.stat-sep {
  font-size: 0.7rem;
  color: var(--border-card-default);
}

.waiting {
  font-style: italic;
}

.card-error {
  margin-top: 0.35rem;
  font-size: 0.7rem;
  color: #dc2626;
}
</style>
