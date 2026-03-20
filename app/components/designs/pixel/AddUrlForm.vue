<template>
  <div class="px-form-box">
    <div class="px-form-title">&gt; NEW TARGET _</div>
    <form class="px-form" @submit.prevent="handleSubmit">
      <input
        v-model="newUrl"
        type="text"
        class="px-input"
        placeholder="ENTER URL..."
        :disabled="adding"
      />
      <button type="submit" class="px-btn" :disabled="!newUrl.trim() || adding">
        {{ adding ? '...' : 'ADD' }}
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
.px-form-box {
  border: 3px solid #c2c3c7;
  background: #1d2b53;
  padding: 0.6rem;
  image-rendering: pixelated;
}

.px-form-title {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.55rem;
  color: #fff1e8;
  margin-bottom: 0.5rem;
  animation: px-blink-cursor 1s step-end infinite;
}

@keyframes px-blink-cursor {
  0%, 100% { opacity: 1; }
  50% { border-right-color: transparent; }
}

.px-form {
  display: flex;
  gap: 0.4rem;
}

.px-input {
  flex: 1;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.55rem;
  padding: 0.5rem;
  border: 2px solid #5f574f;
  background: #000000;
  color: #fff1e8;
  outline: none;
  image-rendering: pixelated;
}

.px-input::placeholder {
  color: #5f574f;
}

.px-input:focus {
  border-color: #29adff;
}

.px-btn {
  font-family: 'Press Start 2P', monospace;
  font-size: 0.55rem;
  padding: 0.5rem 0.8rem;
  border: 3px solid;
  border-color: #fff1e8 #5f574f #5f574f #fff1e8;
  background: #7e2553;
  color: #fff1e8;
  cursor: pointer;
  image-rendering: pixelated;
  white-space: nowrap;
  transition: none;
}

.px-btn:hover:not(:disabled) {
  background: #ff004d;
}

.px-btn:active:not(:disabled) {
  border-color: #5f574f #fff1e8 #fff1e8 #5f574f;
}

.px-btn:disabled {
  background: #5f574f;
  color: #1d2b53;
  cursor: not-allowed;
}
</style>
