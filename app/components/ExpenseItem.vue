<script setup lang="ts">
import type { Expense } from '~/types'
import { CATEGORY_META } from '~/utils/categories'

const store = useExpenseStore()

interface Props {
  expense: Expense
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [expense: Expense]
}>()

// Expense qmount
const expenseAmount = computed<number>(() => {
  const displayAmount = store.getFilteredAmount(props.expense)
  if (props.expense.currency === 'CHF') {
    return displayAmount
  } else {
    return displayAmount / store.exchangeRate
  }
})

  console.log('persons', props.expense.persons)
  console.log('participants', store.participants)
</script>

<template>
  <div
    class="box group relative overflow-hidden hover:cursor-pointer"
    @click="emit('edit', expense)"
  >
    <div class="flex justify-between gap-5">
      <div class="flex items-center gap-3">
        <span
          class="absolute top-0 left-0 block w-[3px] h-full rounded-sm"
          :style="{ background: CATEGORY_META[expense.category].color }"
        ></span>
        <span class="text-2xl">{{ CATEGORY_META[expense.category].emoji }}</span>
        <div>
          <p>{{ expense.label }}</p>
          <div class="flex gap-2">
            <p class="text-sm text-slate-500">{{ expense.category }}</p>
            ·
            <p class="text-sm text-slate-500">👥 {{ expense.persons.map(id => store.participants.find(p => p.id === id)?.name).join(', ') }}</p>
          </div>
        </div>
      </div>

      <div class="text-right">
        <p class="font-semibold">
          {{ store.getDisplayCurrency(expenseAmount).primary.toFixed(2) }}
          {{ store.getDisplayCurrency(expenseAmount).primaryCurrency }}
        </p>
        <p class="text-xs text-slate-500">
          {{ store.getDisplayCurrency(expenseAmount).secondary.toFixed(2) }}
          {{ store.getDisplayCurrency(expenseAmount).secondaryCurrency }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
