<template>
  <div class="groceries-container">
    <BannerBubble :title="$t('navigate_your_life.cards.grocceriesshopping.title')"
      :subtitle="$t('navigate_your_life.cards.grocceriesshopping.subtitle')"
      :bubbleTexts="['Shop', 'Fresh', 'Fruit', 'Veggie', 'Milk', 'Bread', 'Cart', 'Aisle', 'Price', 'Sale', 'Checkout', 'Bag']"
      :customIcon="shoppingIcon" />
    <div class="content-box">
      <LearningSlider :lang="locale" v-model="locale" csv-url="/Learning about Australia/epic4_shopping_etiquettes.csv"
        image-seed-prefix="groceries" />
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'
import LearningSlider from '@/components/LearningSlider.vue'
import { useI18n } from 'vue-i18n'
import BannerBubble from '@/components/BannerBubble.vue'

// Shopping cart icon
const shoppingIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z' })
])

const { locale } = useI18n()

</script>

<style scoped>
.bus-groceries-container {
  min-height: 100vh;
  background: #E6E6FA;
  display: flex;
  flex-direction: column;
}
</style>
