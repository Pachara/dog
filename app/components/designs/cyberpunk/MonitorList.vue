<template>
  <div class="cyber-list">
    <TransitionGroup name="cyber">
      <DesignsCyberpunkMonitorCard v-for="entry in entries" :key="entry.id" :entry="entry" />
    </TransitionGroup>
    <div v-if="entries.length === 0" class="empty-state">
      <div class="empty-hud">
        <span class="hud-bracket">[</span>
        <span class="hud-text">NO TARGETS</span>
        <span class="hud-bracket">]</span>
      </div>
      <p class="empty-sub">JACK IN A URL TO BEGIN SURVEILLANCE</p>
      <div class="empty-line" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { entries } = useMonitor()
</script>

<style scoped>
.cyber-list {
  display: grid;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  font-family: 'Courier New', Courier, monospace;
}

.empty-hud {
  font-size: 1.2rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  margin-bottom: 0.75rem;
}

.hud-bracket {
  color: #05d9e8;
  text-shadow: 0 0 10px rgba(5, 217, 232, 0.5);
}

.hud-text {
  color: #ff2a6d;
  text-shadow: 0 0 10px rgba(255, 42, 109, 0.5);
}

.empty-sub {
  font-size: 0.7rem;
  color: #4a4a6a;
  letter-spacing: 0.15em;
  margin: 0 0 1rem;
}

.empty-line {
  width: 60px;
  height: 1px;
  margin: 0 auto;
  background: linear-gradient(90deg, transparent, #05d9e8, transparent);
  animation: scan 3s ease-in-out infinite;
}

@keyframes scan {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.cyber-enter-active,
.cyber-leave-active {
  transition: all 0.3s ease;
}

.cyber-enter-from {
  opacity: 0;
  transform: translateY(-10px) skewX(-2deg);
}

.cyber-leave-to {
  opacity: 0;
  transform: translateX(20px) skewX(2deg);
}
</style>
