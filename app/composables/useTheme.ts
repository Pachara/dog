const STORAGE_KEY = 'dog-theme'

export function useTheme() {
  const isDark = useState('theme-dark', () => true)

  function loadTheme() {
    if (import.meta.server) return
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) {
      isDark.value = saved === 'dark'
    }
    applyTheme()
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    if (!import.meta.server) {
      localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    }
    applyTheme()
  }

  function applyTheme() {
    if (import.meta.server) return
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  }

  return {
    isDark: readonly(isDark),
    loadTheme,
    toggleTheme,
  }
}
