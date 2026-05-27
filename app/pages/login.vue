<script setup lang="ts">
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';

definePageMeta({
  layout: 'auth'
})

const supabase = useSupabaseClient()
const router = useRouter()
const route = useRoute()
const form = reactive({ email: '', password: '' })
const loginError = ref<string>('')
const captchaToken = ref<string>('')
const config = useRuntimeConfig()

function onCaptchaVerify(token: string): void {
  captchaToken.value = token
}

async function handleLogin(): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password, options: { captchaToken: config.public.captchaEnabled === 'true' ? captchaToken.value : undefined } })
  if (error) loginError.value = error.message
  else router.push('/')
}
</script>

<template>
  <div class="min-h-screen font-sans bg-gray-950 text-sky-100 flex justify-center items-center">
    <div>
      <h1 class="mb-3 text-xl font-black text-center">BUDGET TRACKER</h1>
      <h2 class="mb-5 title-sm text-center">Connexion</h2>

      <div class="box w-md max-w-[100%]">
        <form @submit.prevent="handleLogin">
          <div v-if="route.query.registered === 'true'" class="mb-5">
            <p class="text-center">Ton compte a été créé !<br /> Tu peux maintenant te connecter</p>
          </div>
          <div>
            <label class="label">E-mail</label>
            <input type="email" placeholder="E-mail" class="input" v-model="form.email" />
          </div>
          <div class="mt-5">
            <label class="label">Mot de passe</label>
            <input type="password" placeholder="Mot de passe" class="input" v-model="form.password" />
          </div>

          <div v-if="config.public.captchaEnabled === 'true'" class="mt-5 flex justify-center">
            <VueHcaptcha :sitekey="config.public.hcaptchaSitekey" @verify="onCaptchaVerify"></VueHcaptcha>
          </div>

          <p v-if="loginError" class="error text-center">{{ loginError }}</p>

          <div class="mt-5 flex gap-5 justify-center items-center">
            <button type="submit" class="button">Se connecter</button>
          </div>
        </form>
      </div>
      
      <div class="mt-3 text-center">
        <NuxtLink to="/register" class="link">Créer un compte</NuxtLink>
      </div>
    </div>
  </div>
</template>