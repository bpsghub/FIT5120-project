<template>
  <div class="tab-navigation">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      @click="selectTab(tab.value)"
      :class="['tab-btn', { active: activeTab === tab.value }]"
      :disabled="disabled"
    >
      <span v-if="tab.icon" class="tab-icon">{{ tab.icon }}</span>
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (tabs) => tabs.every((tab) => tab.label && tab.value),
  },
  activeTab: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:activeTab', 'tab-change'])

const selectTab = (tabValue) => {
  if (props.disabled || tabValue === props.activeTab) return

  emit('update:activeTab', tabValue)
  emit('tab-change', tabValue)
}
</script>

<style scoped>
.tab-navigation {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 30px;
  background: #f8f9fa;
  padding: 5px;
  border-radius: 8px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.tab-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-btn:hover:not(:disabled) {
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
}

.tab-btn.active {
  background: #007bff;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.tab-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-icon {
  font-size: 1.1em;
}

@media (max-width: 768px) {
  .tab-navigation {
    max-width: 100%;
    margin: 0 0 30px 0;
  }

  .tab-btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
}
</style>
