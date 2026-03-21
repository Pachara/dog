<template>
  <div class="dashboard">
    <header class="dash-header">
      <div class="dash-header-top">
        <NuxtLink to="/" class="back-link">&larr; Home</NuxtLink>
        <div class="dash-controls">
          <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
            {{ isDark ? '&#9788;' : '&#9790;' }}
          </button>
          <DesignSwitcher />
        </div>
      </div>
      <h1>DOG</h1>
      <p class="dash-subtitle">URL uptime monitor</p>
    </header>
    <main class="dash-main">
      <component :is="currentComponents.AddUrlForm" />
      <div class="toolbar">
        <span class="count">{{ entries.length }} URL{{ entries.length !== 1 ? 's' : '' }} monitored</span>
        <button class="btn btn-secondary" :disabled="isChecking || entries.length === 0" @click="checkAll">
          {{ isChecking ? 'Checking...' : 'Check All Now' }}
        </button>
      </div>
      <component :is="currentComponents.MonitorList" />
    </main>
  </div>
</template>

<script setup lang="ts">
const { entries, isChecking, fetchEntries, checkAll, startPolling, stopPolling } = useMonitor()
const { isDark, toggleTheme } = useTheme()
const { currentComponents } = useDesign()

onMounted(async () => {
  await fetchEntries()
  if (entries.value.length > 0) {
    checkAll()
  }
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
.dashboard {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.dash-header {
  text-align: center;
  margin-bottom: 2rem;
}

.dash-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.back-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.15s;
}

.back-link:hover {
  color: var(--text-primary);
}

.dash-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dash-header h1 {
  font-size: 2rem;
  margin: 0;
  letter-spacing: 0.1em;
}

.dash-subtitle {
  color: var(--text-secondary);
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
}

.theme-toggle {
  background: var(--bg-btn-secondary);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  color: var(--text-primary);
}

.theme-toggle:hover {
  background: var(--bg-btn-secondary-hover);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0 1rem;
}

.count {
  font-size: 0.85rem;
  color: var(--text-secondary);
}
</style>
