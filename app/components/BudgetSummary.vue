<script setup lang="ts">
const { onEnter, onLeave } = useTransition()

const store = useExpenseStore()
const openParticipants = reactive<Record<string, boolean>>({})

const totalBudget = computed(() => {
  return store.budgetsForMonth.reduce((sum, budget) => {
      if (budget.currency === 'CHF') {
        return sum + budget.amount
      } else {
        return sum + budget.amount / store.exchangeRate
      }
    }, 0)
})

const savings = computed(() => {
  return totalBudget.value - store.finalTotal
})

const budgetDetails = computed(() => {
  return store.participants.map((participant) => {
    const existing = store.getBudgetForParticipant(participant.id, store.filters.month)
    if (!existing) return null

    return {
      name: participant.name,
      participant_id: participant.id,
      budget: existing.currency === 'CHF' ? existing.amount : existing.amount / store.exchangeRate,
      expense: store.expensesByParticipant[participant.id] ?? 0
    }
  }).filter((detail) => detail !== null)
})

function toggleParticipant(id: string) {
  openParticipants[id] = !openParticipants[id]
}

</script>

<template>
  <div class="box">
    <h2 class="title-sm">Budget</h2>
    <div class="mt-5">
      <div class="flex justify-between items-center gap-5">
        <label for="budget-month" class="label mt-2">Mois</label>
        <select id="budget-month" class="select mb-2" v-model="store.filters.month">
          <option v-for="month in store.monthsWithBudget" :key="month" :value="month">{{ store.formatDate(month) }}</option>
        </select>
      </div>

      <div class="mt-5 flex justify-between items-end">
        <p class="text-slate-500">Budget du mois</p>
        <div class="text-right" v-for="display in [store.getDisplayCurrency(totalBudget)]" :key="display.primaryCurrency">
          <p class="text-sm text-slate-500">{{ (display.secondary).toFixed(2) }} {{ display.secondaryCurrency }}</p>
          <p class="text-lg font-bold text-indigo-400">{{ (display.primary).toFixed(2) }} {{ display.primaryCurrency }}</p>
        </div>
      </div>
      <div class="flex justify-between items-end">
        <p class="text-slate-500">Épargne</p>
        <div class="text-right" v-for="display in [store.getDisplayCurrency(savings)]" :key="display.primaryCurrency">
          <p class="text-sm text-slate-500">{{ (display.secondary).toFixed(2) }} {{ display.secondaryCurrency }}</p>
          <p :class="['text-lg font-bold', display.primary <= 0 ? 'text-rose-600' : 'text-green-500']">{{ (display.primary).toFixed(2) }} {{ display.primaryCurrency }}</p>
        </div>
      </div>

      <div v-for="budget in budgetDetails" :key="budget.name" class="mt-5 pt-5 border-t border-slate-800">
        <div class="flex justify-between items-center cursor-pointer" @click="toggleParticipant(budget.participant_id)">
          <p class="title-xs">{{ budget.name }}</p>
          <span :class="['dropdown-arrow', { 'isOpen': openParticipants[budget.participant_id] }]"></span>
        </div>

        <Transition @enter="onEnter" @leave="onLeave">
          <div v-show="openParticipants[budget.participant_id]" class="dropdown-content">
            <div class="flex justify-between items-end">
              <p class="text-slate-500">Budget</p>
              <div class="text-right" v-for="display in [store.getDisplayCurrency(budget.budget)]" :key="display.primaryCurrency">
                <p class="text-sm text-slate-500">{{ (display.secondary).toFixed(2) }} {{ display.secondaryCurrency }}</p>
                <p class="font-bold">{{ (display.primary).toFixed(2) }} {{ display.primaryCurrency }}</p>
              </div>
            </div>
            
            <div class="flex justify-between items-end">
              <p class="text-slate-500">Dépenses</p>
              <div class="text-right" v-for="display in [store.getDisplayCurrency(budget.expense)]" :key="display.primaryCurrency">
                <p class="text-sm text-slate-500">{{ (display.secondary).toFixed(2) }} {{ display.secondaryCurrency }}</p>
                <p class="font-bold">{{ (display.primary).toFixed(2) }} {{ display.primaryCurrency }}</p>
              </div>
            </div>
            <div class="flex justify-between items-end">
              <p class="text-slate-500">Épargne</p>
              <div class="text-right" v-for="display in [store.getDisplayCurrency(budget.budget - budget.expense)]" :key="display.primaryCurrency">
                <p class="text-sm text-slate-500">{{ (display.secondary).toFixed(2) }} {{ display.secondaryCurrency }}</p>
                <p :class="['font-bold', display.primary <= 0 ? 'text-rose-600' : 'text-green-500']">{{ (display.primary).toFixed(2) }} {{ display.primaryCurrency }}</p>
              </div>
            </div>
          </div>
        </Transition>

      </div>
    </div>
  </div>
</template>