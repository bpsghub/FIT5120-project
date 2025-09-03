<template>
  <div v-if="show" class="location-overlay">
    <div class="location-dialog">
      <div class="dialog-header">
        <h3>Get Directions</h3>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      <div class="dialog-content">
        <div class="location-icon">🧭</div>
        <p>
          To show turn-by-turn directions to <strong>{{ selectedItemName }}</strong
          >, we need to know your current location.
        </p>

        <div v-if="error" class="error-message">
          <p>{{ error }}</p>
        </div>

        <div class="dialog-actions">
          <button @click="$emit('allow-location')" class="allow-btn">📍 Share My Location</button>
          <button @click="$emit('close')" class="deny-btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  selectedItemName: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
})

defineEmits(['close', 'allow-location'])
</script>

<style scoped>
.location-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.location-dialog {
  background: white;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0 20px;
}

.dialog-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #666;
}

.dialog-content {
  padding: 20px;
  text-align: center;
}

.location-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.dialog-content p {
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
}

.error-message {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.error-message p {
  margin: 0;
  color: #856404;
}

.dialog-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.allow-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s;
}

.allow-btn:hover {
  background: #218838;
}

.deny-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background 0.2s;
}

.deny-btn:hover {
  background: #545b62;
}
</style>
