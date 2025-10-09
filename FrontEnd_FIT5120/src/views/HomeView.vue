<script setup>
import { useI18n } from 'vue-i18n'

import { useRouter } from 'vue-router'
const { t } = useI18n()
const router = useRouter()

function goToFacility() {
  router.push('/FacilityEvent')
}
function goToEnglish() {
  router.push('/learnenglish')
}
function goToSocialNorms() {
  router.push('/socialnorms')
}
function goToNavigate() {
  router.push('/navigatelife')
}

function scrollToMission() {
  const el = document.querySelector('.our_mission')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div>
    <div class="homeview-bg-wrapper w-100">
      <video autoplay loop muted playsinline class="bg-video w-100">
        <source src="./../../public/Home_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div class="homeview-content d-flex align-items-center">
        <!-- Banner section using Bootstrap grid -->
        <section class="banner-section container">
          <div class="row align-items-center">
            <div class="col-12 col-lg-6 text-center">
              <h2 class="banner_title" data-aos="fade-up">{{ t('nav.brand') }}</h2>
            </div>
            <div class="col-12 col-lg-6">
              <div class="banner_content" data-aos="fade-left">
                <p class="banner_desc">
                  {{ t('home.desc') }}
                </p>
              </div>
            </div>
          </div>
          <div class="d-flex flex-column align-items-center mt-5">
            <span class="get-started-text mb-2" data-aos="fade-up" data-aos-delay="200" @click="scrollToMission">{{
              t('home.lets_get_started') }}</span>
            <div class="chevron-animate mt-2" data-aos="fade-down" data-aos-delay="400">
              <i class="fa-solid fa-chevron-down fa-2x"></i>
            </div>
          </div>
        </section>
      </div>
    </div>
    <section class="our_mission w-100">
      <div class="mission_banner text-white w-100 d-flex justify-content-center align-items-center py-5 fw-bold fs-4">
        <p class="p_ourmission border-white">{{ t('home.helping_older') }}</p>
      </div>
      <div class="our_mission_main d-flex align-items-stretch" style="min-height: 600px">
        <div class="our_mission_left" style="flex: 6 1 0" data-aos="fade-right" data-aos-delay="200"></div>
        <div class="our_mission_right d-flex align-items-center position-relative p-0" style="flex: 5 1 0"
          data-aos="fade-left" data-aos-delay="400">
          <div class="ourmission_content w-100 text-start">
            <h2 class="fw-semibold mb-3" data-aos="fade-up">
              {{ t('home.our_mission.our_mission_title') }}
            </h2>
            <p class="p_subtitle" data-aos="fade-up" data-aos-delay="200">
              {{ t('home.our_mission.our_mission_desc') }}
            </p>
          </div>
        </div>
        <div class="our_mission_remain our-features-header-yellow-col col-md-1 d-none d-md-flex"
          style="background-color: rgb(181, 88, 74) !important" data-aos="fade-down" data-aos-delay="600">
          <span class="vertical-text-mission">{{ t('home.our_mission.our_mission_title') }}</span>
        </div>
      </div>
    </section>

    <!-- Our Features Cards Section -->
    <section class="our_features_section w-100">
      <div class="our-features-section-flex">
        <div class="our-features-header-yellow-col col-md-1 d-none d-md-flex" data-aos="fade-down" data-aos-delay="200">
          <span class="vertical-text">{{ t('home.our_features.our_features_title') }}</span>
        </div>
        <div class="our-features-main-content col-md-11">
          <div class="our-features-header-bg d-flex justify-content-center align-items-center w-100" data-aos="fade-up"
            data-aos-delay="400">
            <span class="our-features-header-title">{{
              t('home.our_features.our_features_title')
            }}</span>
          </div>
          <div class="features-container">
            <div class="feature-card" data-aos="fade-up" data-aos-delay="50" @click="goToFacility"
              style="cursor: pointer">
              <div class="feature-icon"><i class="fa-solid fa-map"></i></div>
              <h3 class="feature-title">
                {{ t('home.our_features.our_features_cards.facility.facility_title') }}
              </h3>
              <p class="feature-desc">
                {{ t('home.our_features.our_features_cards.facility.description') }}
              </p>
              <button class="learn-more-btn" @click.stop="goToFacility">
                {{ t('button_learnmore.label') }}
              </button>
            </div>
            <div class="feature-card" data-aos="fade-up" data-aos-delay="100" @click="goToEnglish"
              style="cursor: pointer">
              <div class="feature-icon"><i class="fa-brands fa-leanpub"></i></div>
              <h3 class="feature-title">
                {{ t('home.our_features.our_features_cards.learning.learning_title') }}
              </h3>
              <p class="feature-desc">
                {{ t('home.our_features.our_features_cards.learning.description') }}
              </p>
              <button class="learn-more-btn" @click.stop="goToEnglish">
                {{ t('button_learnmore.label') }}
              </button>
            </div>
            <div class="feature-card" data-aos="fade-up" data-aos-delay="150" @click="goToSocialNorms"
              style="cursor: pointer">
              <div class="feature-icon"><i class="fa-solid fa-user-group"></i></div>
              <h3 class="feature-title">
                {{ t('home.our_features.our_features_cards.social.social_title') }}
              </h3>
              <p class="feature-desc">
                {{ t('home.our_features.our_features_cards.social.description') }}
              </p>
              <button class="learn-more-btn" @click.stop="goToSocialNorms">
                {{ t('button_learnmore.label') }}
              </button>
            </div>
            <div class="feature-card" data-aos="fade-up" data-aos-delay="200" @click="goToNavigate"
              style="cursor: pointer">
              <div class="feature-icon"><i class="fa-solid fa-hand-holding-heart"></i></div>
              <h3 class="feature-title">
                {{ t('home.our_features.our_features_cards.navigate.navigate_title') }}
              </h3>
              <p class="feature-desc">
                {{ t('home.our_features.our_features_cards.navigate.description') }}
              </p>
              <button class="learn-more-btn" @click.stop="goToNavigate">
                {{ t('button_learnmore.label') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
}

@media (max-width: 768px) {
  .ourmission_content {
    padding-top: 20px !important;
    padding-bottom: 20px !important;
  }
}

@media (max-width: 768px) {
  .our_mission_main {
    flex-direction: column !important;
    min-height: unset;
  }

  .our_mission_left,
  .our_mission_right,
  .our_mission_remain {
    width: 100% !important;
    min-width: unset !important;
    max-width: unset !important;
    flex: unset !important;
  }

  .our_mission_remain {
    justify-content: flex-start;
    min-height: 60px;
    height: 60px;
  }
}

h2 {
  font-size: 2.5rem;
}

.p_subtitle {
  font-size: 1.25rem;
}

.sticky-wrapper {
  padding: 0;
}

.left_content {
  top: 0;
  height: 500px;
  z-index: 2;
  background-image: url('https://static.wixstatic.com/media/9d0f12_2673b1f519594338983efe92d82543cc~mv2.jpg/v1/fill/w_832,h_836,al_c,q_85,enc_avif,quality_auto/9d0f12_2673b1f519594338983efe92d82543cc~mv2.jpg');
  background-size: cover;
  background-position: left center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-color: #fff;
}

/* Background wrapper with image */
.homeview-bg-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
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

.get-started-text {
  display: inline-block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
  cursor: pointer;
  transition:
    color 0.2s,
    text-shadow 0.2s,
    transform 0.2s;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

.get-started-text:hover {
  color: #be36ec;
  text-shadow:
    0 4px 16px #be36ec99,
    0 2px 8px rgba(0, 0, 0, 0.18);
  transform: scale(1.08) translateY(-2px);
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

@keyframes arrowDown {
  from {
    opacity: 1;
    transform: translateY(-50px);
  }

  to {
    opacity: 0;
    transform: translateY(0);
  }
}

.chevron-animate i {
  margin-top: 50px;
  font-size: 30px;
}

/* Our mission  */
.our_mission_left {
  height: auto;
  min-height: 300px;
  background-image: url('https://www.10000steps.org.au/media/images/Physical-Activity-Recommendations-for-Older-Aus.original.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.our_mission_main .left_content {
  top: 0;
  height: 600px;
  max-height: 700px;
  min-height: 400px;
  z-index: 2;
}

.our_mission_main .left_content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ourmission_content {
  /* max-width: 600px; */
  width: 100%;
  text-align: start;
  padding: 0% 10%;
}

.our_mission_main .right_content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 600px;
}

.our_mission_main .column_remain {
  height: 100%;
  width: 100%;
  background-color: #be36ec;
}

.mission_banner {
  background-color: #be36ec;
}

.p_ourmission {
  border: black 2px solid;
  padding: 20px;
}

/* Thanh vàng bên trái cho Our Mission */
.our_mission_remain {
  background: #facf46 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.vertical-text-mission {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 2.3rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.12em;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  font-family: 'Inter', sans-serif;
}

/* Our Feature  */
.our_features .our_feature_remain {
  background-color: rgb(250, 191, 70);
}

.learn-more-btn {
  background: #6b46c1;
  color: #fff;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    all 0.3s cubic-bezier(0.4, 2, 0.6, 1),
    transform 0.3s cubic-bezier(0.4, 2, 0.6, 1);
}

.learn-more-btn:hover {
  background: #8a4af3;
  transform: scale(1.05);
}

/* Our Features Section Redesign */

.our-features-header-section {
  width: 100vw;
  min-height: 220px;
  margin: 0;
  padding: 0;
}

.our-features-header-content {
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  background: rgba(0, 0, 0, 0.25);
}

.our-features-header-title {
  color: #fff;
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  font-family: 'Inter', sans-serif;
}

.our_features_section {
  width: 100vw;
  background: #faf7f2;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.our-features-section-flex {
  display: flex;
  flex-direction: row;
  width: 100vw;
  min-height: 100%;
}

.our-features-header-yellow-col {
  background: #facf46;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.07);
}

.vertical-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 2.3rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.12em;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  font-family: 'Inter', sans-serif;
}

.our-features-main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.our-features-header-title {
  color: #fff;
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  font-family: 'Inter', sans-serif;
}

.features-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  max-width: 1400px;
  width: 90vw;
  margin: 0 auto;
  padding: 60px 0 60px 0;
}

.our-features-bg {
  display: flex;
  flex-direction: row;
  width: 100vw;
  min-height: 500px;
  background-image: url('https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
}

.our-features-yellow-col {
  width: 80px;
  min-width: 60px;
  background: #facf46;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.vertical-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.1em;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

.our-features-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  background: rgba(255, 255, 255, 0.85);
  min-height: 500px;
  z-index: 1;
}

.features-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  max-width: 1400px;
  width: 90vw;
}

.feature-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  padding: 40px 24px 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition:
    box-shadow 0.12s,
    border-color 0.12s,
    transform 0.12s;
  min-height: 370px;
  cursor: pointer;
}

.feature-card:hover {
  box-shadow:
    0 12px 36px 0 rgba(106, 68, 255, 0.18),
    0 2px 8px rgba(190, 54, 236, 0.12);
  border-color: #be36ec;
  transform: translateY(-8px) scale(1.04) !important;
}

.feature-icon {
  font-size: 3.2rem;
  color: #6b46c1;
  margin-bottom: 18px;
}

.feature-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.feature-desc {
  font-size: 1.05rem;
  color: #444;
  margin-bottom: 28px;
}

/* Header features section layout */
.our-features-header-section {
  width: 100vw;
  min-height: 220px;
  margin: 0;
  padding: 0;
}

.our-features-header-bg {
  width: 100vw;
  min-height: 220px;
  background-image: url('https://www.eatthis.com/wp-content/uploads/sites/4/2021/08/shutterstock_older-man-lifting-weights.jpeg?quality=82&strip=all');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  position: relative;
  overflow: hidden;
}

.our-features-header-yellow-col {
  width: 90px;
  min-width: 70px;
  background: #facf46;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.07);
}

.vertical-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 2.3rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.12em;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  font-family: 'Inter', sans-serif;
}

.our-features-header-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  background: rgba(0, 0, 0, 0.22);
}

.our-features-header-title {
  color: #fff;
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  font-family: 'Inter', sans-serif;
}

@media (max-width: 1200px) {
  .features-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
  }
}

@media (max-width: 700px) {
  .features-container {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .feature-card {
    padding: 28px 10px 24px 10px;
    min-height: 0;
  }
}
</style>
