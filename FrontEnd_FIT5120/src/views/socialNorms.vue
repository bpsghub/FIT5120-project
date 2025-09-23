<template>
  <div class="social-norms-container min-vh-100 d-flex flex-column">
    <AppHeader />
    <div class="banner">
      <h1>Social Norms</h1>
    </div>
    <div class="content-box">

      <div class="container py-4">
        <div class="row g-5 justify-content-center mb-4 w-100">
          <div v-for="card in cards" :key="card.key" class="col-12 col-md-6 col-lg-5">
            <div class="card h-100 text-decoration-none text-dark shadow-sm hover-shadow-lg" @click="goTo(card.key)"
              style="cursor:pointer">
              <img :src="card.img" class="card-img-top rounded-top" :alt="card.title"
                style="height: 220px; object-fit: cover" />
              <div class="card-body">
                <h5 class="card-title fw-bold">{{ card.title }}</h5>
                <p class="card-text">{{ card.text }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="lang-switcher">
          <LanguageSwitcher v-model="lang" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/Header.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const lang = ref('en');
const router = useRouter();

const cards = [
  {
    key: 'meetingpeople',
    title: 'Meeting New People',
    text: "G'day! Discover how to meet new people in Australia with a smile, a handshake, and a friendly greeting.",
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'eatingout',
    title: 'Eating Out',
    text: 'From menu to manners -- Learn what to expect when eating out in Australia.',
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
  },
]

function goTo(key) {
  if (key === 'meetingpeople') {
    router.push('/socialnorms/meetingpeople');
  } else if (key === 'eatingout') {
    router.push('/socialnorms/eatingout');
  }
}
</script>

<style scoped>
.social-norms-container {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
}

.banner {
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
  font-size: 1.1rem;
  color: #222;
}

.hover-shadow-lg:hover {
  box-shadow:
    0 12px 32px rgba(162, 89, 230, 0.18),
    0 2px 8px rgba(0, 0, 0, 0.08) !important;
  transform: translateY(-8px) scale(1.03);
  z-index: 2;
  transition:
    box-shadow 0.25s,
    transform 0.25s;
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

@media (max-width: 900px) {
  .lang-switcher {
    position: static;
    flex-direction: row;
    justify-content: center;
    margin-top: 32px;
  }
}

.lang-btn {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  opacity: 0.9;
  transition:
    opacity 0.2s,
    background 0.2s;
}

.lang-btn.active {
  background: #d1aaff !important;
  color: #222 !important;
  opacity: 1;
}

@media (max-width: 900px) {
  .lang-switcher {
    position: static !important;
    flex-direction: row !important;
    justify-content: center !important;
    margin-top: 32px !important;
    right: unset;
    top: unset;
  }
}
</style>
