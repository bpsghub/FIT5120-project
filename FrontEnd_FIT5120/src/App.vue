<template>
  <div id="app">
    <Navbar />
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :class="route.name === 'passcode' ? '' : 'container'" />
    </router-view>
  </div>
</template>

<script setup>
</script>

