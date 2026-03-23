<template>
  <div class="glass-list">
    <TransitionGroup name="glass">
      <DesignsGlassmorphismMonitorCard v-for="entry in entries" :key="entry.id" :entry="entry" />
    </TransitionGroup>
    <div v-if="entries.length === 0" class="empty-state">
      <div class="empty-icon">&#9670;</div>
      <p class="empty-title">No URLs yet</p>
      <p class="empty-subtitle">Add a URL above to start monitoring</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { entries } = useMonitor()
</script>

<style scoped>
.glass-list {
  display: grid;
  gap: 0.75rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.empty-icon {
  font-size: 2.5rem;
  color: rgba(196, 181, 253, 0.3);
  margin-bottom: 0.5rem;
}

.empty-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 0.25rem;
}

.empty-subtitle {
  font-size: 0.85rem;
  color: rgba(196, 181, 253, 0.4);
  margin: 0;
}

.glass-enter-active,
.glass-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-12px);
  filter: blur(4px);
}

.glass-leave-to {
  opacity: 0;
  transform: scale(0.9) translateX(20px);
  filter: blur(4px);
}
</style>
