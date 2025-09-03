<template>
  <div class="event-card" :class="{ selected: isSelected }" @click="handleClick">
    <div class="event-image">
      <img :src="event.image" :alt="event.name" />
      <div class="event-type">{{ event.type }}</div>
      <div class="event-date">{{ formattedDate }}</div>
    </div>

    <div class="event-content">
      <h3 class="event-name">{{ event.name }}</h3>
      <p class="event-address">📍 {{ event.address }}</p>
      <p class="event-time" v-if="event.time">🕒 {{ event.time }}</p>
      <p class="event-price" v-if="event.price">💰 {{ formattedPrice }}</p>

      <div class="event-tags" v-if="event.ethnicTags?.length">
        <span v-for="tag in event.ethnicTags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>

      <div class="event-description" v-if="event.description">
        {{ truncatedDescription }}
      </div>

      <div class="event-rating" v-if="event.rating">
        <span class="stars">⭐</span>
        <span>{{ event.rating }}/5</span>
      </div>

      <div class="event-distance" v-if="distance">
        <span>📍 {{ distance }} km away</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate, formatPrice } from '@/utils/helpers.js'

const props = defineProps({
  event: {
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

const formattedDate = computed(() => {
  return props.event.date ? formatDate(props.event.date) : ''
})

const formattedPrice = computed(() => {
  return props.event.price ? formatPrice(props.event.price) : ''
})

const truncatedDescription = computed(() => {
  if (!props.event.description) return ''
  const maxLength = 100
  if (props.event.description.length <= maxLength) {
    return props.event.description
  }
  return props.event.description.substring(0, maxLength) + '...'
})

const handleClick = () => {
  if (!props.clickable) return

  emit('click', props.event)
  emit('select', props.event)
}
</script>

<style scoped>
.event-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.event-card.selected {
  border: 2px solid #007bff;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.3);
}

.event-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-type {
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

.event-date {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 123, 255, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.event-content {
  padding: 20px;
}

.event-name {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.event-address,
.event-time,
.event-price {
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.event-tags {
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

.event-description {
  margin: 10px 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.event-rating,
.event-distance {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  font-weight: 600;
  color: #f57c00;
  font-size: 0.9rem;
}

.event-distance {
  color: #666;
}

@media (max-width: 768px) {
  .event-image {
    height: 150px;
  }

  .event-content {
    padding: 15px;
  }

  .event-name {
    font-size: 1.1rem;
  }
}
</style>
