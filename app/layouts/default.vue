<script setup lang="ts">
const store = useExpenseStore()
</script>

<template>
  <div class="min-h-screen font-sans bg-neutral-100 dark:bg-gray-950 dark:text-sky-100 text-slate-800">
    <Header />

    <slot />
  </div>
</template>

<style scoped></style>
