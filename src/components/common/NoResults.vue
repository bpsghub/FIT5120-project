<template>
  <div class="no-results">
    <div class="no-results-icon">🔍</div>
    <h3>No {{ type }} found</h3>
    <p>Try adjusting your search criteria or filters</p>
    <button @click="$emit('clear-filters')" class="clear-btn">Clear Filters</button>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
  },
})

defineEmits(['clear-filters'])
</script>

<style scoped>
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.no-results h3 {
  margin-bottom: 10px;
  color: #333;
}

.clear-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
}

.clear-btn:hover {
  background: #545b62;
}
</style>
