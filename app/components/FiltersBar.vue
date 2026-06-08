<script setup lang="ts">
import { CURRENCIES, CATEGORIES } from '~/types'
const { onEnter, onLeave } = useTransition()

const store = useExpenseStore()
const activeCatDropdown = ref<boolean>(false)
const catDropdownRef = ref<HTMLElement | null>(null)
const activePersonsDropdown = ref<boolean>(false)
const personsDropdownRef = ref<HTMLElement | null>(null)

const handleClickOutside = (e: MouseEvent) => {
  if (!catDropdownRef.value?.contains(e.target as Node)) {
    if (store.filters.category.length === 0) {
      activeCatDropdown.value = false
    }
  }

  if (!personsDropdownRef.value?.contains(e.target as Node)) {
    if (store.filters.persons.length === 0) {
      activePersonsDropdown.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const hasActiveFilters = computed(() => {
  return Object.entries(store.filters).some(([key, value]) => {
    if (key === 'month') return value !== store.availableMonths[0]
    if (Array.isArray(value)) return value.length > 0
    return value !== ''
  })
})
</script>

<template>
  <div class="box">
    <h2 class="title-sm">Filtres</h2>

    <div class="mt-5">
      <div class="dropdown" ref="catDropdownRef">
        <button
          type="button"
          class="dropdown-button input"
          @click="activeCatDropdown = !activeCatDropdown"
        >
          Catégories
        </button>
        <Transition @enter="onEnter" @leave="onLeave">
          <div v-if="activeCatDropdown" class="dropdown-content">
            <div class="dropdown-content__inner">
              <div class="flex flex-wrap gap-x-3 gap-y-1">
                <label
                  :for="`category-${category}`"
                  v-for="category in CATEGORIES"
                  :key="category"
                  class="checkbox"
                >
                  <input
                    type="checkbox"
                    :id="`category-${category}`"
                    :value="category"
                    v-model="store.filters.category"
                  />
                  <span class="check"></span>
                  {{ category }}
                </label>
              </div>
              <button v-if="store.filters.category.length > 0" type="button" class="mt-5 button-xs" @click="store.filters.category = []">
                Réinitialiser
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <div class="mt-5">
      <div class="dropdown" ref="personsDropdownRef">
        <button
          type="button"
          class="dropdown-button input"
          @click="activePersonsDropdown = !activePersonsDropdown"
        >
          Participants
        </button>
        <Transition @enter="onEnter" @leave="onLeave">
          <div v-if="activePersonsDropdown" class="dropdown-content">
            <div class="dropdown-content__inner">
              <div class="flex flex-wrap gap-x-3 gap-y-1">
                <label
                  :for="`persons-${participant.id}`"
                  v-for="participant in store.participants"
                  :key="participant.id"
                  class="checkbox"
                >
                  <input
                    type="checkbox"
                    :id="`persons-${participant.id}`"
                    :value="participant.id"
                    v-model="store.filters.persons"
                  />
                  <span class="check"></span>
                  {{ participant.name }}
                </label>
              </div>
              <button v-if="store.filters.persons.length > 0" type="button" class="mt-5 button-xs" @click="store.filters.persons = []">
                Réinitialiser
              </button>
              <button v-if="store.participants.length === 0" type="button" class="mt-5 button-xs" @click="store.isParticipantsOpen = true">
                + Ajouter des participants
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <div class="mt-5">
      <label for="select-month" class="label">Mois</label>
      <select v-model="store.filters.month" class="select" id="select-month">
        <option v-for="month in store.availableMonths" :key="month" :value="month">
          {{ store.formatDate(month) }}
        </option>
      </select>
    </div>

    <div class="mt-5">
      <label for="select-currency" class="label">Devise</label>
      <select v-model="store.filters.currency" class="select" id="select-currency">
        <option value="">Tous</option>
        <option v-for="currency in CURRENCIES" :key="currency" :value="currency">
          {{ currency }}
        </option>
      </select>
    </div>

    <div v-if="hasActiveFilters" class="flex justify-end mt-5">
      <button type="button" class="button-xs" @click="store.resetFilters()">Réinitialiser</button>
    </div>
  </div>
</template>

<style scoped></style>
