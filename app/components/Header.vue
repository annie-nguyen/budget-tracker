<script setup lang="ts">
const store = useExpenseStore()
const isDark = ref(true)

// App Theme apperance
function toggleTheme(): void {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<template>
  <header class="px-10 py-5 flex justify-between items-center border-b-1 dark:border-gray-800 border-slate-200">
    <h1 class="text-xl font-bold uppercase">
      <span class="inline-block text-center border dark:border-gray-700 border-slate-300 rounded-full size-[30px]"
        >💰</span
      >
      Budget Tracker
    </h1>

    <div class="flex gap-5">
      <button type="button" class="button" @click="store.isParticipantsOpen = true">
        👤 Participants
      </button>
      <button type="button" @click="toggleTheme()">
        <span v-if="isDark">🌖</span>
        <span v-else>🌒</span>
      </button>
    </div>
  </header>
</template>

<style scoped></style>
