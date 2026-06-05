<script setup lang="ts">
import type { Participant, BudgetFormData, Currency } from '~/types' 
const store = useExpenseStore()

const selectedMonth = ref<string>('')
const budgetData = ref<Record<string, { amount: number, currency: Currency }>>({})
const errors = reactive<Partial<Record<keyof BudgetFormData, string>>>({})

const emit = defineEmits<{
  close: []
}>()

function initBudgetData(): void {
  store.participants.forEach((participant) => {
    const existing = store.getBudgetForParticipant(participant.id, selectedMonth.value)
    budgetData.value[participant.id] = {
      amount: existing ? existing.amount : 0,
      currency: existing ? existing.currency : 'CHF'
    }
  })
}

watch(selectedMonth, initBudgetData, { immediate: true })

// Form Validation
function validate(): boolean {
  if (!selectedMonth.value) {
    errors.month = 'Choisis une date pour ton budget'
    return false
  }
  return true
}

async function handleSave(): Promise<void> {
  if (!validate()) return
  delete errors.month

  store.participants.forEach((participant) => {
    const participantBudget = store.getBudgetForParticipant(participant.id, selectedMonth.value)
    const data = budgetData.value[participant.id]
    if (!data) return

    if (participantBudget === undefined) {
      store.addBudget({
        participant_id: participant.id,
        month: selectedMonth.value,
         ...data
      })
    } else {
      const id = participantBudget.id
      store.updateBudget(id, {
        participant_id: participant.id,
        month: selectedMonth.value,
         ...data
      })
    }
  })

  emit('close')
}
</script>

<template>
  <div class="form">
    <form @submit.prevent="handleSave">
      <div>
        <label for="budget-date" class="label">Date</label>
        <input
          type="month"
          id="budget-date"
          :class="['input', { 'field-error': errors.month }]"
          v-model="selectedMonth"
        />
        <p v-if="errors.month" class="error">{{ errors.month }}</p>
      </div>

      <div v-for="participant in store.participants" :key="participant.id">
        <p>{{ participant.name }}</p>

        <div class="flex gap-5">
          <div class="mt-5 w-3/5">
            <label :for="`budget-amount-${participant.id}`" class="label">Montant</label>
            <input
              type="number"
              step="0.01"
              placeholder="0"
              :id="`budget-amount-${participant.id}`"
              :class="['input', { 'field-error': errors.amount }]"
              v-model.number="budgetData[participant.id]!.amount"
            />
            <p v-if="errors.amount" class="error">{{ errors.amount }}</p>
          </div>
          <div class="mt-5 w-2/5">
            <label :for="`budget-currency-${participant.id}`" class="label">Devise</label>
            <select :id="`budget-currency-${participant.id}`" class="select" v-model="budgetData[participant.id]!.currency">
              <option value="CHF">CHF</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
      </div>

      <button type="submit" class="button">Ajouter</button>
    </form>
  </div>
</template>