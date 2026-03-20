<template>
  <div class="px-card" :class="'px-card--' + entry.status">
    <div class="px-card-top">
      <DesignsPixelStatusBadge :status="entry.status" />
      <span class="px-url">{{ displayUrl }}</span>
      <button class="px-del" title="Remove" @click="removeUrl(entry.id)">X</button>
    </div>
    <div class="px-card-stats">
      <div class="px-stat">
        <span class="px-stat-label">SPD</span>
        <div class="px-bar-track">
          <div class="px-bar-fill px-bar-fill--spd" :style="{ width: speedWidth }" />
        </div>
        <span class="px-stat-val">{{ formatResponseTime(entry.responseTime) }}</span>
      </div>
      <div class="px-stat">
        <span class="px-stat-label">HP</span>
        <div class="px-bar-track">
          <div class="px-bar-fill" :class="hpBarClass" :style="{ width: hpWidth }" />
        </div>
        <span class="px-stat-val">{{ hpLabel }}</span>
      </div>
    </div>
    <div class="px-card-footer">
      <template v-if="entry.checkedAt">
        <span class="px-time">CHECKED {{ timeAgo(entry.checkedAt) }}</span>
      </template>
      <template v-else>
        <span class="px-time">WAITING FOR SCAN...</span>
      </template>
      <span v-if="entry.error" class="px-error">! {{ entry.error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ entry: MonitorEntry }>()
const { removeUrl } = useMonitor()

const displayUrl = computed(() => {
  const url = props.entry.normalizedUrl || props.entry.url
  return url.replace(/^https?:\/\//, '').toUpperCase()
})

const speedWidth = computed(() => {
  const ms = props.entry.responseTime
  if (ms === null) return '0%'
  const pct = Math.max(5, Math.min(100, 100 - (ms / 30)))
  return `${pct}%`
})

const hpWidth = computed(() => {
  return props.entry.status === 'up' ? '100%' : props.entry.status === 'down' ? '0%' : '50%'
})

const hpBarClass = computed(() => {
  return props.entry.status === 'up' ? 'px-bar-fill--hp-full'
    : props.entry.status === 'down' ? 'px-bar-fill--hp-dead'
    : 'px-bar-fill--hp-mid'
})

const hpLabel = computed(() => {
  return props.entry.status === 'up' ? 'MAX' : props.entry.status === 'down' ? 'KO' : '???'
})

function formatResponseTime(ms: number | null): string {
  if (ms === null) return '---'
  if (ms < 1000) return `${ms}MS`
  return `${(ms / 1000).toFixed(1)}S`
}

function timeAgo(isoString: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  if (seconds < 5) return 'NOW'
  if (seconds < 60) return `${seconds}S AGO`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}M AGO`
  const hours = Math.floor(minutes / 60)
  return `${hours}H AGO`
}
</script>

<style scoped>
.px-card {
  border: 3px solid #c2c3c7;
  background: #1d2b53;
  padding: 0.6rem;
  font-family: 'Press Start 2P', monospace;
  image-rendering: pixelated;
  transition: none;
}

.px-card--up { border-color: #00e436; }
.px-card--down { border-color: #ff004d; }
.px-card--pending { border-color: #ffec27; }

.px-card-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.px-url {
  flex: 1;
  font-size: 0.5rem;
  color: #29adff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.px-del {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.45rem;
  background: #ff004d;
  color: #fff1e8;
  border: 2px solid;
  border-color: #ff77a8 #7e2553 #7e2553 #ff77a8;
  cursor: pointer;
  padding: 0.2rem 0.35rem;
  line-height: 1;
}

.px-del:hover {
  background: #ff77a8;
}

.px-del:active {
  border-color: #7e2553 #ff77a8 #ff77a8 #7e2553;
}

/* Stats with bars */
.px-card-stats {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.4rem;
}

.px-stat {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.px-stat-label {
  font-size: 0.4rem;
  color: #fff1e8;
  width: 1.8rem;
  flex-shrink: 0;
}

.px-bar-track {
  flex: 1;
  height: 8px;
  background: #000000;
  border: 1px solid #5f574f;
  overflow: hidden;
}

.px-bar-fill {
  height: 100%;
  transition: width 0.3s steps(8);
}

.px-bar-fill--spd {
  background: #29adff;
}

.px-bar-fill--hp-full {
  background: #00e436;
}

.px-bar-fill--hp-mid {
  background: #ffec27;
}

.px-bar-fill--hp-dead {
  background: #ff004d;
}

.px-stat-val {
  font-size: 0.4rem;
  color: #c2c3c7;
  width: 2.5rem;
  text-align: right;
  flex-shrink: 0;
}

/* Footer */
.px-card-footer {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.px-time {
  font-size: 0.35rem;
  color: #5f574f;
}

.px-error {
  font-size: 0.35rem;
  color: #ff004d;
}
</style>
