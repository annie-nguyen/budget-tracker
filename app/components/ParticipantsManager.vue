<script setup lang="ts">
const store = useExpenseStore()
const newName = ref('')

function handleAdd(): void {
  if (!newName.value.trim()) return
  store.addParticipant(newName.value.trim())
  // Clear input
  newName.value = ''
}
</script>

<template>
  <div class="participants-form">
    <form @submit.prevent="handleAdd">
      <div class="flex gap-5">
        <input type="text" placeholder="Nom participant" class="input" v-model="newName" />
        <button type="submit" class="button">Ajouter</button>
      </div>
    </form>
  </div>
  <div class="mt-5">
    <div
      v-for="participant in store.participants"
      :key="participant"
      class="py-2 flex justify-between items-center gap-3 border-t-1 dark:border-slate-700 border-slate-200"
    >
      <p>{{ participant }}</p>
      <button @click="store.removeParticipant(participant)" class="button-xs">Supprimer</button>
    </div>
  </div>
</template>

<style scoped></style>
