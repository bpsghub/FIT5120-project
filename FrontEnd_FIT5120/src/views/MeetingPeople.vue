<template>
  <div class="meeting-people-container">
    <!-- Hero Banner -->
    <BannerBubble :title="$t('meetingpeople_title')" :subtitle="$t('meetingpeople_subtitle')"
      :bubbleTexts="['Hi!', 'G\'day!', 'Hello', 'Nice to meet you', 'Handshake', 'Smile', 'Greet', 'Friend', 'Polite', 'Respect', 'Talk', 'Social']"
      :customIcon="handshakeIcon" />
    <!-- Learning section -->
    <div class="content-box">
      <LearningSlider :lang="locale" csv-url="/Learning about Australia/epic3_meeting_etiquette.csv"
        image-seed-prefix="meetingpeople" />
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'
import { useI18n } from 'vue-i18n'
import LearningSlider from '@/components/LearningSlider.vue'
import BannerBubble from '@/components/BannerBubble.vue'

// Handshake icon for meeting people
const handshakeIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z' })
])

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
