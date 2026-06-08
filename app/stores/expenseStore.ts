import type { Expense, Filters, ExpenseFormData, Category, Currency, Participant, Budget, BudgetFormData } from '~/types'

export const useExpenseStore = defineStore('expenses', () => {
  // Supabase
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // On sign in an sign out
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      loadExpenses()
      loadParticipants()
      loadBudgets()
    }
    if (event === 'SIGNED_OUT') {
      expenses.value = []
      participants.value = []
      budgets.value = []
    }
  })

  //--- States
  const expenses = ref<Expense[]>([])
  const participants = ref<Participant[]>([])
  const filters = ref<Filters>({
    month: '',
    category: [],
    persons: [],
    currency: '',
  })
  const exchangeRate = ref<number>(1.09)
  const budgets = ref<Budget[]>([])
  // const selectedBudgetMonth = ref<string>('')

  // Participants Modal
  const isParticipantsOpen = ref<boolean>(false)

  // Load expenses from database
  async function loadExpenses(): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession()
    const { data, error } = await supabase.from('expenses').select('*')

    if (error) console.error('Erreur de chargement des dépenses', error)
    else expenses.value = data as Expense[]
  }

  // Load participants from database
  async function loadParticipants(): Promise<void> {
    const { data, error } = await supabase.from('participants').select('*')
    if (error) console.error('Erreur de chargement des participants', error)
    else participants.value = data as Participant[]
  }

  // Load budgets from database
  async function loadBudgets(): Promise<void> {
    const { data, error } = await supabase.from('budgets').select('*')
    if (error) console.error('Erreur de chargement de budgets', error)
    else budgets.value = data as Budget[]

    filters.value.month = monthsWithBudget.value[0] ?? ''
  }

  onMounted(async () => {
    await loadExpenses()
    await loadParticipants()
    await loadBudgets()
  })

  // Add Participants (action)
  async function addParticipant(name: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id

    const { data: newParticipant, error } = await supabase.from('participants').insert({ name, user_id: userId }).select().single()
    if (error) console.error('Erreur d\'ajout de participant', error)
    else participants.value.push(newParticipant as Participant)
  }

  // Remove Participants (action)
  async function removeParticipant(id: string): Promise<void> {
    const { error } = await supabase.from('participants').delete().eq('id', id)
    if (error) console.error('Erreur de suppression du participant', error)
    else participants.value = participants.value.filter((p) => p.id !== id)
  }

  // Update Participants (action)
  async function updateParticipant(id: string, newName: string): Promise<void> {
    const { error } = await supabase.from('participants').update({ name: newName }).eq('id', id)
    if (error) console.error('Erreur de modification du participant', error)
    else {
      const index = participants.value.findIndex((e) => e.id === id)
      if (index !== -1) participants.value[index] = { id, name: newName }
    }
  }

  // Add Expense (action)
  async function addExpense(data: ExpenseFormData): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id

    const { data: newExpense, error } = await supabase.from('expenses').insert({ ...data, user_id: userId }).select().single()
    if (error) console.error('Erreur d\'ajout de dépense', JSON.stringify(error))
    else expenses.value.push(newExpense as Expense)
  }

  // Delete Expense (action)
  async function deleteExpense(id: string): Promise<void> {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) console.error('Erreur de suppression de la dépense', error)
    else expenses.value = expenses.value.filter((e) => e.id !== id)
  }

  // Update Expense (action)
  async function updateExpense(id: string, data: ExpenseFormData): Promise<void> {
    const { error } = await supabase.from('expenses').update({ ...data }).eq('id', id)
    if (error) console.error('Erreur de mise à jour de la dépense', error)
    else {
      const index = expenses.value.findIndex((e) => e.id === id)
      if (index !== -1) expenses.value[index] = { ...data, id }
    }
  }

  // Add Budget (action)
  async function addBudget(data: BudgetFormData): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id

    const { data: newBudget, error } = await supabase.from('budgets').insert({ ...data, user_id: userId }).select().single()
    if (error) console.error('Erreur d\'ajout de budget', error)
    else budgets.value.push(newBudget as Budget)
  }

  // Delete Budget (action)
  async function deleteBudget(id: string): Promise<void> {
    const { error } = await supabase.from('budgets').delete().eq('id', id)
    if (error) console.error('Erreur de suppression du budget', error)
    else budgets.value = budgets.value.filter((e) => e.id !== id)
  }

  // Update Budget (action)
  async function updateBudget(id: string, data: BudgetFormData): Promise<void> {
    const { error } = await supabase.from('budgets').update({ ...data }).eq('id', id)
    if (error) console.error('Erreur de mise à jour de budget', error)
    else {
      const index = budgets.value.findIndex((e) => e.id === id)
      if (index !== -1) budgets.value[index] = { ...data, id }
    }
  }

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
    filters.value.month = filters.value.month
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

  //-- Budget
  const budgetsForMonth = computed(() => {
    return budgets.value.filter((b) => b.month === filters.value.month)
  })

  function getBudgetForParticipant(participantId: string, month: string): Budget | undefined {
    return budgets.value.find((b) => b.participant_id === participantId && b.month === month)
  }

  const monthsWithBudget = computed<string[]>(() => {
    const months = new Set(budgets.value.map((b) => b.month))
    return [...months].sort().reverse()
  })

  // watch(() => filteredExpenses, (val) => {
  //   console.log('filteredExpenses', val)
  // }, { immediate: true })

  // Get Expenses for each Participant
  const expensesByParticipant = computed<Record<string, number>>(() => {
    const total = {} as Record<string, number>

    filteredExpenses.value.forEach((expense) => {
      expense.persons.forEach((personId) => {
        if (!total[personId]) total[personId] = 0

        let amount = getFilteredAmount(expense)
        if (expense.currency === 'EUR') {
          amount = amount / exchangeRate.value
        }

        total[personId] += amount
      })
    });

    return total
  })


  return {
    // States
    expenses,
    filters,
    participants,
    budgets,
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
    updateParticipant,
    resetFilters,
    formatDate,
    addBudget,
    deleteBudget,
    updateBudget,
    // Computed
    filteredExpenses,
    availableMonths,
    finalTotal,
    expensesByMonth,
    categoryExpenses,
    getDisplayCurrency,
    budgetsForMonth,
    monthsWithBudget,
    getBudgetForParticipant,
    expensesByParticipant
  }
})
