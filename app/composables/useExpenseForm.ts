import type { Expense, ExpenseFormData } from '~/types'
import { CATEGORIES } from '~/types'

export function useExpenseForm() {
  //-- States
  const store = useExpenseStore()
  const editingId = ref<string | null>(null)
  const form = reactive<ExpenseFormData>({
    label: '',
    amount: 0,
    currency: 'CHF',
    category: CATEGORIES[0],
    date: '',
    persons: store.participants.map(p => p.id),
    note: '',
  })
  const errors = reactive<Partial<Record<keyof ExpenseFormData, string>>>({})

  //-- Actions

  // Form Validation
  function validate(): boolean {
    Object.keys(errors).forEach((key) => delete errors[key as keyof ExpenseFormData])

    if (!form.label.trim()) {
      errors.label = 'Donne un nom à ta dépense'
    }

    if (!form.amount || form.amount <= 0) {
      errors.amount = 'Entre un montant positif à ta dépense'
    }

    if (!form.date.trim()) {
      errors.date = 'Choisis une date pour ta dépense'
    }

    if (form.persons.length === 0) {
      errors.persons = 'Choisis au moins un participant'
    }

    return Object.keys(errors).length === 0
  }

  // On Form Submit
  function submitForm(): boolean {
    if (!validate()) return false

    if (editingId.value) {
      store.updateExpense(editingId.value, form)
    } else {
      store.addExpense(form)
    }

    return true
  }

  function openForEdit(expense: Expense): void {
    editingId.value = expense.id
    Object.assign(form, {
      label: expense.label,
      amount: expense.amount,
      currency: expense.currency,
      category: expense.category,
      date: expense.date,
      persons: expense.persons,
      note: expense.note ?? '',
    })
  }

  return {
    editingId,
    form,
    errors,
    validate,
    submitForm,
    openForEdit,
  }
}
