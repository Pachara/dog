<template>
  <div class="terminal-card" :class="'terminal-card--' + entry.status">
    <div class="card-top">
      <div class="card-header">
        <span class="card-url">{{ displayUrl }}</span>
        <button class="remove-btn" title="Remove" @click="removeUrl(entry.id)">[x]</button>
      </div>
      <DesignsTerminalStatusBadge :status="entry.status" />
    </div>
    <div class="card-info">
      <template v-if="entry.checkedAt">
        <span class="info-item">
          <span class="info-label">RESP:</span>
          <span class="info-value">{{ formatResponseTime(entry.responseTime) }}</span>
        </span>
        <span class="info-sep">|</span>
        <span class="info-item">
          <span class="info-label">CHK:</span>
          <span class="info-value">{{ timeAgo(entry.checkedAt) }}</span>
        </span>
        <template v-if="entry.statusCode">
          <span class="info-sep">|</span>
          <span class="info-item">
            <span class="info-label">HTTP:</span>
            <span class="info-value">{{ entry.statusCode }}</span>
          </span>
        </template>
      </template>
      <span v-else class="info-value waiting">awaiting first ping...</span>
    </div>
    <div v-if="entry.error" class="card-error">ERR: {{ entry.error }}</div>
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
.terminal-card {
  background: #0a0a0a;
  border: 1px solid #1a3a1a;
  border-radius: 2px;
  padding: 0.75rem 1rem;
  font-family: 'Courier New', Courier, monospace;
  transition: all 0.2s;
  position: relative;
}

.terminal-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 65, 0.015) 2px,
    rgba(0, 255, 65, 0.015) 4px
  );
  pointer-events: none;
  border-radius: 2px;
}

.terminal-card--up {
  border-color: rgba(0, 255, 65, 0.3);
}

.terminal-card--down {
  border-color: rgba(255, 51, 51, 0.4);
}

.terminal-card--pending {
  border-color: rgba(255, 184, 0, 0.3);
}

.terminal-card:hover {
  box-shadow: 0 0 12px rgba(0, 255, 65, 0.1);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;
}

.card-url {
  font-size: 0.85rem;
  font-weight: 700;
  color: #00ff41;
  text-shadow: 0 0 4px rgba(0, 255, 65, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-btn {
  background: none;
  border: none;
  font-family: 'Courier New', Courier, monospace;
  color: #333;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
  transition: all 0.15s;
}

.terminal-card:hover .remove-btn {
  color: #666;
}

.remove-btn:hover {
  color: #ff3333 !important;
  text-shadow: 0 0 6px rgba(255, 51, 51, 0.5);
}

.card-info {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.info-item {
  display: inline-flex;
  gap: 0.3rem;
}

.info-label {
  font-size: 0.7rem;
  color: #1a5c2a;
}

.info-value {
  font-size: 0.7rem;
  color: #00cc33;
}

.info-sep {
  font-size: 0.7rem;
  color: #1a3a1a;
}

.waiting {
  color: #ffb800;
  animation: blink 1.2s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.card-error {
  margin-top: 0.5rem;
  font-size: 0.7rem;
  color: #ff3333;
  text-shadow: 0 0 4px rgba(255, 51, 51, 0.3);
}
</style>
