import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  css: ['~/assets/main.css'],
  vite: {
    plugins: [tailwindcss()],
  }
})