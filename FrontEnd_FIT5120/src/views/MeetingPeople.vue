<template>
  <div class="meeting-people-container">
    <Header />
    <!-- Hero Banner -->
    <LearningBanner :title="$t('meetingpeople_title')" :subtitle="$t('meetingpeople_subtitle')" :particle-count="18" />
    <!-- Learning section -->
    <div class="content-box">
      <LearningSlider :lang="locale" csv-url="/Learning about Australia/meeting_etiquette.csv"
        image-seed-prefix="meetingpeople" />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import Header from '@/components/Header.vue'
import LearningSlider from '@/components/LearningSlider.vue'
import LearningBanner from '@/components/LearningBanner.vue'

const { locale } = useI18n()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans:wght@400;700&display=swap');

.meeting-people-container {
  font-family: 'Open Sans', Arial, sans-serif;
  background: #E6E6FA;
  min-height: 100vh;
  color: #222;
}
</style>
