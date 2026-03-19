<template>
  <div class="design-switcher">
    <button
      v-for="design in designs"
      :key="design.id"
      class="switcher-btn"
      :class="{ active: currentDesign === design.id }"
      :title="design.description"
      @click="setDesign(design.id)"
    >
      {{ design.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { currentDesign, designs, setDesign } = useDesign()
</script>

<style scoped>
.design-switcher {
  display: flex;
  gap: 0.25rem;
  background: var(--bg-btn-secondary);
  border-radius: 8px;
  padding: 0.2rem;
}

.switcher-btn {
  border: none;
  background: transparent;
  color: var(--text-muted);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.switcher-btn:hover {
  color: var(--text-primary);
}

.switcher-btn.active {
  background: var(--bg-card);
  color: var(--text-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
