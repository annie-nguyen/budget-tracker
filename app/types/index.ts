export const CURRENCIES = ['CHF', 'EUR'] as const
export type Currency = (typeof CURRENCIES)[number]

export const CATEGORIES = [
  'courses',
  'transport',
  'logement',
  'santé',
  'loisirs',
  'shopping',
  'restaurant',
  'verres',
  'voyages',
  'abonnements',
  'appart',
  'divers',
] as const

export type Category = (typeof CATEGORIES)[number]

export interface Expense {
  id: string
  label: string
  amount: number
  currency: Currency
  category: Category
  date: string
  persons: string[]
  note?: string
}

export type ExpenseFormData = Omit<Expense, 'id'>

export interface Filters {
  month: string
  category: Category[]
  persons: string[]
  currency: Currency | ''
}

export interface Participant {
  id: string
  name: string
}


