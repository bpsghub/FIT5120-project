<template>
  <div class="modern-sections">
    <BannerBubble :title="$t('socialnorms.title')" :subtitle="$t('socialnorms.subtitle')"
      :bubbleTexts="['Navigate', 'Facilities', 'Transport', 'Learning', 'Culture', 'Social', 'Norms', 'Australia']"
      :customIcon="socialIcon" />

    <div>
      <section v-for="(card, idx) in cards" :key="card.key" class="service-section" :class="{ reverse: idx % 2 === 1 }"
        :data-aos="idx % 2 === 0 ? 'fade-right' : 'fade-left'" :data-aos-delay="`${0 + idx * 100}`"
        aria-label="Social Norms Section">
        <div class="section-img">
          <div class="img-hover-wrapper" @click="goTo(card.key)">
            <img :src="card.img" :alt="card.title" class="card-img-top" />
            <div class="portfolio__overlay">
              <div class="overlay-title">{{ card.title }}</div>
            </div>
          </div>
        </div>
        <div class="section-content">
          <h2 class="section-title">{{ card.title }}</h2>
          <p class="section-subtitle">{{ card.text }}</p>
          <button class="learn-more-btn" @click="goTo(card.key)">
            {{ $t('button_learnmore.label') }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BannerBubble from '@/components/BannerBubble.vue'

// Social/people icon
const socialIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' })
])

const router = useRouter()
const { t } = useI18n()

const cardKeys = ['meetingpeople', 'eatingout']

const cardImages = {
  meetingpeople:
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
  eatingout:
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
}

const cards = computed(() =>
  cardKeys.map((key) => ({
    key,
    title: t(`socialnorms.${key}.title`),
    text: t(`socialnorms.${key}.subtitle`),
    img: cardImages[key],
  })),
)

function goTo(key) {
  if (key === 'meetingpeople') {
    router.push('/socialnorms/meetingpeople')
  } else if (key === 'eatingout') {
    router.push('/socialnorms/eatingout')
  }
}
</script>

<style scoped>
.modern-sections {
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  padding: 0 0 40px 0;
  font-family: 'Roboto', 'Arial', sans-serif;
}

.service-section {
  display: flex;
  align-items: center;
  min-height: 320px;
  margin: 40px auto;
  max-width: 1100px;
  background: #fff;
  border-radius: 16px;
  border: 2px solid #e0d4f7;
  box-shadow: 0 4px 16px rgba(107, 70, 193, 0.12);
  overflow: hidden;
  position: relative;
  transition: all 0.3s;
}

.service-section:hover {
  border-color: #a259e6;
  box-shadow: 0 8px 24px rgba(162, 89, 230, 0.2);
  transform: translateY(-20px) !important;
}

.service-section.reverse {
  flex-direction: row-reverse;
}

.section-img {
  flex: 0 0 60%;
  position: relative;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #d6bcfa;
}

.section-img img {
  width: 100%;
  height: 100%;
  min-height: 300px;
  object-fit: cover;
  border-radius: 10px;
  opacity: 1;
  z-index: 1;
}

.img-hover-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s;
}

.img-hover-wrapper::before {
  content: "";
  position: absolute;
  top: 0;
  left: -75%;
  width: 20%;
  height: 100%;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0) 100%);
  transform: skewX(-25deg);
  transition: left 0.75s cubic-bezier(.4, 2, .6, 1);
  z-index: 5;
  pointer-events: none;
}

.img-hover-wrapper:hover::before {
  left: 125%;
}

.card-img-top {
  width: 100%;
  height: 100%;
  min-height: 300px;
  object-fit: cover;
  border-radius: 10px;
  opacity: 1;
  z-index: 1;
  transition: filter 0.5s, transform 0.5s;
}

.img-hover-wrapper:hover .card-img-top {
  filter: brightness(0.7);
  transform: scale(1.08);
}

.portfolio__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: all 0.75s;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 24px;
}

.img-hover-wrapper:hover .portfolio__overlay {
  opacity: 1;
}

.overlay-title {
  color: #fff;
  font-weight: bold;
  font-size: 1.3rem;
  margin-bottom: 6px;
}

.section-content {
  flex: 0 0 40%;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  color: #6b46c1;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 28px;
}

.learn-more-btn {
  background: #6b46c1;
  color: #fff;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    all 0.3s cubic-bezier(0.4, 2, 0.6, 1),
    transform 0.3s cubic-bezier(0.4, 2, 0.6, 1);
}

.learn-more-btn:hover {
  background: #8a4af3;
  transform: scale(1.05);
}

@media (max-width: 900px) {

  .service-section,
  .service-section.reverse {
    flex-direction: column !important;
    min-height: 0;
    margin: 32px 0;
    max-width: 98vw;
  }

  .section-img,
  .section-content {
    flex: 1 1 100%;
    width: 100%;
    min-height: 180px;
    padding: 0;
  }

  .section-content {
    align-items: center;
    text-align: center;
    padding: 24px 12px 32px 12px;
  }

  .section-title {
    font-size: 1.4rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }
}
</style>
