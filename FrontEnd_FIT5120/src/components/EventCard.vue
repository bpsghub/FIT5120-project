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
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.event-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.event-card:hover::before {
  opacity: 1;
}

.event-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.event-card:hover .card-image img {
  transform: scale(1.05);
}

.status-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.status-badge.active {
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.9), rgba(34, 139, 58, 0.9));
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.status-badge.inactive {
  background: linear-gradient(135deg, rgba(108, 117, 125, 0.9), rgba(73, 80, 87, 0.9));
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
}

.card-content {
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
}

.card-title {
  margin: 0 0 10px 0;
  font-size: 1.3rem;
  color: #2c3e50;
  font-weight: 700;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.event-card:hover .card-title {
  color: #f5576c;
}

.card-date {
  margin: 0 0 15px 0;
  font-size: 0.95rem;
  color: #f5576c;
  font-weight: 600;
  padding: 8px 12px;
  background: rgba(245, 87, 108, 0.1);
  border-radius: 15px;
  border: 1px solid rgba(245, 87, 108, 0.2);
  display: inline-block;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.9rem;
  color: #555;
}

.card-info p {
  margin: 0;
  padding: 8px 12px;
  background: rgba(240, 147, 251, 0.1);
  border-radius: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 1px solid rgba(240, 147, 251, 0.2);
}

.card-info p:first-child {
  background: rgba(23, 162, 184, 0.1);
  border-color: rgba(23, 162, 184, 0.2);
  color: #17a2b8;
}

.card-info p:last-child {
  background: rgba(255, 193, 7, 0.1);
  border-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.event-card:hover .card-info p {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .card-title {
    font-size: 1.2rem;
  }
  
  .card-image {
    height: 180px;
  }
  
  .card-content {
    padding: 18px;
  }
}
</style>
