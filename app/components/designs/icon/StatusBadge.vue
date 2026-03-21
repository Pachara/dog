<template>
  <span class="icon-badge" :class="'icon-badge--' + status">{{ label }}</span>
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
.icon-badge {
  font-size: 0.55rem;
  font-weight: 700;
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  letter-spacing: 0.03em;
}

.icon-badge--up { background: #22c55e; color: white; }
.icon-badge--down { background: #ef4444; color: white; }
.icon-badge--pending { background: #94a3b8; color: white; }
</style>
