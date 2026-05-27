<script setup lang="ts">
import type { Expense } from '~/types'

const store = useExpenseStore()
const expenseFormRef = ref<InstanceType<typeof ExpenseForm> | null>(null)

onMounted(() => {
  store.fetchExchangeRate()
})

// Form
const isFormOpen = ref(false)
async function handleEdit(expense: Expense): Promise<void> {
  isFormOpen.value = true
  await nextTick()
  expenseFormRef.value?.openForEdit(expense)
}

</script>

<template>
  <div class="px-10 pt-10 pb-20 flex gap-5">
    <aside class="w-1/4">
      <FiltersBar />
    </aside>

    <main class="flex gap-5 w-3/4">
      <div class="w-4/6">
        <div class="flex justify-between items-center mb-2">
          <p class="title-sm">
            {{ store.filteredExpenses.length }}
            {{ store.filteredExpenses.length > 1 ? `dépenses` : `dépense` }}
          </p>
          <button @click="isFormOpen = true" class="button">+ Ajouter une dépense</button>
        </div>

        <p v-if="store.filteredExpenses.length === 0" class="text-sm italic text-slate-600">
          Ajoute des dépenses
        </p>
        <ExpensesList v-else @edit="handleEdit" />

        <div v-if="store.filteredExpenses.length > 5" class="flex justify-end">
          <button @click="isFormOpen = true" class="button">+ Ajouter une dépense</button>
        </div>
      </div>

      <div class="w-2/6">
        <ExpenseSummary />
      </div>
    </main>
  </div>

  <Modal v-if="store.isParticipantsOpen" @close="store.isParticipantsOpen = false">
    <template #header>Gérer les participants</template>
    <ParticipantsManager />
  </Modal>

  <Modal v-if="isFormOpen" @close="isFormOpen = false">
    <template #header>Dépense</template>
    <ExpenseForm ref="expenseFormRef" @close="isFormOpen = false" />
  </Modal>
</template>

<style scoped></style>
