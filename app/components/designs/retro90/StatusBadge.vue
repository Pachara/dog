<template>
  <span class="retro-badge" :class="'retro-badge--' + status">
    <span class="retro-icon">{{ icon }}</span>
    <span class="retro-label">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ status: 'up' | 'down' | 'pending' }>()

const label = computed(() => {
  switch (props.status) {
    case 'up': return 'ONLINE!'
    case 'down': return 'ERROR!!'
    case 'pending': return 'LOADING'
  }
})

const icon = computed(() => {
  switch (props.status) {
    case 'up': return '\u2605'
    case 'down': return '\u2620'
    case 'pending': return '\u23F3'
  }
})
</script>

<style scoped>
.retro-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: 'Comic Sans MS', 'Chalkboard SE', cursive;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border: 2px outset;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
}

.retro-icon {
  font-size: 0.85rem;
}

.retro-badge--up {
  background: #00ff00;
  color: #003300;
  border-color: #00cc00;
}

.retro-badge--down {
  background: #ff0000;
  color: #ffffff;
  border-color: #cc0000;
  animation: blink90 0.8s step-end infinite;
}

.retro-badge--pending {
  background: #ffff00;
  color: #333300;
  border-color: #cccc00;
  animation: spin-text 1.5s linear infinite;
}

@keyframes blink90 {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes spin-text {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
