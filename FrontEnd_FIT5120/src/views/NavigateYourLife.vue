<template>
  <div class="navigate-life-container">
    <Header />
    <div class="banner">
      <h1>Navigate Your Life Independently</h1>
    </div>
    <div class="content-box">
      <div class="container py-4">
        <div class="row g-4 justify-content-center">
          <div
            v-for="(card, idx) in cards"
            :key="card.key"
            class="col-12 col-md-4 d-flex align-items-stretch"
          >
            <div
              class="navlife-card card shadow-sm h-100 border-0 text-center"
              @click="goTo(card.key)"
              style="cursor:pointer"
            >
              <div class="circle-img mx-auto my-3">
                <img :src="card.img" :alt="card.title" />
              </div>
              <div class="card-body">
                <h5 class="card-title mb-2">{{ card.title }}</h5>
                <p class="card-text">{{ card.text }}</p>
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
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const lang = ref('en')
const router = useRouter()

const cards = [
  {
    key: 'publictransportation',
    title: 'Ride Public Transportation',
    text: 'Get around Melbourne with ease — learn how to use buses, trains, and trams like a local.',
    img: 'https://cdn-icons-png.flaticon.com/512/3068/3068774.png',
  },
  {
    key: 'grocceries shopping',
    title: 'Groceries Shopping',
    text: 'From fresh veggies to rice and noodles — learn how to shop for your daily needs with confidence.',
    img: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
  },
  {
    key: 'medicalattention',
    title: 'Seek Medical Attention',
    text: 'Feeling unwell? Learn how to find a doctor, book an appointment, and get the care you need.',
    img: 'https://cdn-icons-png.flaticon.com/512/3068/3068787.png',
  },
]

function goTo(key) {
  if (key === 'publictransportation') {
    router.push('/publicTransportation')
  } else if (key === 'grocceries shopping') {
    router.push('/grocceriesShopping')
  } else if (key === 'medicalattention') {
    router.push('/medicalAttention')
  }
}
</script>

<style scoped>
.navigate-life-container {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.banner {
  background: #fff;
  color: #222;
  padding: 48px 0 32px 0;
  text-align: center;
  font-family: 'Quicksand', 'Arial', sans-serif;
  border-bottom: 0;
}
.banner h1 {
  font-size: 2.3rem;
  font-family: 'Quicksand', 'Arial', sans-serif;
  margin-bottom: 12px;
  letter-spacing: 1px;
}
.content-box {
  background: #fff;
  margin: 40px auto 0 auto;
  width: 100%;
  max-width: 1200px;
  min-height: 250px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #222;
}
.navlife-card {
  transition:
    transform 0.18s cubic-bezier(0.4, 2, 0.6, 1),
    box-shadow 0.18s cubic-bezier(0.4, 2, 0.6, 1);
  cursor: pointer;
  border-radius: 1.5rem;
  padding-bottom: 1rem;
}
.navlife-card:hover {
  transform: translateY(-8px) scale(1.04);
  box-shadow:
    0 8px 32px rgba(102, 26, 255, 0.18),
    0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid #4b8cff;
  background: #f8faff;
}
.circle-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #fff;
  border: 4px solid #4b8cff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  transition: border-color 0.2s;
}
.navlife-card:hover .circle-img {
  border-color: #661aff;
}
.circle-img img {
  width: 70px;
  height: 70px;
  object-fit: contain;
}
.card-title {
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #222;
}
.card-text {
  font-size: 1.1rem;
  color: #444;
}
.lang-switcher {
  position: fixed;
  right: 48px;
  top: calc(300px + 200px);
  /* header + banner height estimate */
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 100;
}

.lang-btn {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: #a259e6;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  opacity: 0.7;
  cursor: pointer;
  transition:
    opacity 0.2s,
    background 0.2s;
}

.lang-btn.active {
  background: #d1aaff;
  color: #222;
  opacity: 1;
}

@media (max-width: 900px) {
  .lang-switcher {
    position: static;
    flex-direction: row;
    justify-content: center;
    margin-top: 32px;
    right: unset;
    top: unset;
  }
}
</style>
