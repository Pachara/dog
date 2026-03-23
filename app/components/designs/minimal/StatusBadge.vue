<template>
  <span class="minimal-badge" :class="'minimal-badge--' + status">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ status: 'up' | 'down' | 'pending' }>()

const label = computed(() => {
  switch (props.status) {
    case 'up': return 'Up'
    case 'down': return 'Down'
    case 'pending': return 'Pending'
  }
})
</script>

<style scoped>
.minimal-badge {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  border: 1px solid;
  white-space: nowrap;
}

.minimal-badge--up {
  color: #059669;
  border-color: #d1fae5;
  background: transparent;
}

.minimal-badge--down {
  color: #dc2626;
  border-color: #fee2e2;
  background: transparent;
}

.minimal-badge--pending {
  color: var(--text-muted);
  border-color: var(--border-card-default);
  background: transparent;
  animation: fade-pulse 2s ease infinite;
}

@keyframes fade-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
