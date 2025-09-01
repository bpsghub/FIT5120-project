<template>
  <div class="search-section">
    <div class="search-bar">
      <input
        v-model="searchValue"
        @input="handleInput"
        @keyup.enter="handleSearch"
        :placeholder="placeholder"
        class="search-input"
        :disabled="disabled"
      />
      <button @click="handleSearch" class="search-btn" :disabled="disabled">🔍</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { debounce } from '@/utils/helpers.js'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Search by name, suburb, postcode...',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  debounceTime: {
    type: Number,
    default: 300,
  },
})

const emit = defineEmits(['update:modelValue', 'search'])

const searchValue = ref(props.modelValue)

// Debounced search function
const debouncedSearch = debounce(() => {
  emit('search', searchValue.value)
}, props.debounceTime)

const handleInput = () => {
  emit('update:modelValue', searchValue.value)
  debouncedSearch()
}

const handleSearch = () => {
  emit('search', searchValue.value)
}

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    searchValue.value = newValue
  },
)
</script>

<style scoped>
.search-section {
  margin-bottom: 25px;
}

.search-bar {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 15px 20px;
  border: none;
  font-size: 1rem;
  outline: none;
}

.search-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.search-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 15px 20px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.3s;
}

.search-btn:hover:not(:disabled) {
  background: #0056b3;
}

.search-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}
</style>
