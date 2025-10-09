<template>
  <div class="modern-sections">
    <BannerMeteor :title="$t('navigate_your_life.cards.publictransportation.title')"
      :subtitle="$t('navigate_your_life.cards.publictransportation.subtitle')" :badges="transportBadges"
      :main-icon="mainIcon" />

    <div>
      <section v-for="(card, idx) in cards" :key="card.route" class="service-section"
        :class="{ reverse: idx % 2 === 1 }" :data-aos="idx % 2 === 0 ? 'fade-right' : 'fade-left'"
        :data-aos-delay="`${0 + idx * 100}`" aria-label="Public Transport Card Section">
        <div class="section-img">
          <div class="img-hover-wrapper" @click="goTo(card.route)">
            <img :src="card.img" :alt="card.title()" class="card-img-top" />
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
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { h } from 'vue';
import BannerMeteor from '@/components/BannerMeteor.vue'

const { t, locale } = useI18n({ useScope: 'global' });
const router = useRouter();

const mainIcon =   // Car Side SVG badge
{
  icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', width: '70', height: '70', fill: 'none' }, [
    h('path', { fill: '#ffffff', d: 'm15 6.1l-1.4-2.9c-.4-.7-1.1-1.2-1.9-1.2H4.3c-.8 0-1.5.5-1.9 1.2L1 6.1c-.6.1-1 .6-1 1.1v3.5c0 .6.4 1.1 1 1.2v2c0 .6.5 1.1 1.1 1.1H3c.5 0 1-.5 1-1.1V12h8v1.9c0 .6.5 1.1 1.1 1.1h.9c.6 0 1.1-.5 1.1-1.1v-2c.6-.1 1-.6 1-1.2V7.2c-.1-.5-.5-1-1.1-1.1zM4 8.4c0 .3-.3.6-.6.6H1.6c-.3 0-.6-.3-.6-.6v-.8c0-.3.3-.6.6-.6h1.8c.3 0 .6.3.6.6v.8zm6 2.6H6v-1h4v1zM2.1 6l1.2-2.4c.2-.4.6-.6 1-.6h7.4c.4 0 .8.2 1 .6L13.9 6H2.1zM15 8.4c0 .3-.3.6-.6.6h-1.8c-.3 0-.6-.3-.6-.6v-.8c0-.3.3-.6.6-.6h1.8c.3 0 .6.3.6.6v.8z' })
  ]),
  text: 'Car',
  translationKey: 'facility.badges.car'
}


// Transport badges for public transportation
const transportBadges = [

  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z' })
    ]),
    text: 'Bus'
  },
  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M4 15.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V5c0-3.5-3.58-4-8-4s-8 .5-8 4v10.5zm8 1.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-7H6V5h12v5z' })
    ]),
    text: 'Train'
  },
  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M19 16.94V8.5c0-2.79-2.61-3.4-6.01-3.49l.76-1.51H17V2H7v1.5h4.75l-.76 1.52C7.86 5.11 5 5.73 5 8.5v8.44c0 1.45 1.19 2.66 2.59 2.97L6 21.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 20h-.08c1.69 0 2.58-1.37 2.58-3.06zm-7 1.56c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5-4.5H7V9h10v5z' })
    ]),
    text: 'Tram'
  },
  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z' })
    ]),
    text: 'Myki'
  }
]

const cards = [
  {
    title: () => t('navigate_your_life.cards.publictransportation.publictransportation_card.cards.myki.myki_title', locale.value),
    desc: () => t('navigate_your_life.cards.publictransportation.publictransportation_card.cards.myki.myki_desc', locale.value),
    img: 'https://i.redd.it/myki-seems-to-have-gotten-a-redesign-anyone-know-why-v0-nypuvj0pmpsd1.jpg?width=1493&format=pjpg&auto=webp&s=6f8f7d824d36800257432263bea83e3d0c839de7',
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
  background: #ffffff;
  width: 100%;
  min-height: 100vh;
  padding: 0 0 40px 0;
  font-family: 'Roboto', 'Arial', sans-serif;
}

.service-section {
  display: flex;
  align-items: center;
  min-height: 350px;
  margin: 40px auto;
  max-width: 1100px;
  background: #fff;
  border-radius: 16px;
  border: 2px solid #e0d4f7;
  box-shadow: 0 4px 16px rgba(107, 70, 193, 0.12);
  overflow: hidden;
  position: relative;
  /* Remove custom animation, use AOS for entrance */
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
