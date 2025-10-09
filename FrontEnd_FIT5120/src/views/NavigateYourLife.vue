<template>
  <div class="modern-sections">
    <BannerMeteor :title="$t('navigate_your_life.title')"
      :subtitle="$t('navigate_your_life.subtitle', 'Your comprehensive guide to daily life in Australia')" />

    <div>
      <section v-for="(card, idx) in cards" :key="card.key" :class="[
        'service-section',
        idx % 2 === 1 ? 'reverse' : '',
        idx === 0 ? 'slide-in-right' : idx === 1 ? 'slide-in-left' : 'slide-in-right'
      ]" :style="{ animationDelay: `${0.2 * idx}s` }" aria-label="Navigate Your Life Section">
        <div class="section-img">
          <img :src="card.img" :alt="card.title" />
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
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import BannerMeteor from '@/components/BannerMeteor.vue'

const router = useRouter();
const { t } = useI18n();

const cardKeys = [
  'publictransportation',
  'grocceriesshopping',
  'medicalattention',
];

const cardImages = {
  publictransportation: 'https://zivazmanov.com/wp-content/uploads/2013/05/Four-Great-Reasons-to-Use-Public-Transportation.jpg',
  grocceriesshopping: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  medicalattention: 'https://www.jonesfirmohio.com/wp-content/uploads/2020/09/shutterstock_457866949-1.jpg',
};

const cards = computed(() =>
  cardKeys.map((key) => ({
    key,
    title: t(`navigate_your_life.cards.${key}.title`),
    text: t(`navigate_your_life.cards.${key}.subtitle`),
    img: cardImages[key],
  }))
);

function goTo(key) {
  if (key === 'publictransportation') {
    router.push('/publicTransportation');
  } else if (key === 'grocceriesshopping') {
    router.push('/grocceriesShopping');
  } else if (key === 'medicalattention') {
    router.push('/medicalAttention');
  }
}

const loaded = ref(false);
onMounted(() => {
  setTimeout(() => (loaded.value = true), 100);
});
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
  opacity: 0;
  animation: fadeInSection 0.8s forwards;
  transition: all 0.3s ease;
}

.service-section:hover {
  border-color: #a259e6;
  box-shadow: 0 8px 24px rgba(162, 89, 230, 0.2);
  transform: translateY(-4px);
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
  opacity: 1;
  z-index: 1;
}

/* .img-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(107, 70, 193, 0.08), rgba(214, 188, 250, 0.18));
  z-index: 2;
} */

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
