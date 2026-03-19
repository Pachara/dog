<template>
  <span class="badge" :class="'badge--' + status">
    <span class="dot" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ status: 'up' | 'down' | 'pending' }>()

const label = computed(() => {
  switch (props.status) {
    case 'up': return 'UP'
    case 'down': return 'DOWN'
    case 'pending': return '...'
  }
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  white-space: nowrap;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.badge--up { background: #16653420; color: #22c55e; }
.badge--up .dot { background: #22c55e; }

.badge--down { background: #ef444420; color: #ef4444; }
.badge--down .dot { background: #ef4444; }

.badge--pending { background: #f59e0b20; color: #f59e0b; }
.badge--pending .dot { background: #f59e0b; animation: pulse 1s infinite; }

[data-theme="light"] .badge--up { background: #dcfce7; color: #166534; }
[data-theme="light"] .badge--down { background: #fef2f2; color: #991b1b; }
[data-theme="light"] .badge--pending { background: #fef9c3; color: #854d0e; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
