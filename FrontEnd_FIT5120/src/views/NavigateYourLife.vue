<template>
  <div class="modern-sections">
    <BannerMeteor :title="$t('navigate_your_life.title')"
      :subtitle="$t('navigate_your_life.subtitle', 'Your comprehensive guide to daily life in Australia')"
      :badges="lifeBadges" :mainIcon="mainIcon" />

    <div>
      <section v-for="(card, idx) in cards" :key="card.key" class="service-section" :class="{ reverse: idx % 2 === 1 }"
        :data-aos="idx % 2 === 0 ? 'fade-right' : 'fade-left'" :data-aos-delay="`${200 + idx * 100}`"
        aria-label="Navigate Your Life Section">
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
import { computed, onMounted, ref, h } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import BannerMeteor from '@/components/BannerMeteor.vue'

const router = useRouter();
const { t } = useI18n();

const mainIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 512 512',
  width: '48',
  height: '48',
}, [
  h('path', {
    fill: 'none',
    stroke: '#ffffff',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '32',
    d: 'M448 64L64 240.14h200a8 8 0 0 1 8 8V448Z'
  })
]);

// Life navigation badges
const lifeBadges = [
  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z' })
    ]),
    text: 'Transport'
  },
  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z' })
    ]),
    text: 'Shopping'
  },
  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z' })
    ]),
    text: 'Healthcare'
  }
]

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
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
}

.service-section:hover {
  border-color: #a259e6;
  box-shadow: 0 8px 24px rgba(162, 89, 230, 0.2);
  transform: translateY(-20px) scale(1.04);
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
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
}

.section-img::before {
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

.section-img:hover::before {
  left: 125%;
}

.section-img img {
  width: 100%;
  height: 100%;
  min-height: 300px;
  object-fit: cover;
  border-radius: 10px;
  opacity: 1;
  z-index: 1;
  transition: filter 0.5s, transform 0.5s;
}

.section-img:hover img {
  filter: brightness(0.7);
  transform: scale(1.08);
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
