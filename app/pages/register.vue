<script setup lang="ts">
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';

definePageMeta({
  layout: 'auth'
})

const supabase = useSupabaseClient()
const router = useRouter()
const form = reactive({ email: '', password: '', confirmPassword: '', name: '' })
const registerError = ref<string>('')
const captchaToken = ref<string>('')
const config = useRuntimeConfig()

function onCaptchaVerify(token: string): void {
  captchaToken.value = token
}

async function handleRegister(): Promise<void> {
  if(form.password.length < 5) {
    registerError.value = 'Le mot de passe doit contenir au moins 5 caractères'
    return
  }

  if(form.password !== form.confirmPassword) {
    registerError.value = 'Les mots de passe ne correspondent pas'
    return
  }
  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: { display_name: form.name },
      captchaToken: config.public.captchaEnabled === 'true' ? captchaToken.value : undefined
    }
  })
  if (error) {
    registerError.value = error.message
  } else {
    const { error: participantError} = await supabase.from('participants').insert({
      name: form.name,
      user_id: data.user?.id
    })
    if (participantError) console.error('Erreur de création de participant', participantError)
    router.push('/login?registered=true')
  }
}
</script>

<template>
  <div class="min-h-screen font-sans bg-gray-950 text-sky-100 flex justify-center items-center">
    <div>
      <h1 class="mb-3 text-xl font-black text-center">BUDGET TRACKER</h1>
      <h2 class="mb-5 title-sm text-center">Crée ton compte</h2>
      <div class="box w-md max-w-[100%]">
        <form @submit.prevent="handleRegister">
          <div>
            <label class="label">Nom complet</label>
            <input type="text" placeholder="Nom complet" class="input" v-model="form.name" />
          </div>
          <div class="mt-5">
            <label class="label">E-mail</label>
            <input type="email" placeholder="E-mail" class="input" v-model="form.email" />
          </div>
          <div class="mt-5">
            <label class="label">Mot de passe</label>
            <input type="password" placeholder="Mot de passe" class="input" v-model="form.password" />
          </div>
          <div class="mt-5">
            <label class="label">Confirmation de votre mot de passe</label>
            <input type="password" placeholder="Confirmation" class="input" v-model="form.confirmPassword" />
          </div>

          <div v-if="config.public.captchaEnabled === 'true'" class="mt-5 flex justify-center">
            <VueHcaptcha :sitekey="config.public.hcaptchaSitekey" @verify="onCaptchaVerify"></VueHcaptcha>
          </div>

          <p v-if="registerError" class="error text-center">{{ registerError }}</p>

          <div class="mt-5 flex gap-5 justify-center items-center">
            <button type="submit" class="button">S'inscrire</button>
          </div>
        </form>
      </div>

      <div class="mt-3 text-center">
        <NuxtLink to="/login" class="link">J'ai déjà un compte</NuxtLink>
      </div>
    </div>
  </div>
</template>