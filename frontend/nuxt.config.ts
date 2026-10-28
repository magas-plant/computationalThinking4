import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['shadcn-nuxt'],
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    // Workaround: auf Windows wird nuxt/dist im Dev-Server sonst externalisiert,
    // dann findet der Renderer kein Client-Manifest
    externals: {
      inline: [/[\\/]nuxt[\\/]dist[\\/]/],
    },
  },
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
})
