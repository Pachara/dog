<template>
  <div class="modern-list">
    <TransitionGroup name="modern">
      <DesignsModernMonitorCard v-for="entry in entries" :key="entry.id" :entry="entry" />
    </TransitionGroup>
    <div v-if="entries.length === 0" class="empty-state">
      <div class="empty-icon">&#9678;</div>
      <p class="empty-title">No URLs yet</p>
      <p class="empty-subtitle">Add a URL above to start monitoring</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { entries } = useMonitor()
</script>

<style scoped>
.modern-list {
  display: grid;
  gap: 0.75rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-icon {
  font-size: 2.5rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 0.25rem;
}

.empty-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

.modern-enter-active,
.modern-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}

.modern-leave-to {
  opacity: 0;
  transform: scale(0.95) translateX(16px);
}
</style>
