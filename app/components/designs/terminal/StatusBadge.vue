<template>
  <span class="badge" :class="'badge--' + status">
    {{ icon }} {{ label }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ status: 'up' | 'down' | 'pending' }>()

const label = computed(() => {
  switch (props.status) {
    case 'up': return 'ONLINE'
    case 'down': return 'OFFLINE'
    case 'pending': return 'PING...'
  }
})

const icon = computed(() => {
  switch (props.status) {
    case 'up': return '[OK]'
    case 'down': return '[ERR]'
    case 'pending': return '[...]'
  }
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
  white-space: nowrap;
  border: 1px solid;
}

.badge--up {
  color: #00ff41;
  border-color: #00ff41;
  background: rgba(0, 255, 65, 0.1);
  text-shadow: 0 0 6px rgba(0, 255, 65, 0.5);
}

.badge--down {
  color: #ff3333;
  border-color: #ff3333;
  background: rgba(255, 51, 51, 0.1);
  text-shadow: 0 0 6px rgba(255, 51, 51, 0.5);
}

.badge--pending {
  color: #ffb800;
  border-color: #ffb800;
  background: rgba(255, 184, 0, 0.1);
  text-shadow: 0 0 6px rgba(255, 184, 0, 0.5);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
