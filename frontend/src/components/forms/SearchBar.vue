<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <input type="text" :value="modelValue" :placeholder="placeholder"
        @input="$emit('update:modelValue', $event.target.value)" @keyup.enter="$emit('search')" class="search-input" />
      <button @click="$emit('search')" class="search-button">
        🔍 Search
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  }
})

const emit = defineEmits(['update:modelValue', 'search'])
</script>

<style scoped>
.search-bar {
  margin: 20px 0;
}

.search-input-wrapper {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: #999;
}

.search-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.search-button:hover {
  background: #0056b3;
}
</style>
