<template>
  <div class="medical-attention-container ">
    <BannerBubble :title="$t('navigate_your_life.cards.medicalattention.title')"
      :subtitle="$t('navigate_your_life.cards.medicalattention.subtitle')"
      :bubbleTexts="['Health', 'Doctor', 'Hospital', 'Medicine', 'Care', 'Help', 'Emergency', '000', 'Safe', 'Clinic', 'Medicare', 'Checkup']"
      :customIcon="medicalIcon" />

    <div class="content-box">
      <LearningSlider :lang="locale" v-model="locale" csv-url="/Learning about Australia/epic4_doctor_etiquettes.csv"
        image-seed-prefix="medical" />
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'
import LearningSlider from '@/components/LearningSlider.vue'
import { useI18n } from 'vue-i18n'
import BannerBubble from '@/components/BannerBubble.vue'

// Medical icon
const medicalIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z' })
])

const { locale } = useI18n()

</script>

<style scoped>
.medical-attention-container {
  min-height: 100vh;
  background: #E6E6FA;
  display: flex;
  flex-direction: column;
}
</style>
