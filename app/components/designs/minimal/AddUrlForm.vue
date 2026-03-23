<template>
  <form class="minimal-form" @submit.prevent="handleSubmit">
    <input
      v-model="newUrl"
      type="text"
      class="minimal-input"
      placeholder="Enter URL..."
      :disabled="adding"
    />
    <button type="submit" class="minimal-submit" :disabled="!newUrl.trim() || adding">
      {{ adding ? '...' : 'Add' }}
    </button>
  </form>
</template>

<script setup lang="ts">
const { addUrl } = useMonitor()
const newUrl = ref('')
const adding = ref(false)

async function handleSubmit() {
  if (!newUrl.value.trim()) return
  adding.value = true
  await addUrl(newUrl.value)
  newUrl.value = ''
  adding.value = false
}
</script>

<style scoped>
.minimal-form {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}

.minimal-input {
  flex: 1;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border-input);
  border-radius: 4px;
  font-size: 0.85rem;
  outline: none;
  background: var(--bg-input);
  color: var(--text-primary);
  transition: border-color 0.15s;
}

.minimal-input::placeholder {
  color: var(--text-muted);
}

.minimal-input:focus {
  border-color: var(--text-secondary);
}

.minimal-submit {
  padding: 0.6rem 1.25rem;
  border: 1px solid var(--border-input);
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  color: var(--text-primary);
  transition: all 0.15s;
  white-space: nowrap;
}

.minimal-submit:hover:not(:disabled) {
  background: var(--text-primary);
  color: var(--bg-card);
  border-color: var(--text-primary);
}

.minimal-submit:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
