<template>
  <div class="public-transport-container container-fluid py-4">
    <Header />
    <div class="banner mb-4">
      <h1>Public Transportation</h1>
      <p>Understand how to catch public transport, read timetables, and use your travel card.</p>
    </div>
    <div class="row justify-content-center">
      <div class="col-12 col-md-10">
        <div class="row g-4 justify-content-center">
          <div v-for="card in cards" :key="card.title" class="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
            <div class="portfolio__item card shadow-sm border-0 w-100 h-100" style="min-height:260px; cursor:pointer;"
              @click="goTo(card.route)">
              <div class="card-img-wrapper position-relative w-100 h-100">
                <img :src="card.img" class="card-img-top object-fit-cover w-100 h-100"
                  style="min-height:220px; max-height:260px; transition:transform 0.5s;" alt="" />
                <div class="portfolio__overlay d-flex flex-column justify-content-end align-items-start p-3">
                  <div class="text-white fw-bold fs-5 mb-1">{{ card.title }}</div>
                  <div class="text-white-50 small">{{ card.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="lang-switcher">
        <LanguageSwitcher v-model="lang" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

import { useRouter } from 'vue-router'
const lang = ref('en')
const router = useRouter()
const cards = [
  {
    title: 'MyKi Card',
    desc: 'Travel Card',
    img: 'https://www.travelvictoria.com.au/images/victoria/transport/ticketing/myki.jpg',
    route: '/mykicardlearning',
  },
  {
    title: 'Bus',
    desc: 'Public Bus',
    img: 'https://comfortdelgro.com.au/wp-content/uploads/22-Comfort-Delgro-CDC-Bus-Photo-Shoot-19Nov-DSC_9991.webp',
    route: '/buslearning',
  },
  {
    title: 'Train',
    desc: 'Train Service',
    img: 'https://upload.wikimedia.org/wikipedia/commons/2/27/City_of_Maryborough_Platform_10_Roma_Street_Station_Brisbane_P1280919_%28cropped%29.jpg',
    route: '/trainlearning',
  },
  {
    title: 'Tram',
    desc: 'Melbourne Tram',
    img: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Melbourne_Tram_E-Class_6007.jpg',
    route: '/tramlearning',
  },
]

function goTo(route) {
  router.push(route)
}
</script>

<style scoped>
.public-transport-container {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.banner {
  background: #d13c3c;
  color: #fff;
  padding: 40px 0 20px 0;
  text-align: center;
  font-family: 'Quicksand', 'Arial', sans-serif;
  border-bottom: 8px dashed #fff;
}

.banner h1 {
  font-size: 2.5rem;
  font-family: 'Quicksand', 'Arial', sans-serif;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.banner p {
  font-size: 1.2rem;
  margin: 0 auto;
  max-width: 900px;
}

.portfolio__item {
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  background: #e2c75c;
  min-height: 260px;
  transition: box-shadow 0.3s;
}

.card-img-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.card-img-top {
  border-radius: 10px;
  object-fit: cover;
  width: 100%;
  height: 100%;
  transition: filter 0.5s, transform 0.5s;
}

.portfolio__item::before {
  content: "";
  width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  left: -100%;
  display: block;
  background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%);
  transform: skewX(-25deg);
  transition: all 0.75s;
  z-index: 2;
}

.portfolio__item:hover::before {
  left: 125%;
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
}

.portfolio__item:hover .portfolio__overlay {
  opacity: 1;
}

.portfolio__item:hover .card-img-top {
  filter: brightness(0.7);
  transform: scale(1.08);
}

.lang-switcher {
  position: fixed;
  right: 48px;
  top: 50%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 100;
}

@media (max-width: 1200px) {
  .transport-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px 16px;
    margin-left: 0;
  }
}

@media (max-width: 900px) {
  .main-content {
    flex-direction: column;
    align-items: center;
    margin-top: 24px;
  }

  .lang-switcher {
    position: static;
    flex-direction: row;
    justify-content: center;
    margin-top: 32px;
  }
}

@media (max-width: 600px) {
  .portfolio__item {
    min-height: 180px;
  }

  .card-img-top {
    min-height: 120px;
    max-height: 180px;
  }
}
</style>
