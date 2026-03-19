<template>
  <div class="retro-form-wrapper">
    <div class="retro-title-bar">
      <span class="retro-title-text">&#128187; Add New URL</span>
    </div>
    <form class="retro-form" @submit.prevent="handleSubmit">
      <label class="retro-label">Enter URL:</label>
      <input
        v-model="newUrl"
        type="text"
        class="retro-input"
        placeholder="http://www.example.com"
        :disabled="adding"
      />
      <button type="submit" class="retro-btn" :disabled="!newUrl.trim() || adding">
        {{ adding ? '* ADDING *' : '>> ADD URL <<' }}
      </button>
    </form>
  </div>
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
.retro-form-wrapper {
  border: 3px outset #c0c0c0;
  background: #c0c0c0;
}

.retro-title-bar {
  background: linear-gradient(90deg, #000080, #1084d0);
  color: white;
  padding: 0.2rem 0.4rem;
  font-family: 'Comic Sans MS', 'Chalkboard SE', cursive;
  font-size: 0.8rem;
  font-weight: 700;
}

.retro-form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.6rem;
  background: #c0c0c0;
  flex-wrap: wrap;
}

.retro-label {
  font-family: 'Comic Sans MS', 'Chalkboard SE', cursive;
  font-size: 0.85rem;
  font-weight: 700;
  color: #000000;
}

.retro-input {
  flex: 1;
  min-width: 200px;
  padding: 0.3rem 0.5rem;
  border: 2px inset #c0c0c0;
  background: #ffffff;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #000000;
  outline: none;
}

.retro-btn {
  padding: 0.35rem 1rem;
  border: 3px outset #c0c0c0;
  background: #c0c0c0;
  font-family: 'Comic Sans MS', 'Chalkboard SE', cursive;
  font-size: 0.8rem;
  font-weight: 700;
  color: #000000;
  cursor: pointer;
  white-space: nowrap;
}

.retro-btn:hover:not(:disabled) {
  background: #d4d4d4;
}

.retro-btn:active:not(:disabled) {
  border-style: inset;
}

.retro-btn:disabled {
  color: #808080;
  cursor: not-allowed;
}
</style>
