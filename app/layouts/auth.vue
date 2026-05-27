<script setup lang="ts">
onMounted(() => {
  document.documentElement.classList.add('dark')
})
</script>

<template>
  <div class="min-h-screen font-sans bg-neutral-100 dark:bg-gray-950 dark:text-sky-100 text-slate-800">
    <slot />
  </div>
</template>

<style scoped></style>
