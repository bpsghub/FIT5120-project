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
        <!-- LanguageSwitcher removed: language is now set globally via Header -->
      </div>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/Header.vue'
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
const router = useRouter();
const { t } = useI18n();

const cards = computed(() => [
  {
    key: 'meetingpeople',
    title: t('socialnorms.meetingpeople.title'),
    text: t('socialnorms.meetingpeople.subtitle'),
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
  },
  {
    key: 'eatingout',
    title: t('socialnorms.eatingout.title'),
    text: t('socialnorms.eatingout.subtitle'),
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
  },
]);

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

/* LanguageSwitcher styles removed */
</style>
