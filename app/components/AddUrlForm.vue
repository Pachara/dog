<template>
  <form class="add-form" @submit.prevent="handleSubmit">
    <input
      v-model="newUrl"
      type="text"
      class="url-input"
      placeholder="Enter a URL to monitor (e.g. example.com)"
      :disabled="adding"
    />
    <button type="submit" class="btn btn-primary" :disabled="!newUrl.trim() || adding">
      {{ adding ? 'Adding...' : 'Add' }}
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
.add-form {
  display: flex;
  gap: 0.5rem;
}

.url-input {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border-input);
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s, background 0.3s, color 0.3s;
  background: var(--bg-input);
  color: var(--text-primary);
}

.url-input::placeholder {
  color: var(--text-muted);
}

.url-input:focus {
  border-color: #2563eb;
}
</style>
