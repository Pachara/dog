<template>
  <div class="card" :class="'card--' + entry.status">
    <div class="card-left">
      <DesignsClassicStatusBadge :status="entry.status" />
      <div class="card-info">
        <span class="card-url">{{ displayUrl }}</span>
        <span class="card-meta">
          <template v-if="entry.checkedAt">
            {{ formatResponseTime(entry.responseTime) }} &middot; checked {{ timeAgo(entry.checkedAt) }}
          </template>
          <template v-else>
            Waiting for first check...
          </template>
        </span>
        <span v-if="entry.error" class="card-error">{{ entry.error }}</span>
      </div>
    </div>
    <button class="btn btn-danger" title="Remove" @click="removeUrl(entry.id)">
      &times;
    </button>
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
  if (ms === null) return ''
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
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--bg-card);
  border-radius: 8px;
  border-left: 3px solid var(--border-card-default);
  transition: border-color 0.2s, background 0.3s;
}

.card--up { border-left-color: #22c55e; }
.card--down { border-left-color: #ef4444; }
.card--pending { border-left-color: #f59e0b; }

.card-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.card-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.card-url {
  font-weight: 500;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.card-error {
  font-size: 0.75rem;
  color: #ef4444;
}
</style>
