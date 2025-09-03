<template>
  <div class="error-message">
    <p>❌ {{ message }}</p>
    <button @click="$emit('retry')" class="retry-btn">Try Again</button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
})

defineEmits(['retry'])
</script>

<style scoped>
.error-message {
  text-align: center;
  padding: 20px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
  margin-bottom: 20px;
}

.retry-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.retry-btn:hover {
  background: #c82333;
}
</style>
