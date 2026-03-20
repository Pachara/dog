<template>
  <span class="cd-badge" :class="'cd-badge--' + status">
    <span class="cd-badge-dot" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ status: 'up' | 'down' | 'pending' }>()

const label = computed(() => {
  switch (props.status) {
    case 'up': return 'Healthy'
    case 'down': return 'Down'
    case 'pending': return 'Checking'
  }
})
</script>

<style scoped>
.cd-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.cd-badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.cd-badge--up {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}
.cd-badge--up .cd-badge-dot {
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
}

.cd-badge--down {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}
.cd-badge--down .cd-badge-dot {
  background: #ef4444;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);
  animation: cd-pulse 1.5s ease infinite;
}

.cd-badge--pending {
  background: rgba(234, 179, 8, 0.1);
  color: #ca8a04;
}
.cd-badge--pending .cd-badge-dot {
  background: #eab308;
  box-shadow: 0 0 6px rgba(234, 179, 8, 0.4);
  animation: cd-pulse 1.5s ease infinite;
}

[data-theme="dark"] .cd-badge--up { background: rgba(34, 197, 94, 0.12); color: #4ade80; }
[data-theme="dark"] .cd-badge--down { background: rgba(239, 68, 68, 0.12); color: #f87171; }
[data-theme="dark"] .cd-badge--pending { background: rgba(234, 179, 8, 0.12); color: #facc15; }

@keyframes cd-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.6; }
}
</style>
