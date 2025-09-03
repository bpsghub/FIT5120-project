<template>
  <div class="facility-card" :class="{ selected: isSelected }" @click="handleClick">
    <div class="facility-image">
      <img :src="facility.image" :alt="facility.name" />
      <div class="facility-type">{{ facility.type }}</div>
    </div>

    <div class="facility-content">
      <h3 class="facility-name">{{ facility.name }}</h3>
      <p class="facility-address">📍 {{ facility.address }}</p>
      <p class="facility-phone" v-if="facility.phone">📞 {{ facility.phone }}</p>

      <div class="facility-tags" v-if="facility.ethnicTags?.length">
        <span v-for="tag in facility.ethnicTags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>

      <div class="facility-rating" v-if="facility.rating">
        <span class="stars">⭐</span>
        <span>{{ facility.rating }}/5</span>
      </div>

      <div class="facility-distance" v-if="distance">
        <span>📍 {{ distance }} km away</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  facility: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  distance: {
    type: Number,
    default: null,
  },
  clickable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['click', 'select'])

const handleClick = () => {
  if (!props.clickable) return

  emit('click', props.facility)
  emit('select', props.facility)
}
</script>

<style scoped>
.facility-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.facility-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.facility-card.selected {
  border: 2px solid #007bff;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.3);
}

.facility-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.facility-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.facility-type {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.facility-content {
  padding: 20px;
}

.facility-name {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.facility-address,
.facility-phone {
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.facility-tags {
  margin: 15px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.facility-rating,
.facility-distance {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  font-weight: 600;
  color: #f57c00;
  font-size: 0.9rem;
}

.facility-distance {
  color: #666;
}

@media (max-width: 768px) {
  .facility-image {
    height: 150px;
  }

  .facility-content {
    padding: 15px;
  }

  .facility-name {
    font-size: 1.1rem;
  }
}
</style>
