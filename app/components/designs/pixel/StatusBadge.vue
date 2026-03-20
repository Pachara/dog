<template>
  <span class="px-badge" :class="'px-badge--' + status">
    <span class="px-hearts">
      <span v-for="i in 3" :key="i" class="px-heart" :class="{ filled: filledHearts >= i }">&#9829;</span>
    </span>
    <span class="px-label">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ status: 'up' | 'down' | 'pending' }>()

const label = computed(() => {
  switch (props.status) {
    case 'up': return 'OK!'
    case 'down': return 'KO!'
    case 'pending': return '...'
  }
})

const filledHearts = computed(() => {
  switch (props.status) {
    case 'up': return 3
    case 'down': return 0
    case 'pending': return 1
  }
})
</script>

<style scoped>
.px-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.5rem;
  padding: 0.3rem 0.5rem;
  border: 2px solid;
  image-rendering: pixelated;
}

.px-hearts {
  display: flex;
  gap: 0.15rem;
}

.px-heart {
  font-size: 0.6rem;
  color: #4a4a4a;
  text-shadow: none;
}

.px-heart.filled {
  color: #ff004d;
  text-shadow: 0 0 2px #ff004d;
}

.px-badge--up {
  border-color: #00e436;
  background: #002200;
  color: #00e436;
}

.px-badge--down {
  border-color: #ff004d;
  background: #220000;
  color: #ff004d;
  animation: px-flash 0.5s step-end infinite;
}

.px-badge--pending {
  border-color: #ffec27;
  background: #222200;
  color: #ffec27;
}

@keyframes px-flash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
