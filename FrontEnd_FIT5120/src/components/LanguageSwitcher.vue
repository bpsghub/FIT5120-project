<template>
  <div class="lang-switcher">
    <div v-for="option in props.options" :key="option.value"
      :class="['lang-btn', props.modelValue === option.value ? 'active' : '']" @click="updateLang(option.value)">
      {{ option.label }}
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    default: () => [
      { label: 'EN', value: 'en' },
      { label: 'CN', value: 'cn' },
      { label: 'VN', value: 'vn' },
      { label: 'ID', value: 'id' }
    ]
  }
});

const emit = defineEmits(['update:modelValue']);

function updateLang(val) {
  emit('update:modelValue', val);
}
</script>

<style scoped>
.lang-switcher {
  position: fixed;
  top: 60%;
  right: 32px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 2000;
}

.lang-btn {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: #a259e6;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  opacity: 0.7;
  cursor: pointer;
  transition: opacity 0.2s, background 0.2s;
}

.lang-btn.active {
  background: #d1aaff;
  color: #222;
  opacity: 1;
}

@media (max-width: 900px) {
  .lang-switcher {
    position: static;
    flex-direction: row;
    justify-content: center;
    margin-top: 32px;
    transform: none;
  }
}
</style>
