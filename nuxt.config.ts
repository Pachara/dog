// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/fonts'],

  // Self-host fonts (replaces Google CDN link)
  fonts: {
    families: [
      { name: 'Press Start 2P', provider: 'google' },
    ],
  },

  // Smooth transitions between design themes
  experimental: {
    viewTransition: true,
  },
})
