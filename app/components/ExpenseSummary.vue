<script setup lang="ts">
import { CATEGORY_META } from '~/utils/categories'

const store = useExpenseStore()
</script>

<template>
  <div class="box">
    <h2 class="title-sm">Résumé</h2>

    <div class="flex justify-between items-end">
      <p class="text-slate-500">Total</p>
      <div class="text-right">
        <p class="text-sm text-slate-500">
          {{ store.getDisplayCurrency(store.finalTotal).secondary.toFixed(2) }}
          {{ store.getDisplayCurrency(store.finalTotal).secondaryCurrency }}
        </p>
        <p class="text-2xl font-black text-indigo-400">
          {{ store.getDisplayCurrency(store.finalTotal).primary.toFixed(2) }}
          {{ store.getDisplayCurrency(store.finalTotal).primaryCurrency }}
        </p>
      </div>
    </div>

    <div
      v-if="store.filteredExpenses.length > 0"
      class="mt-5 pt-2 pb-5 border-y-1 border-slate-800"
    >
      <div
        v-for="[category, total] in Object.entries(store.categoryExpenses)"
        :key="category"
        class="mt-2"
      >
        <div class="flex justify-between gap-3">
          <p class="text-sm">{{ CATEGORY_META[category].emoji }} {{ category }}</p>
          <p class="text-sm font-semibold">{{ total.toFixed(2) }}</p>
        </div>
        <div class="progress-bar">
          <div
            class="progress-bar__fill"
            :style="{
              background: CATEGORY_META[category].color,
              width: Math.ceil((total / store.finalTotal) * 100) + '%',
            }"
          ></div>
        </div>
        <p class="text-xs text-slate-500">{{ Math.ceil((total / store.finalTotal) * 100) }}%</p>
      </div>
    </div>

    <p class="mt-5 text-xs text-slate-500 text-center">
      Taux : 1 {{ store.getDisplayCurrency(store.finalTotal).primaryCurrency }} =
      {{
        store.filters.currency == 'CHF' || store.filters.currency == ''
          ? store.exchangeRate
          : store.getDisplayCurrency(1 / store.exchangeRate).secondary.toFixed(2)
      }}
      {{ store.getDisplayCurrency(store.finalTotal).secondaryCurrency }}
    </p>
  </div>
</template>

<style scoped></style>
