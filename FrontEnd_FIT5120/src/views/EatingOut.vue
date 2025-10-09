<template>
  <div class="eating-out-container">
    <BannerBubble :title="$t('socialnorms.eatingout.title')" :subtitle="$t('socialnorms.eatingout.subtitle')"
      :bubbleTexts="['Yum!', 'Delicious', 'Fork', 'Knife', 'Menu', 'Please', 'Thank you', 'Waiter', 'Order', 'Tip', 'Bill', 'Enjoy']"
      :customIcon="restaurantIcon" />
    <div class="content-box">
      <LearningSlider :lang="locale" csv-url="/Learning about Australia/epic3_dining_rules_final.csv"
        image-seed-prefix="eatingout" />
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'
import { useI18n } from 'vue-i18n'
import BannerBubble from '@/components/BannerBubble.vue'
import LearningSlider from '@/components/LearningSlider.vue'

// Restaurant icon for eating out
const restaurantIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z' })
])

const { locale } = useI18n()

</script>

<style scoped>
.eating-out-container {
  font-family: 'Open Sans', Arial, sans-serif;
  background: #E6E6FA;
  min-height: 100vh;
  color: #222;
}
</style>
