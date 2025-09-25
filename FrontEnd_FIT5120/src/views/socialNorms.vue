<template>
  <div class="modern-sections">
    <Header class="transparent-header" />
    <div class="main-title">
      <span class="main-title-text">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="main-title-icon">
          <circle cx="16" cy="16" r="16" fill="#D6BCFA" />
          <path d="M10 16h12M16 10v12" stroke="#6B46C1" stroke-width="2" stroke-linecap="round" />
        </svg>
        {{ $t('nav.social') || 'Social Norms' }}
      </span>
    </div>
    <div>
      <section v-for="(card, idx) in cards" :key="card.key" :class="[
        'service-section',
        idx % 2 === 1 ? 'reverse' : '',
        idx === 0 ? 'slide-in-right' : 'slide-in-left'
      ]" :style="{ animationDelay: `${0.2 * idx}s` }" aria-label="Social Norms Section">
        <div class="section-img">
          <img :src="card.img" :alt="card.title" />
          <div class="img-overlay"></div>
        </div>
        <div class="section-content">
          <h2 class="section-title">{{ card.title }}</h2>
          <p class="section-subtitle">{{ card.text }}</p>
          <button class="learn-more-btn" @click="goTo(card.key)">
            {{ $t('Learn More') }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Header from '@/components/Header.vue';
const router = useRouter();
const { t } = useI18n();

const cardKeys = [
  'meetingpeople',
  'eatingout',
];

const cardImages = {
  meetingpeople: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
  eatingout: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
};

const cards = computed(() =>
  cardKeys.map((key) => ({
    key,
    title: t(`socialnorms.${key}.title`),
    text: t(`socialnorms.${key}.subtitle`),
    img: cardImages[key],
  }))
);

function goTo(key) {
  if (key === 'meetingpeople') {
    router.push('/socialnorms/meetingpeople');
  } else if (key === 'eatingout') {
    router.push('/socialnorms/eatingout');
  }
}
</script>

<style scoped>
.modern-sections {
  width: 100%;
  min-height: 100vh;
  /* Fixed background image */
  background: url('https://c4.wallpaperflare.com/wallpaper/180/498/372/sydney-australia-sydney-opera-house-city-wallpaper-preview.jpg') no-repeat center center fixed;
  background-size: cover;
  padding: 0 0 40px 0;
  font-family: 'Roboto', 'Arial', sans-serif;
}

/* Transparent header style */
.transparent-header {
  background: rgba(255, 255, 255, 0.15) !important;
  box-shadow: none !important;
  backdrop-filter: blur(6px);
}

.main-title {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 32px auto;
  padding-top: 36px;
  animation: fadeInTitle 1s cubic-bezier(.4, 2, .6, 1);
}

.main-title-text {
  display: flex;
  align-items: center;
  font-size: 2.3rem;
  font-weight: 800;
  color: #6B46C1;
  letter-spacing: 1px;
  background: linear-gradient(90deg, #6B46C1 60%, #8A4AF3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  gap: 16px;
  transition: transform 0.2s cubic-bezier(.4, 2, .6, 1);
  cursor: pointer;
}

.main-title-text:hover {
  transform: scale(1.04) translateY(-2px);
  text-shadow: 0 4px 24px #D6BCFA;
}

.main-title-icon {
  margin-right: 8px;
  vertical-align: middle;
  transition: transform 0.3s cubic-bezier(.4, 2, .6, 1);
}

.main-title-text:hover .main-title-icon {
  transform: rotate(20deg) scale(1.1);
}

@keyframes fadeInTitle {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.service-section {
  display: flex;
  align-items: center;
  min-height: 320px;
  margin: 40px auto;
  max-width: 1100px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(107, 70, 193, 0.08);
  overflow: hidden;
  position: relative;
  opacity: 0;
  animation: fadeInSection 0.8s forwards;
}

/* Directional animation classes */
.slide-in-right {
  animation-name: slideInRight;
}

.slide-in-left {
  animation-name: slideInLeft;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(80px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-80px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
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
  background: #D6BCFA;
}

.section-img img {
  width: 100%;
  height: 100%;
  min-height: 300px;
  object-fit: cover;
  border-radius: 10px;
  opacity: 0.7;
  z-index: 1;
}

.img-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(107, 70, 193, 0.08), rgba(214, 188, 250, 0.18));
  z-index: 2;
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
  color: #6B46C1;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 28px;
}

.learn-more-btn {
  background: #6B46C1;
  color: #fff;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.10);
  transition: all 0.3s cubic-bezier(.4, 2, .6, 1), transform 0.3s cubic-bezier(.4, 2, .6, 1);
}

.learn-more-btn:hover {
  background: #8A4AF3;
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
