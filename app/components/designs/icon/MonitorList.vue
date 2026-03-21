<template>
  <div class="icon-grid">
    <TransitionGroup name="icon">
      <DesignsIconMonitorCard v-for="entry in entries" :key="entry.id" :entry="entry" />
    </TransitionGroup>
    <div v-if="entries.length === 0" class="icon-empty">
      <div class="icon-empty-plus">+</div>
      <p>Add URLs above to see them here</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { entries } = useMonitor()
</script>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  padding: 0.5rem 0;
}

@media (max-width: 680px) {
  .icon-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.icon-empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
}

.icon-empty-plus {
  font-size: 2.5rem;
  font-weight: 200;
  opacity: 0.3;
  margin-bottom: 0.5rem;
}

.icon-empty p {
  font-size: 0.85rem;
  margin: 0;
}

.icon-enter-active,
.icon-leave-active {
  transition: all 0.25s ease;
}

.icon-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.icon-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
</style>
