<template>
  <div id="app">
    <Header v-if="$route.name !== 'passcode'" />
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :class="route.name === 'passcode' ? '' : ''" />
    </router-view>
    <Footer v-if="$route.name !== 'passcode'" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

onMounted(() => {
  AOS.init({
    duration: 1000,
    once: true,
  })
})
</script>
