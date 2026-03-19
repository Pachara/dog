<template>
  <tr class="retro-row" :class="'retro-row--' + entry.status">
    <td class="retro-cell retro-cell-status">
      <DesignsRetro90StatusBadge :status="entry.status" />
    </td>
    <td class="retro-cell retro-cell-url">
      <a class="retro-link" :href="entry.normalizedUrl || entry.url" target="_blank">
        {{ displayUrl }}
      </a>
    </td>
    <td class="retro-cell retro-cell-speed">
      <span class="retro-counter">{{ formatResponseTime(entry.responseTime) }}</span>
    </td>
    <td class="retro-cell retro-cell-checked">
      <template v-if="entry.checkedAt">{{ timeAgo(entry.checkedAt) }}</template>
      <template v-else><em>waiting...</em></template>
    </td>
    <td class="retro-cell retro-cell-action">
      <button class="retro-del-btn" title="Remove" @click="removeUrl(entry.id)">[X]</button>
    </td>
  </tr>
</template>

<script setup lang="ts">
const props = defineProps<{ entry: MonitorEntry }>()
const { removeUrl } = useMonitor()

const displayUrl = computed(() => {
  const url = props.entry.normalizedUrl || props.entry.url
  return url.replace(/^https?:\/\//, '')
})

function formatResponseTime(ms: number | null): string {
  if (ms === null) return '---'
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
.retro-row {
  font-family: 'Comic Sans MS', 'Chalkboard SE', cursive;
  font-size: 0.85rem;
}

.retro-row--up {
  background: #003300;
}

.retro-row--down {
  background: #330000;
}

.retro-row--pending {
  background: #333300;
}

.retro-cell {
  padding: 0.4rem 0.6rem;
  border: 1px solid #00ff00;
  vertical-align: middle;
}

.retro-cell-url {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.retro-link {
  color: #00ccff;
  text-decoration: underline;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
}

.retro-link:hover {
  color: #ff00ff;
}

.retro-link:visited {
  color: #cc66ff;
}

.retro-counter {
  font-family: 'Courier New', monospace;
  background: #000000;
  color: #00ff00;
  padding: 0.1rem 0.4rem;
  border: 1px inset #333333;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}

.retro-del-btn {
  background: #800000;
  color: #ff6666;
  border: 2px outset #cc0000;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.15rem 0.4rem;
}

.retro-del-btn:hover {
  background: #cc0000;
  color: #ffffff;
}

.retro-del-btn:active {
  border-style: inset;
}
</style>
