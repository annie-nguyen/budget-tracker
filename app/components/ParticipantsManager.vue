<script setup lang="ts">
import type { Participant } from '~/types' 
const store = useExpenseStore()
const newName = ref('')
const editedName = ref('')
const editingId = ref<string | null>(null)

function handleAdd(): void {
  if (!newName.value.trim()) return
  store.addParticipant(newName.value.trim())
  // Clear input
  newName.value = ''
}

function handleUpdate(): void {
  if (!editingId.value) return
  store.updateParticipant(editingId.value, editedName.value.trim())
  editingId.value = null
}

function handleEdit(participant: Participant): void {
  editingId.value = participant.id
  editedName.value = participant.name
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
      :key="participant.id"
      class="py-2 flex justify-between items-center gap-3 border-t-1 dark:border-slate-700 border-slate-200"
    >
      <form @submit.prevent="handleUpdate" v-if="editingId === participant.id" class="flex items-center gap-3 w-full">
        <input type="text" v-model="editedName" class="input mt-0" />
        <button type="submit" class="button-xs">Modifier</button>
      </form>
      <p v-else>{{ participant.name }}</p>
      <div v-if="!editingId" class="flex gap-3">
        <button type="button" @click="handleEdit(participant)" class="button-xs">✏️</button>
        <button type="button" @click="store.removeParticipant(participant.id)" class="button-xs">Supprimer</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
