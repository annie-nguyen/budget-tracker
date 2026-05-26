import type { Category } from '~/types'

export const CATEGORY_META: Record<Category, { emoji: string; color: string }> = {
  courses: { emoji: '🛒', color: '#4ade80' },
  transport: { emoji: '🚗', color: '#60a5fa' },
  logement: { emoji: '🏠', color: '#f97316' },
  santé: { emoji: '❤️‍🩹', color: 'f43f5e' },
  loisirs: { emoji: '🎢', color: '#a78bfa' },
  shopping: { emoji: '🛍️', color: '#fb7185' },
  restaurant: { emoji: '🍽️', color: '#fbbf24' },
  verres: { emoji: '🍻', color: '#ee81c1' },
  voyages: { emoji: '🌍', color: '#34d399' },
  abonnements: { emoji: '💳', color: '#38bdf8' },
  appart: { emoji: '🛋️', color: '#b894ad' },
  divers: { emoji: '💸', color: '#94a3b8' },
}
