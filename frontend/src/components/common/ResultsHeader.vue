<template>
  <div class="results-header">
    <h3>Found {{ itemCount }} {{ activeTab }}</h3>
    <div class="view-toggle">
      <button
        @click="$emit('view-change', 'grid')"
        :class="{ active: viewMode === 'grid' }"
        class="view-btn"
      >
        Grid
      </button>
      <button
        @click="$emit('view-change', 'list')"
        :class="{ active: viewMode === 'list' }"
        class="view-btn"
      >
        List
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  itemCount: {
    type: Number,
    required: true,
  },
  activeTab: {
    type: String,
    required: true,
  },
  viewMode: {
    type: String,
    required: true,
  },
})

defineEmits(['view-change'])
</script>

<style scoped>
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-header h3 {
  margin: 0;
  color: #333;
}

.view-toggle {
  display: flex;
  gap: 5px;
}

.view-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.view-btn.active {
  background: #007bff;
  color: white;
}

@media (max-width: 768px) {
  .results-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
}
</style>
