<template>
  <div id="app">
    <Navbar />
    <router-view class="container" />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<style scoped>
#app {
  font-family: 'Arial', sans-serif;
  color: #333;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
