<script setup lang="ts">
import type { Expense } from '~/types'

const store = useExpenseStore()

const emit = defineEmits<{
  edit: [expense: Expense]
}>()

// Pagination
const currentPage = ref(1)
const limit = 15

const paginatedExpenses = computed<Expense[]>(() => {
  const start = (currentPage.value - 1) * limit
  const end = currentPage.value * limit
  return store.filteredExpenses.slice(start, end)
})

const paginatedByMonth = computed<Record<string, Expense[]>>(() => {
  const expenses = {} as Record<string, Expense[]>
  const months = [...new Set(paginatedExpenses.value.map((e) => e.date))]
  months.forEach((month) => {
    expenses[month] = paginatedExpenses.value.filter((expense) => expense.date === month)
  })

  return expenses
})

const totalPages = computed<number>(() => {
  const totalExpenses = store.filteredExpenses.length
  return Math.ceil(totalExpenses / limit)
})

const paginationPages = computed<(number | string)[]>(() => {
  const pages: (number | string)[] = []
  for (let page = 1; page <= totalPages.value; page++) {
    if (
      page === 1 ||
      page === totalPages.value ||
      page === currentPage.value ||
      page === currentPage.value - 1 ||
      page === currentPage.value + 1
    ) {
      pages.push(page)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return pages
})

watch(
  store.filters,
  () => {
    currentPage.value = 1
  },
  { deep: true },
)

console.log('paginatedByMonth', paginatedByMonth.value)
console.log('total pages', totalPages.value)
</script>

<template>
  <div v-for="[month, expenses] in Object.entries(paginatedByMonth)" :key="month" class="mb-5">
    <h3 v-if="expenses.length > 0" class="title-xs">{{ store.formatDate(month) }}</h3>
    <ExpenseItem
      v-for="expense in expenses"
      :key="expense.id"
      :expense="expense"
      @edit="(expense) => emit('edit', expense)"
    />
  </div>

  <div v-if="totalPages > 1" class="flex justify-center gap-5">
    <button type="button" :disabled="currentPage === 1" @click="currentPage--">◀︎</button>
    <button
      v-for="page in paginationPages"
      :key="page"
      :disabled="page === '...'"
      type="button"
      :class="{ 'font-bold text-indigo-500': page === currentPage }"
      @click="currentPage = page"
    >
      {{ page }}
    </button>
    <button type="button" :disabled="currentPage === totalPages" @click="currentPage++">►</button>
  </div>
</template>
