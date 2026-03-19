import type { Component } from 'vue'
import { designRegistry, type DesignComponents } from '~/components/designs/registry'

export interface DesignMeta {
  id: string
  label: string
  description: string
}

const STORAGE_KEY = 'dog-design'

// --- Design Metadata ---
// To add a new design: add an entry here + register components in designs/registry.ts
const designs: DesignMeta[] = [
  { id: 'classic', label: 'Classic', description: 'Clean cards with left-border status indicators' },
  { id: 'modern', label: 'Modern', description: 'Minimalist rounded cards with gradient accents' },
]

export function useDesign() {
  const currentDesign = useState('current-design', () => 'classic')

  const currentComponents = computed<DesignComponents>(() => {
    return designRegistry[currentDesign.value] ?? designRegistry.classic
  })

  function loadDesign() {
    if (import.meta.server) return
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && designs.some(d => d.id === saved)) {
      currentDesign.value = saved
    }
  }

  function setDesign(id: string) {
    if (!designs.some(d => d.id === id)) return
    currentDesign.value = id
    if (!import.meta.server) {
      localStorage.setItem(STORAGE_KEY, id)
    }
  }

  function nextDesign() {
    const idx = designs.findIndex(d => d.id === currentDesign.value)
    const next = designs[(idx + 1) % designs.length]
    setDesign(next.id)
  }

  return {
    currentDesign: readonly(currentDesign),
    currentComponents,
    designs,
    loadDesign,
    setDesign,
    nextDesign,
  }
}
