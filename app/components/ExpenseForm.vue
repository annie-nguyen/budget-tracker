<script setup lang="ts">
import { CATEGORIES } from '~/types'
import { CATEGORY_META } from '~/utils/categories'

const store = useExpenseStore()
const { form, errors, submitForm, openForEdit, editingId } = useExpenseForm()

const emit = defineEmits<{
  close: []
}>()

function handleSubmit(): void {
  if (submitForm()) emit('close')
}

function handleDelete(): void {
  if (!editingId.value) return
  store.deleteExpense(editingId.value)
  emit('close')
}

defineExpose({ openForEdit })
</script>

<template>
  <div class="form">
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="expense-name" class="label">Dépense</label>
        <input
          type="text"
          placeholder="Dépense"
          id="expense-name"
          :class="['input', { 'field-error': errors.label }]"
          v-model="form.label"
        />
        <p v-if="errors.label" class="error">{{ errors.label }}</p>
      </div>
      <div class="flex gap-5">
        <div class="mt-5 w-3/5">
          <label for="expense-amount" class="label">Montant</label>
          <input
            type="number"
            step="0.01"
            placeholder="0"
            id="expense-amount"
            :class="['input', { 'field-error': errors.label }]"
            v-model.number="form.amount"
          />
          <p v-if="errors.amount" class="error">{{ errors.amount }}</p>
        </div>
        <div class="mt-5 w-2/5">
          <label for="expense-currency" class="label">Devise</label>
          <select id="expense-currency" class="select" v-model="form.currency">
            <option value="CHF">CHF</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>
      <div class="mt-5">
        <label for="expense-caterory" class="label">Categorie</label>
        <select id="expense-category" class="select" v-model="form.category">
          <option v-for="category in CATEGORIES" :key="category" :value="category">
            {{ CATEGORY_META[category].emoji }} {{ category }}
          </option>
        </select>
      </div>
      <div class="mt-5">
        <label for="expense-date" class="label">Date</label>
        <input
          type="month"
          id="expense-date"
          :class="['input', { 'field-error': errors.label }]"
          v-model="form.date"
        />
        <p v-if="errors.date" class="error">{{ errors.date }}</p>
      </div>
      <div class="mt-5">
        <label class="label">Participants</label>
        <div class="flex gap-5">
          <div v-for="participant in store.participants" :key="participant.id">
            <label :for="`expense-persons-${participant.name.toLowerCase()}`" class="checkbox">
              <input
                type="checkbox"
                :id="`expense-persons-${participant.name.toLowerCase()}`"
                :value="participant.id"
                v-model="form.persons"
              />
              <span class="check"></span>
              {{ participant.name }}
            </label>
          </div>
        </div>
        <p v-if="errors.persons" class="error">{{ errors.persons }}</p>
      </div>

      <div class="mt-10 flex justify-center items-center gap-5">
        <button v-if="editingId" type="button" class="button btn-delete" @click.stop="handleDelete">
          Supprimer
        </button>
        <button type="button" class="button-border" @click="emit('close')">Annuler</button>
        <button type="submit" class="button">
          <span v-if="editingId">Modifier</span>
          <span v-else>+ Ajouter</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
