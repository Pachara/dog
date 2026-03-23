<template>
  <div class="cyber-card" :class="'cyber-card--' + entry.status">
    <div class="card-hud-line" />
    <div class="card-top">
      <div class="card-header">
        <span class="card-url">{{ displayUrl }}</span>
        <button class="remove-btn" title="Remove" @click="removeUrl(entry.id)">DEL</button>
      </div>
      <DesignsCyberpunkStatusBadge :status="entry.status" />
    </div>
    <div class="card-data">
      <template v-if="entry.checkedAt">
        <div class="data-block">
          <span class="data-label">RESP</span>
          <span class="data-value">{{ formatResponseTime(entry.responseTime) }}</span>
        </div>
        <div class="data-sep" />
        <div class="data-block">
          <span class="data-label">LAST_CHK</span>
          <span class="data-value">{{ timeAgo(entry.checkedAt) }}</span>
        </div>
        <template v-if="entry.statusCode">
          <div class="data-sep" />
          <div class="data-block">
            <span class="data-label">HTTP</span>
            <span class="data-value" :class="{ 'data-value--warn': entry.statusCode >= 400 }">{{ entry.statusCode }}</span>
          </div>
        </template>
      </template>
      <span v-else class="data-value data-value--pending">AWAITING HANDSHAKE...</span>
    </div>
    <div v-if="entry.error" class="card-error">
      <span class="error-prefix">ERR//</span> {{ entry.error }}
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
  if (ms === null) return '--'
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
.cyber-card {
  position: relative;
  background: rgba(10, 10, 15, 0.95);
  padding: 0.85rem 1rem;
  font-family: 'Courier New', Courier, monospace;
  transition: all 0.2s;
  border: 1px solid #1a1a2e;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
}

.cyber-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent, #05d9e8), transparent);
  opacity: 0.5;
}

.cyber-card--up { --accent: #00ffd5; border-color: rgba(0, 255, 213, 0.2); }
.cyber-card--down { --accent: #ff2a6d; border-color: rgba(255, 42, 109, 0.2); }
.cyber-card--pending { --accent: #d946ef; border-color: rgba(217, 70, 239, 0.2); }

.cyber-card:hover {
  box-shadow: 0 0 20px rgba(5, 217, 232, 0.08), inset 0 0 30px rgba(5, 217, 232, 0.02);
}

.card-hud-line {
  position: absolute;
  top: 12px;
  right: 0;
  width: 1px;
  height: calc(100% - 24px);
  background: linear-gradient(180deg, transparent, var(--accent, #05d9e8), transparent);
  opacity: 0.15;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.6rem;
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
  color: #05d9e8;
  text-shadow: 0 0 6px rgba(5, 217, 232, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.03em;
}

.remove-btn {
  background: none;
  border: 1px solid transparent;
  font-family: 'Courier New', Courier, monospace;
  color: #2a2a4a;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  cursor: pointer;
  padding: 0.1rem 0.4rem;
  transition: all 0.15s;
  opacity: 0;
}

.cyber-card:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  color: #ff2a6d;
  border-color: #ff2a6d;
  text-shadow: 0 0 6px rgba(255, 42, 109, 0.5);
}

.card-data {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.data-block {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.data-label {
  font-size: 0.55rem;
  color: #4a4a6a;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.data-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: #8a8aaf;
}

.data-value--warn {
  color: #ff2a6d;
}

.data-value--pending {
  color: #d946ef;
  animation: flicker 2s infinite;
  font-size: 0.7rem;
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
  52% { opacity: 1; }
  54% { opacity: 0.4; }
  56% { opacity: 1; }
}

.data-sep {
  width: 1px;
  height: 20px;
  background: #1a1a2e;
}

.card-error {
  margin-top: 0.5rem;
  font-size: 0.7rem;
  color: #ff2a6d;
  text-shadow: 0 0 4px rgba(255, 42, 109, 0.3);
}

.error-prefix {
  color: #ff2a6d;
  font-weight: 900;
}
</style>
