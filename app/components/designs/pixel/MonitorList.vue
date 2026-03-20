<template>
  <div class="px-list">
    <div class="px-list-header">
      <span class="px-list-title">&#9733; TARGETS &#9733;</span>
      <span class="px-list-count">{{ entries.length }} / 99</span>
    </div>
    <TransitionGroup tag="div" name="px" class="px-list-body">
      <DesignsPixelMonitorCard v-for="entry in entries" :key="entry.id" :entry="entry" />
    </TransitionGroup>
    <div v-if="entries.length === 0" class="px-empty">
      <div class="px-empty-sprite">&#9818;</div>
      <p class="px-empty-text">NO TARGETS FOUND</p>
      <p class="px-empty-sub">PRESS [ADD] TO BEGIN</p>
    </div>
    <div class="px-list-footer">
      <span class="px-score">SCORE: {{ String(entries.length * 1000).padStart(8, '0') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { entries } = useMonitor()
</script>

<style scoped>
.px-list {
  border: 3px solid #fff1e8;
  background: #000000;
  image-rendering: pixelated;
  font-family: 'Press Start 2P', monospace;
}

.px-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.6rem;
  background: #7e2553;
  border-bottom: 3px solid #ff004d;
}

.px-list-title {
  font-size: 0.55rem;
  color: #ffec27;
  text-shadow: 1px 1px 0 #000000;
}

.px-list-count {
  font-size: 0.45rem;
  color: #fff1e8;
}

.px-list-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0.4rem;
  background: repeating-linear-gradient(
    0deg,
    #0d0d0d 0px,
    #0d0d0d 2px,
    #000000 2px,
    #000000 4px
  );
}

.px-empty {
  text-align: center;
  padding: 2.5rem 1rem;
}

.px-empty-sprite {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  animation: px-bob 1s steps(2) infinite;
}

@keyframes px-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.px-empty-text {
  font-size: 0.55rem;
  color: #fff1e8;
  margin: 0 0 0.4rem;
}

.px-empty-sub {
  font-size: 0.4rem;
  color: #5f574f;
  margin: 0;
  animation: px-flash 1s step-end infinite;
}

@keyframes px-flash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.px-list-footer {
  padding: 0.4rem 0.6rem;
  border-top: 3px solid #5f574f;
  background: #1d2b53;
  text-align: right;
}

.px-score {
  font-size: 0.45rem;
  color: #ffec27;
}

/* Transitions */
.px-enter-active,
.px-leave-active {
  transition: all 0.2s steps(4);
}

.px-enter-from {
  opacity: 0;
  transform: translateX(-16px);
}

.px-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>
