<template>
  <span class="badge" :class="'badge--' + status">
    <span class="badge-glitch" :data-text="label">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ status: 'up' | 'down' | 'pending' }>()

const label = computed(() => {
  switch (props.status) {
    case 'up': return 'ACTIVE'
    case 'down': return 'DEAD'
    case 'pending': return 'SCAN'
  }
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.65rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  padding: 0.2rem 0.6rem;
  white-space: nowrap;
  clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
}

.badge--up {
  background: #00ffd5;
  color: #0a0a0f;
}

.badge--down {
  background: #ff2a6d;
  color: #0a0a0f;
}

.badge--pending {
  background: #d946ef;
  color: #0a0a0f;
  animation: pulse-neon 1.5s ease infinite;
}

@keyframes pulse-neon {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.badge-glitch {
  position: relative;
}

.badge--down .badge-glitch::after {
  content: attr(data-text);
  position: absolute;
  left: 2px;
  top: 0;
  color: #05d9e8;
  clip-path: inset(0 0 50% 0);
  animation: glitch 2s infinite;
}

@keyframes glitch {
  0%, 90%, 100% { transform: translate(0); }
  92% { transform: translate(-2px, 1px); }
  94% { transform: translate(2px, -1px); }
  96% { transform: translate(-1px, 0); }
}
</style>
