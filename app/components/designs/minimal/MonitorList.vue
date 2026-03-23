<template>
  <div class="minimal-list">
    <TransitionGroup name="minimal">
      <DesignsMinimalMonitorCard v-for="entry in entries" :key="entry.id" :entry="entry" />
    </TransitionGroup>
    <div v-if="entries.length === 0" class="empty-state">
      <p class="empty-title">No URLs</p>
      <p class="empty-subtitle">Add one above to begin.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { entries } = useMonitor()
</script>

<style scoped>
.minimal-list {
  border-top: 1px solid var(--border-card-default);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0 0 0.2rem;
}

.empty-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.minimal-enter-active,
.minimal-leave-active {
  transition: opacity 0.2s ease;
}

.minimal-enter-from,
.minimal-leave-to {
  opacity: 0;
}
</style>
