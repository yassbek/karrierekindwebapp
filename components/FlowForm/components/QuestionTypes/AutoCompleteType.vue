<template>
  <div v-bind:class="{'f-multiple': question.multiple}">
    <Combobox
      @update:modelValue="updateArray"
      as="div"
      class="w-full mb-4">
      <div class="relative">

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
        </svg>
      <ComboboxInput
        ref="autocompleteInput"
        class="py-2 pl-8 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
        @input="debouncedQueryUpdate($event.target.value)"
      />
      </div>
      <ComboboxOptions
        class="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm absolute z-10 top-24"
      >
        <div
          v-if="filteredOptions.length === 0 && query !== ''"
          class="relative cursor-default select-none py-2 px-4 text-gray-700"
        >
          Nothing found.
        </div>
        <ComboboxOption
          v-for="(option, index) in filteredOptions"
          as="template"
          :key="'option-' + index"
          :value="option"
        >
          <div>
            <li
              class="relative cursor-default select-none py-2 pl-10 pr-4 hover:bg-gray-50 cursor-pointer"
              :class="{'bg-gray-100 font-bold' : checkIfElementIsInArray(option)}"
            >
              <CheckIcon v-if="checkIfElementIsInArray(option)" class="h-5 w-5 fill-gray-600 absolute left-3" aria-hidden="true"/>
              <span
                class="block truncate"
              >
                {{ option.choiceLabel() }}
              </span>
            </li>
          </div>
        </ComboboxOption>
      </ComboboxOptions>
    </Combobox>
    <div v-if="question.ratings" class="flex flex-col divide-y gap-2">
      <div v-for="(option, index) in dataValue" :key="'r' + index" class="w-full">
        <div class="flex items-center justify-between w-full p-2 rounded-md">
          <div class="flex items-center">
            <svg @click="removeChoice(option)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5" stroke="currentColor"
                 class="w-6 h-6 mr-3 stroke-gray-400 cursor-pointer bg-white rounded-full p-1 hover:bg-gray-50">
              <path stroke-linecap="round" stroke-width="2" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <label class="">{{ option.label }}</label>
          </div>

          <Listbox as="div" @update:modelValue="updateRating($event, index)">
            <div class="relative">
              <div class="inline-flex divide-x divide-gray-300 rounded-md shadow-sm">
                <div
                  class="inline-flex items-center gap-x-1.5 rounded-l-md bg-white text-gray-600 px-3 py-1 shadow-sm">
                  <p class="text-sm font-semibold">{{ option.rating.Name }}</p>
                </div>
                <ListboxButton
                  class="inline-flex items-center rounded-l-none rounded-r-md bg-white text-gray-600 p-1 hover:bg-indigo-700 focus:outline-none">
                  <span class="sr-only">Level ändern</span>
                  <ChevronDownIcon class="h-5 w-5 text-gray-600 hover:text-white" aria-hidden="true"/>
                </ListboxButton>
              </div>

              <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                          leave-to-class="opacity-0">
                <ListboxOptions
                  class="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <ListboxOption as="template" v-for="ratingOption in question.ratings" :key="ratingOption.Name"
                                 :value="ratingOption"
                                 v-slot="{ active, selected }">
                    <li
                      :class="[active ? 'bg-indigo-600 text-white' : 'text-gray-900', 'cursor-default select-none p-2 text-sm']">
                      <div class="flex flex-col">
                        <div class="flex justify-between">
                          <p :class="selected ? 'font-semibold' : 'font-normal'">{{ ratingOption.Name }}</p>
                          <span v-if="selected" :class="active ? 'text-white' : 'text-indigo-600'">
                    <CheckIcon class="h-5 w-5 fill-gray-600" aria-hidden="true"/>
                  </span>
                        </div>
                      </div>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-wrap gap-2">
      <span v-for="option in dataValue" :key="option.Name"
            class="bg-white pr-3 mb-2 py-1 flex bg-white rounded-full items-center">
                    <svg @click="removeChoice(option)" xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24"
                         stroke-width="1.5" stroke="currentColor"
                         class="w-6 h-6 mr-2 stroke-gray-400 ml-1.5 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-full p-1 hover:bg-gray-50">
              <path stroke-linecap="round" stroke-width="2" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        {{ option.label }}</span>
    </div>
  </div>
</template>

<script>
import BaseType from './BaseType.vue'
import {QuestionType} from '../../models/QuestionModel'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import {CheckIcon, ChevronDownIcon} from '@heroicons/vue/20/solid'
import debounce from 'lodash/debounce';

export default {
  extends: BaseType,
  name: QuestionType.AutoComplete,
  components: {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions, CheckIcon, ChevronDownIcon
  },
  data() {
    return {
      query: '',
      debouncedQueryUpdate: debounce(this.updateQuery, 300),  // 300 ms delay
    }
  },
  computed: {
    filteredOptions() {
      let filtered = this.query === ''
        ? this.question.options
        : this.question.options.filter((option) =>
          option.choiceLabel()
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(this.query.toLowerCase().replace(/\s+/g, ''))
        );
      // Limit the array to the first 50 elements
      return filtered.slice(0, 50);
    }
  },
  methods: {
    updateQuery: function(value) {
      this.query = value;
    },
    updateArray(option) {
      console.log('updateArray', option)
      const index = this.dataValue.findIndex(item => item.value === option.value);
      if (index !== -1) {
        this.removeChoice(option)
      } else {
        this.addChoice(option)
      }
      // check if question is answered
      if (this.dataValue.length > 0) {
        this.question.answered = true
        // set answer valid
        this.isValid()
      } else {
        this.question.answered = false
      }
      this.setAnswer(this.dataValue)
    },
    removeChoice(option) {
      this.dataValue = this.dataValue.filter(item => item.value !== option.value)
      console.log('removed', option)
    },
    addChoice(option) {
      const self = this
      this.dataValue.push({
        collectionId: option.collectionId,
        value: option.value,
        label: option.label,
        rating: self.question.ratings ? self.question.ratings[0] : undefined,
      })
      console.log('added', option)
    },
    updateRating(rating, index) {
      this.dataValue[index].rating = rating
      console.log('updated', rating)
    },
    checkIfElementIsInArray(option) {
      return this.dataValue.some(item => item.value === option.value)
    }
  },
  mounted() {
    if (this.dataValue === null) {
      console.log('set answer to empty array')
      this.dataValue = []
    }
  },
}
</script>
<style scoped>
input {
  padding-left: 3rem !important;
  max-width: initial !important;
}
</style>