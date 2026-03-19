<template>
  <span class="badge" :class="'badge--' + status">
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
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  white-space: nowrap;
}

.badge--up {
  background: linear-gradient(135deg, #06b6d4, #10b981);
  color: white;
}

.badge--down {
  background: linear-gradient(135deg, #f43f5e, #e11d48);
  color: white;
}

.badge--pending {
  background: linear-gradient(135deg, #a855f7, #6366f1);
  color: white;
  animation: shimmer 1.5s ease infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>
