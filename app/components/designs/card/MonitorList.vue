<template>
  <div class="cd-list">
    <TransitionGroup name="cd">
      <DesignsCardMonitorCard v-for="entry in entries" :key="entry.id" :entry="entry" />
    </TransitionGroup>
    <div v-if="entries.length === 0" class="cd-empty" style="grid-column: 1 / -1">
      <div class="cd-empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </div>
      <p class="cd-empty-title">No URLs monitored yet</p>
      <p class="cd-empty-desc">Add a URL above to start tracking its uptime</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { entries } = useMonitor()
</script>

<style scoped>
.cd-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (max-width: 680px) {
  .cd-list {
    grid-template-columns: 1fr;
  }
}

.cd-empty {
  text-align: center;
  padding: 4rem 1.5rem;
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 4px 12px rgba(0, 0, 0, 0.04);
}

.cd-empty-icon {
  color: var(--text-muted);
  margin-bottom: 1rem;
  opacity: 0.4;
}

.cd-empty-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.35rem;
}

.cd-empty-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

/* Transitions */
.cd-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.cd-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cd-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.97);
}

.cd-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.97);
}
</style>
