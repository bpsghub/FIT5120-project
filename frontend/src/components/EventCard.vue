<template>
  <div class="event-card" @click="$router.push({ name: 'EventDetail', params: { id: event.id } })">
    <div class="card-image">
      <img :src="event.imageUrl || defaultImage" :alt="event.name" />
      <span class="status-badge" :class="event.isActive ? 'active' : 'inactive'">
        {{ event.isActive ? 'Active' : 'Inactive' }}
      </span>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ event.name }}</h3>
      <p class="card-date">{{ formatDate(event.startDate) }} - {{ formatDate(event.endDate) }}</p>
      <div class="card-info">
        <p>📍 {{ event.location }}</p>
        <p>👥 {{ event.attendees }} / {{ event.capacity }} attendees</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import defaultImage from '@/assets/default-facility.jpg'

const props = defineProps({
  event: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      startDate: '',
      endDate: '',
      location: '',
      attendees: 0,
      capacity: 0,
      isActive: false,
      imageUrl: ''
    })
  }
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.event-card {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  cursor: pointer;
  transition: transform 0.2s;
}

.event-card:hover {
  transform: translateY(-5px);
}

.card-image {
  position: relative;
  height: 180px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.active {
  background-color: #e6f4ea;
  color: #1e7e34;
}

.status-badge.inactive {
  background-color: #fce8e6;
  color: #c82333;
}

.card-content {
  padding: 15px;
}

.card-title {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #333;
}

.card-date {
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  color: #666;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85rem;
  color: #555;
}

.card-info p {
  margin: 0;
}
</style>
