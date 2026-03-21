<template>
  <form class="icon-form" @submit.prevent="handleSubmit">
    <input
      v-model="newUrl"
      type="text"
      class="icon-input"
      placeholder="+ Add URL..."
      :disabled="adding"
    />
    <button v-if="newUrl.trim()" type="submit" class="icon-submit" :disabled="adding">
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
.icon-form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.icon-input {
  flex: 1;
  padding: 0.6rem 0.85rem;
  border: none;
  border-bottom: 2px solid var(--border-input);
  border-radius: 0;
  font-size: 0.9rem;
  outline: none;
  background: transparent;
  color: var(--text-primary);
  transition: border-color 0.2s;
}

.icon-input::placeholder {
  color: var(--text-muted);
}

.icon-input:focus {
  border-bottom-color: #6366f1;
}

.icon-submit {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  background: #6366f1;
  color: white;
  transition: all 0.2s;
}

.icon-submit:hover:not(:disabled) {
  background: #4f46e5;
}

.icon-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
