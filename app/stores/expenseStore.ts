import type { Expense, Filters, ExpenseFormData, Category, Currency } from '~/types'

export const useExpenseStore = defineStore('expenses', () => {
  // Participants Modal
  const isParticipantsOpen = ref<boolean>(false)

  // Load expense from local storage
  function loadFromStorage(): Expense[] {
    if (!import.meta.client) return []
    const raw = localStorage.getItem('budget-expenses')
    return raw ? (JSON.parse(raw) as Expense[]) : []
  }

  function loadParticipantsFromStorage(): string[] {
    if (!import.meta.client) return []
    const participant = localStorage.getItem('budget-participants')
    return participant ? JSON.parse(participant) : []
  }

  // States
  const expenses = ref<Expense[]>([])
  const filters = ref<Filters>({
    month: '',
    category: [],
    persons: [],
    currency: '',
  })
  const participants = ref<string[]>([])
  const exchangeRate = ref<number>(1.09)

  onMounted(() => {
    expenses.value = loadFromStorage()
    participants.value = loadParticipantsFromStorage()

    // Watch expenses changes and update budget-expenses in local storage
    watch(
      expenses,
      (newValue) => {
        localStorage.setItem('budget-expenses', JSON.stringify(newValue))
      },
      { deep: true },
    )

    // Watch participants changes and update budget-participants in local storage
    watch(
      participants,
      (newValue) => {
        localStorage.setItem('budget-participants', JSON.stringify(newValue))
      },
      { deep: true },
    )
  })

  // Taux
  interface ExchangeRateResponse {
    base: string
    rates: {
      EUR: number
      [key: string]: number
    }
  }

  async function fetchExchangeRate(): Promise<void> {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/CHF')
      const data = (await response.json()) as ExchangeRateResponse
      exchangeRate.value = data.rates.EUR
    } catch (error) {
      console.error('Impossible de récupérer le taux de change', error)
    }
  }

  // Add Participants (action)
  function addParticipant(name: string): void {
    participants.value.push(name)
  }

  // Remove Participants (action)
  function removeParticipant(name: string): void {
    participants.value = participants.value.filter((e) => e != name)
  }

  // Add Expense (action)
  function addExpense(data: ExpenseFormData): void {
    const newExpense: Expense = {
      ...data,
      id: crypto.randomUUID(),
    }
    expenses.value.push(newExpense)
  }

  // Delete Expense (action)
  function deleteExpense(id: string): void {
    expenses.value = expenses.value.filter((e) => e.id !== id)
  }

  // Update Expense (action)
  function updateExpense(id: string, data: ExpenseFormData): void {
    const index = expenses.value.findIndex((e) => e.id === id)
    if (index !== -1) {
      expenses.value[index] = { ...data, id }
    }
  }

  // Get Amount by person
  function getFilteredAmount(expense: Expense): number {
    if (filters.value.persons.length > 0) {
      return expense.amount / expense.persons.length
    } else {
      return expense.amount
    }
  }

  // Reset Filters
  function resetFilters(): void {
    filters.value.month = ''
    filters.value.category = []
    filters.value.persons = []
    filters.value.currency = ''
  }

  // Format Date
  function formatDate(date: string): string {
    const d = new Date(date + '-01')
    const formatedDate = new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric',
    }).format(d)
    return formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1)
  }

  //-- Computed
  // Filtered Expenses
  const filteredExpenses = computed<Expense[]>(() => {
    return expenses.value
      .filter((expense) => {
        if (filters.value.month && expense.date !== filters.value.month) return false
        if (filters.value.category.length > 0 && !filters.value.category.includes(expense.category))
          return false
        if (
          filters.value.persons.length > 0 &&
          !expense.persons.some((p) => filters.value.persons.includes(p))
        )
          return false
        return true
      })
      .sort((a, b) => {
        if (a.date !== b.date) {
          return b.date.localeCompare(a.date)
        } else {
          return expenses.value.indexOf(b) - expenses.value.indexOf(a)
        }
      })
  })

  // Months list
  const availableMonths = computed<string[]>(() => {
    const months = new Set(expenses.value.map((e) => e.date))
    return [...months].sort().reverse()
  })

  // Total Expenses
  const finalTotal = computed<number>(() => {
    return filteredExpenses.value.reduce((sum, expense) => {
      const amount = getFilteredAmount(expense)
      if (expense.currency === 'CHF') {
        return sum + amount
      } else {
        return sum + amount / exchangeRate.value
      }
    }, 0)
  })

  // Expenses by Month
  const expensesByMonth = computed<Record<string, Expense[]>>(() => {
    const expenses = {} as Record<string, Expense[]>
    availableMonths.value.forEach((month) => {
      expenses[month] = filteredExpenses.value.filter((expense) => expense.date === month)
    })
    return expenses
  })

  // Expenses by category
  const categoryExpenses = computed<Record<Category, number>>(() => {
    const totals = {} as Record<Category, number>

    filteredExpenses.value.forEach((expense) => {
      const amount = getFilteredAmount(expense)
      if (!totals[expense.category]) {
        totals[expense.category] = 0
      }
      if (expense.currency === 'CHF') {
        totals[expense.category] += amount
      } else {
        totals[expense.category] += amount / exchangeRate.value
      }
    })

    return totals
  })

  // Display Currency
  function getDisplayCurrency(amount: number): {
    primary: number
    primaryCurrency: Currency
    secondary: number
    secondaryCurrency: Currency
  } {
    if (filters.value.currency === 'EUR') {
      return {
        primary: amount * exchangeRate.value,
        primaryCurrency: 'EUR',
        secondary: amount,
        secondaryCurrency: 'CHF',
      }
    } else {
      return {
        primary: amount,
        primaryCurrency: 'CHF',
        secondary: amount * exchangeRate.value,
        secondaryCurrency: 'EUR',
      }
    }
  }

  return {
    // States
    expenses,
    filters,
    participants,
    exchangeRate,
    isParticipantsOpen,
    // Actions
    fetchExchangeRate,
    addExpense,
    deleteExpense,
    updateExpense,
    getFilteredAmount,
    addParticipant,
    removeParticipant,
    resetFilters,
    formatDate,
    // Computed
    filteredExpenses,
    availableMonths,
    finalTotal,
    expensesByMonth,
    categoryExpenses,
    getDisplayCurrency,
  }
})
