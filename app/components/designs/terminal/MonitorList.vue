<template>
  <div class="terminal-list">
    <TransitionGroup name="terminal">
      <DesignsTerminalMonitorCard v-for="entry in entries" :key="entry.id" :entry="entry" />
    </TransitionGroup>
    <div v-if="entries.length === 0" class="empty-state">
      <pre class="empty-ascii">
  _____
 |     |
 | DOG |
 |_____|
      </pre>
      <p class="empty-text">> no targets found_</p>
      <p class="empty-hint">> add a url to begin monitoring...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { entries } = useMonitor()
</script>

<style scoped>
.terminal-list {
  display: grid;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  font-family: 'Courier New', Courier, monospace;
}

.empty-ascii {
  font-size: 0.8rem;
  color: #1a5c2a;
  margin: 0 0 1rem;
  line-height: 1.2;
}

.empty-text {
  font-size: 0.9rem;
  color: #00ff41;
  text-shadow: 0 0 8px rgba(0, 255, 65, 0.4);
  margin: 0 0 0.25rem;
}

.empty-hint {
  font-size: 0.75rem;
  color: #1a5c2a;
  margin: 0;
}

.terminal-enter-active,
.terminal-leave-active {
  transition: all 0.25s ease;
}

.terminal-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}

.terminal-leave-to {
  opacity: 0;
  transform: translateX(12px);
}
</style>
