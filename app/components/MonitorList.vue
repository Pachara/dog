<template>
  <div class="monitor-list">
    <TransitionGroup name="list">
      <MonitorCard v-for="entry in entries" :key="entry.id" :entry="entry" />
    </TransitionGroup>
    <div v-if="entries.length === 0" class="empty-state">
      <p>No URLs being monitored yet.</p>
      <p>Add one above to get started.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { entries } = useMonitor()
</script>

<style scoped>
.monitor-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
}

.empty-state p {
  margin: 0.25rem 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
