<script setup>
import Header from '@/components/Header.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <Header />
  <div class="homeview-bg-wrapper w-100">
    <div class="homeview-bg-overlay"></div>
    <div class="homeview-content d-flex align-items-center">
      <!-- Banner section using Bootstrap grid -->
      <section class="banner-section container">
        <div class="row align-items-center">
          <div class="col-12 col-lg-6 text-center">
            <h2 class="banner_title">{{ t('nav.brand') }}</h2>
          </div>
          <div class="col-12 col-lg-6">
            <div class="banner_content">
              <p class="banner_desc">
                {{ t('home.desc') }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Background wrapper with image */
.homeview-bg-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: top center;
}

/* Overlay with blurred background and opacity */
.homeview-bg-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('https://t4.ftcdn.net/jpg/05/97/49/09/360_F_597490918_dugDbSuqx6YSRmCaYiZJ6pCr37cXK3Rv.jpgg');
  background-size: cover;
  background-position: left bottom;
  opacity: 0.3;
  z-index: 1;
}

/* Content container */
.homeview-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
}

/* Banner section styling */
.banner-section {
  padding-top: 40px;
  color: #fff;
}

/* Banner content with semi-transparent background */
.banner_content {
  background-color: rgb(84 74 87 / 62%);
  padding: 5% 10%;
  border: 2px solid white;
}

/* Banner title styling */
.banner_title {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  font-size: clamp(2.5rem, 8vw, 5rem);
  margin-bottom: 1rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Banner description styling */
.banner_desc {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  text-align: center;
}

/* Button group styling (unchanged as requested) */
.banner_button_group :deep(.btn) {
  padding: 20px 40px;
  color: black;
  border: 0px solid black;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  background-color: white;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.banner_button_group :deep(.btn):hover {
  background: #f0f0f0 !important;
  color: #1a73e8 !important;
  box-shadow: 0 8px 32px rgba(26, 115, 232, 0.12) !important;
  transform: translateY(-2px) scale(1.03);
}

.banner_button_group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  max-width: 500px;
  margin: 0 auto;
}

/* Responsive adjustments for medium screens */
@media (max-width: 900px) {
  .banner_title {
    font-size: 2.2rem;
  }

  .banner_desc {
    font-size: 1rem;
  }

  .banner_content {
    padding: 24px 8px;
  }

  .banner_button_group :deep(.btn) {
    font-size: 1rem;
    padding: 14px 5px !important;
  }
}

/* Responsive adjustments for small screens */
@media (max-width: 600px) {
  .banner_content {
    padding: 12px 2px;
  }

  .banner_button_group {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 12px;
    max-width: 350px;
  }

  .banner_button_group :deep(.btn) {
    font-size: 0.95rem;
  }

  .banner_button_group :deep(.btn):nth-child(1) {
    padding: 10px 15px !important;
    grid-column: 1;
    grid-row: 1;
  }

  .banner_button_group :deep(.btn):nth-child(2) {
    padding: 10px 15px !important;
    grid-column: 2;
    grid-row: 1;
  }

  .banner_button_group :deep(.btn):nth-child(3) {
    padding: 10px 15px !important;
    grid-column: 1;
    grid-row: 2;
  }

  .banner_button_group :deep(.btn):nth-child(4) {
    padding: 10px 15px !important;
    grid-column: 2;
    grid-row: 2;
  }
}
</style>
