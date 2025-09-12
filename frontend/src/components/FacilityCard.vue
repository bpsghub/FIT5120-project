<template>
  <div class="facility-card" @click="$router.push({ name: 'FacilityDetail', params: { id: facility.id } })">
    <div class="card-image">
      <img :src="facility.imageUrl || defaultImage" :alt="facility.name" />
      <span class="status-badge" :class="facility.isOpen ? 'open' : 'closed'">
        {{ facility.isOpen ? 'Open' : 'Closed' }}
      </span>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ facility.name }}</h3>
      <p class="card-type">{{ facility.type }}</p>
      <div class="card-info">
        <p>📍 {{ facility.distance.toFixed(1) }} km away</p>
        <p>⭐ {{ facility.rating }} ({{ facility.reviewCount }} reviews)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import defaultImage from '@/assets/default-facility.jpg'

const props = defineProps({
  facility: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      type: '',
      isOpen: false,
      distance: 0,
      rating: 0,
      reviewCount: 0,
      imageUrl: ''
    })
  }
})
</script>

<style scoped>
.facility-card {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  cursor: pointer;
  transition: transform 0.2s;
}

.facility-card:hover {
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

.status-badge.open {
  background-color: #e6f4ea;
  color: #1e7e34;
}

.status-badge.closed {
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

.card-type {
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  color: #666;
}

.card-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #555;
}

.card-info p {
  margin: 0;
}
</style>
