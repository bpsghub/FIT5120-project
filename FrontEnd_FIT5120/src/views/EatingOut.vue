<template>
  <div class="eating-out-container">
    <Header />
    <LearningBanner :title="$t('socialnorms.eatingout.title')" :subtitle="$t('socialnorms.eatingout.subtitle')"
      :particle-count="18" />
    <div class="content-box">
      <LearningSlider :lang="locale" csv-url="/Learning about Australia/epic3_dining_rules_final(1).csv"
        image-seed-prefix="eatingout" />
    </div>
  </div>
</template>
z
<script setup>
import { useI18n } from 'vue-i18n'
import Header from '@/components/Header.vue'
import LearningBanner from '@/components/LearningBanner.vue'
import LearningSlider from '@/components/LearningSlider.vue'

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
