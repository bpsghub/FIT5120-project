<template>
  <div id="app">
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :class="route.name === 'passcode' ? '' : ''" />
    </router-view>
  </div>
</template>

<script setup>
</script>
