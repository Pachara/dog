<template>
  <span class="glass-badge" :class="'glass-badge--' + status">
    {{ icon }} {{ label }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ status: 'up' | 'down' | 'pending' }>()

const label = computed(() => {
  switch (props.status) {
    case 'up': return 'Online'
    case 'down': return 'Offline'
    case 'pending': return 'Checking'
  }
})

const icon = computed(() => {
  switch (props.status) {
    case 'up': return '\u2713'
    case 'down': return '\u2717'
    case 'pending': return '\u25CB'
  }
})
</script>

<style scoped>
.glass-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  white-space: nowrap;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-badge--up {
  background: rgba(16, 185, 129, 0.25);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.3);
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.15);
}

.glass-badge--down {
  background: rgba(244, 63, 94, 0.25);
  color: #fb7185;
  border-color: rgba(244, 63, 94, 0.3);
  box-shadow: 0 0 12px rgba(244, 63, 94, 0.15);
}

.glass-badge--pending {
  background: rgba(168, 85, 247, 0.25);
  color: #c084fc;
  border-color: rgba(168, 85, 247, 0.3);
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.15);
  animation: pulse-glow 2s ease infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; box-shadow: 0 0 12px rgba(168, 85, 247, 0.15); }
  50% { opacity: 0.8; box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
}
</style>
