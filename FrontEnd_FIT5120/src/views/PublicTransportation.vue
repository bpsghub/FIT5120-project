<template>
  <div class="modern-sections">
    <Header />
    <div class="main-title">
      <span class="main-title-text">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="main-title-icon">
          <circle cx="16" cy="16" r="16" fill="#D6BCFA" />
          <path d="M10 16h12M16 10v12" stroke="#6B46C1" stroke-width="2" stroke-linecap="round" />
        </svg>
        {{ $t('navigate_your_life.cards.publictransportation.title') }}
      </span>
    </div>
    <div class="main-description text-white">
      {{ $t('navigate_your_life.cards.publictransportation.subtitle') }}
    </div>
    <div>
      <section v-for="(card, idx) in cards" :key="card.route" :class="[
        'service-section',
        idx % 2 === 1 ? 'reverse' : '',
        idx === 0 ? 'slide-in-right' : idx === 1 ? 'slide-in-left' : 'slide-in-right'
      ]" :style="{ animationDelay: `${0.2 * idx}s` }" aria-label="Public Transport Card Section">
        <div class="section-img">
          <div class="img-hover-wrapper" @click="goTo(card.route)">
            <img :src="card.img" :alt="card.title()" class="card-img-top" />
            <div class="img-overlay"></div>
            <div class="portfolio__overlay">
              <div class="overlay-title">{{ card.title() }}</div>
              <!-- <div class="overlay-desc">{{ card.desc() }}</div> -->
            </div>
          </div>
        </div>
        <div class="section-content">
          <h2 class="section-title">{{ card.title() }}</h2>
          <p class="section-subtitle">{{ card.desc() }}</p>
          <button class="learn-more-btn" @click="goTo(card.route)">
            {{ $t('button_learnmore.label') }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t, locale } = useI18n({ useScope: 'global' });
const router = useRouter();
const cards = [
  {
    title: () => t('navigate_your_life.cards.publictransportation.publictransportation_card.cards.myki.myki_title', locale.value),
    desc: () => t('navigate_your_life.cards.publictransportation.publictransportation_card.cards.myki.myki_desc', locale.value),
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU6xyFfelYmqoDf-Ftr6mDE1pGGppnPeWiag&s',
    route: '/mykicardlearning',
  },
  {
    title: () => t('navigate_your_life.cards.publictransportation.publictransportation_card.cards.bus.bus_title', locale.value),
    desc: () => t('navigate_your_life.cards.publictransportation.publictransportation_card.cards.bus.bus_desc', locale.value),
    img: 'https://comfortdelgro.com.au/wp-content/uploads/22-Comfort-Delgro-CDC-Bus-Photo-Shoot-19Nov-DSC_9991.webp',
    route: '/buslearning',
  },
  {
    title: () => t('navigate_your_life.cards.publictransportation.publictransportation_card.cards.train.train_title', locale.value),
    desc: () => t('navigate_your_life.cards.publictransportation.publictransportation_card.cards.train.train_desc', locale.value),
    img: 'https://upload.wikimedia.org/wikipedia/commons/2/27/City_of_Maryborough_Platform_10_Roma_Street_Station_Brisbane_P1280919_%28cropped%29.jpg',
    route: '/trainlearning',
  },
  {
    title: () => t('navigate_your_life.cards.publictransportation.publictransportation_card.cards.tram.tram_title', locale.value),
    desc: () => t('navigate_your_life.cards.publictransportation.publictransportation_card.cards.tram.tram_desc', locale.value),
    img: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Melbourne_Tram_E-Class_6007.jpg',
    route: '/tramlearning',
  },
];

function goTo(route) {
  router.push(route);
}
</script>

<style scoped>
.modern-sections {
  background: url("https://a-us.storyblok.com/f/1018766/3000x1993/3b2b7ad9b4/sydney_australia.jpeg/m/1534x1019/filters:focal(1426x1709:1427x1710)") no-repeat center center fixed;
  background-size: cover;
  width: 100%;
  min-height: 100vh;
  padding: 0 0 40px 0;
  font-family: 'Roboto', 'Arial', sans-serif;
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


.main-description {
  width: 100%;
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 32px;
  font-family: 'Roboto', 'Arial', sans-serif;
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
  min-height: 350px;
  margin: 40px auto;
  max-width: 1100px;
  background: #fff;
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


.img-hover-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  transition: box-shadow 0.3s;
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
  opacity: 0.7;
  z-index: 1;
  transition: filter 0.5s, transform 0.5s;
}

.img-hover-wrapper:hover .card-img-top {
  filter: brightness(0.7);
  transform: scale(1.08);
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

/* .overlay-desc {
  color: #fff;
  font-size: 1rem;
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

  .main-description {
    font-size: 1rem;

    margin-bottom: 18px;
  }
}
</style>
