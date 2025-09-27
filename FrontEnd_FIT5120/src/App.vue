<template>
  <div id="app">
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :class="route.name === 'passcode' ? '' : ''" />
    </router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'

onMounted(() => {
  AOS.init({
    duration: 1000,
    once: true,
  })
})
</script>
