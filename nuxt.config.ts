import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxtjs/supabase'],
  css: ['~/assets/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  supabase: {
    redirect: false
  },
  runtimeConfig: {
    public: {
      hcaptchaSitekey: '',
      captchaEnabled: 'false'
    }
  }
})