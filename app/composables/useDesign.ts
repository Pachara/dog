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
  { id: 'retro90', label: 'Retro 90s', description: 'Classic 1990s web with neon colors, beveled borders, and marquee' },
  { id: 'pixel', label: 'Pixel', description: '8-bit retro gaming with pixel fonts, health bars, and NES aesthetics' },
  { id: 'card', label: 'Card', description: 'Elevated cards with shadows, generous spacing, and smooth hover animations' },
  { id: 'icon', label: 'Icon', description: 'App-style favicon grid like iOS home screen' },
  { id: 'terminal', label: 'Terminal', description: 'Hacker CLI aesthetic with green-on-black monospace and scanlines' },
  { id: 'glassmorphism', label: 'Glass', description: 'Frosted glass cards with blur backdrop and translucent layers' },
  { id: 'cyberpunk', label: 'Cyberpunk', description: 'Neon-lit futuristic HUD with angular cuts and glitch effects' },
  { id: 'minimal', label: 'Minimal', description: 'Ultra-clean typography-focused design with generous whitespace' },
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
    const apply = () => {
      currentDesign.value = id
      if (!import.meta.server) {
        localStorage.setItem(STORAGE_KEY, id)
      }
    }
    // Use View Transitions API for smooth design switching
    if (!import.meta.server && (document as any).startViewTransition) {
      (document as any).startViewTransition(apply)
    } else {
      apply()
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
