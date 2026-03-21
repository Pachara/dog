<template>
  <div
    class="icon-tile"
    :class="'icon-tile--' + entry.status"
    @click="expanded = !expanded"
  >
    <button class="icon-remove" title="Remove" @click.stop="removeUrl(entry.id)">&times;</button>
    <div class="icon-favicon">
      <img :src="iconUrl" :alt="displayName" width="48" height="48" />
    </div>
    <span class="icon-name">{{ displayName }}</span>
    <DesignsIconStatusBadge :status="entry.status" />

    <!-- Expanded detail overlay -->
    <Transition name="detail">
      <div v-if="expanded" class="icon-detail" @click.stop>
        <div class="detail-url">{{ displayUrl }}</div>
        <div class="detail-row">
          <span class="detail-label">Status</span>
          <span class="detail-value">{{ entry.statusCode || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Response</span>
          <span class="detail-value">{{ formatMs(entry.responseTime) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Checked</span>
          <span class="detail-value">{{ timeAgo(entry.checkedAt) }}</span>
        </div>
        <div v-if="entry.error" class="detail-error">{{ entry.error }}</div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ entry: MonitorEntry }>()
const { removeUrl } = useMonitor()
const { generateDataUrl } = useIconGenerator()
const expanded = ref(false)

const displayUrl = computed(() => {
  const url = props.entry.normalizedUrl || props.entry.url
  return url.replace(/^https?:\/\//, '')
})

const displayName = computed(() => {
  const url = displayUrl.value
  return url.replace(/^www\./, '').split('/')[0].split(':')[0]
})

const iconUrl = computed(() => generateDataUrl(displayName.value))

function formatMs(ms: number | null): string {
  if (ms === null) return '-'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function timeAgo(iso: string | null): string {
  if (!iso) return '-'
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 5) return 'now'
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  return `${Math.floor(m / 60)}h`
}
</script>

<style scoped>
.icon-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.75rem 0.5rem;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  user-select: none;
}

.icon-tile:hover {
  background: var(--bg-card);
}

.icon-tile--up .icon-favicon {
  box-shadow: 0 0 0 2.5px #22c55e, 0 0 12px rgba(34, 197, 94, 0.3);
}

.icon-tile--down .icon-favicon {
  box-shadow: 0 0 0 2.5px #ef4444, 0 0 12px rgba(239, 68, 68, 0.3);
  animation: icon-pulse-red 2s ease infinite;
}

.icon-tile--pending .icon-favicon {
  box-shadow: 0 0 0 2.5px #94a3b8, 0 0 8px rgba(148, 163, 184, 0.2);
}

@keyframes icon-pulse-red {
  0%, 100% { box-shadow: 0 0 0 2.5px #ef4444, 0 0 12px rgba(239, 68, 68, 0.3); }
  50% { box-shadow: 0 0 0 2.5px #ef4444, 0 0 20px rgba(239, 68, 68, 0.5); }
}

.icon-favicon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  overflow: hidden;
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.3s ease;
}

.icon-favicon img {
  width: 48px;
  height: 48px;
  border-radius: 10px;
}

.icon-name {
  font-size: 0.65rem;
  color: var(--text-primary);
  text-align: center;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.icon-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  cursor: pointer;
  opacity: 0;
  transition: all 0.15s;
  padding: 0.15rem 0.3rem;
  border-radius: 6px;
  line-height: 1;
}

.icon-tile:hover .icon-remove {
  opacity: 0.6;
}

.icon-remove:hover {
  opacity: 1 !important;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

/* Expanded detail overlay */
.icon-detail {
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-card);
  border: 1px solid var(--border-card-default);
  border-radius: 12px;
  padding: 0.65rem 0.85rem;
  min-width: 160px;
  z-index: 10;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.detail-url {
  font-size: 0.7rem;
  color: var(--text-secondary);
  margin-bottom: 0.4rem;
  word-break: break-all;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.15rem 0;
}

.detail-label {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.detail-value {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-primary);
}

.detail-error {
  font-size: 0.6rem;
  color: #ef4444;
  margin-top: 0.3rem;
}

.detail-enter-active,
.detail-leave-active {
  transition: all 0.2s ease;
}

.detail-enter-from,
.detail-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-4px);
}
</style>
