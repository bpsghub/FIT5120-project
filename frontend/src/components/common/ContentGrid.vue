<template>
  <div :class="['content-container', viewMode]">
    <!-- Facilities -->
    <FacilityCard
      v-if="activeTab === 'facilities'"
      v-for="facility in facilities"
      :key="facility.id"
      :facility="facility"
      @click="$emit('item-select', facility)"
    />

    <!-- Events -->
    <EventCard
      v-if="activeTab === 'events'"
      v-for="event in events"
      :key="event.id"
      :event="event"
      @click="$emit('item-select', event)"
    />
  </div>
</template>

<script setup>
import FacilityCard from '@/components/cards/FacilityCard.vue'
import EventCard from '@/components/cards/EventCard.vue'

defineProps({
  activeTab: {
    type: String,
    required: true,
  },
  facilities: {
    type: Array,
    default: () => [],
  },
  events: {
    type: Array,
    default: () => [],
  },
  viewMode: {
    type: String,
    required: true,
  },
})

defineEmits(['item-select'])
</script>

<style scoped>
.content-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.content-container.list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

@media (max-width: 768px) {
  .content-container.grid {
    grid-template-columns: 1fr;
  }
}
</style>
