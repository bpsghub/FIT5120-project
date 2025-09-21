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
      isOpen: true,
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

.facility-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.facility-card:hover::before {
  opacity: 1;
}

.facility-card:hover {
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

.facility-card:hover .card-image img {
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

.status-badge.open {
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.9), rgba(34, 139, 58, 0.9));
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.status-badge.closed {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.9), rgba(200, 35, 51, 0.9));
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
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

.facility-card:hover .card-title {
  color: #667eea;
}

.card-type {
  margin: 0 0 15px 0;
  font-size: 0.95rem;
  color: #667eea;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #555;
  gap: 10px;
}

.card-info p {
  margin: 0;
  padding: 8px 12px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 15px;
  font-weight: 600;
  flex: 1;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.card-info p:first-child {
  background: rgba(40, 167, 69, 0.1);
  border-color: rgba(40, 167, 69, 0.2);
  color: #28a745;
}

.card-info p:last-child {
  background: rgba(255, 193, 7, 0.1);
  border-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.facility-card:hover .card-info p {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .card-info {
    flex-direction: column;
    gap: 8px;
  }

  .card-info p {
    width: 100%;
  }

  .card-title {
    font-size: 1.2rem;
  }

  .card-image {
    height: 180px;
  }
}
</style>
