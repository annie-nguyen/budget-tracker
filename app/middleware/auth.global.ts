export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  if (!user.value && !to.path.includes('/login') && !to.path.includes('/register')) {
    return navigateTo('/login')
  }
})