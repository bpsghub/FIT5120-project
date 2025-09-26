<script setup>
import Header from '@/components/Header.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div>
    <Header />
    <div class="homeview-bg-wrapper w-100">
      <div class="homeview-bg-overlay"></div>
      <div class="homeview-content d-flex align-items-center">
        <!-- Banner section using Bootstrap grid -->
        <section class="banner-section container ">
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
          <div class="d-flex flex-column align-items-center mt-5">
            <span class="get-started-text mb-2">Let's get started</span>
            <div class="chevron-animate mt-2">
              <i class="fa-solid fa-chevron-down fa-2x"></i>
            </div>
          </div>
        </section>
      </div>
    </div>
    <section class="our_mission w-100">
      <div class=" mission_banner text-white w-100 d-flex justify-content-center align-items-center py-5 fw-bold fs-4">
        <p class="p_ourmission border-white">Helping older adults build connections, learn new skills, and feel truly at
          home in
          Australia</p>
      </div>
      <div class="our_mission_main row gx-0 align-items-stretch">
        <div class="our_mission_left col-12 col-md-6"></div>
        <div class="col-12 col-md-6 d-flex align-items-center position-relative p-0 wow">
          <div class="ourmission_content w-100 text-start">
            <h2 class="fw-semibold mb-3">Our mission</h2>
            <p class="p_subtitle">
              Our mission is to empower older adults to confidently embrace life in Australia.
              We provide resources, guidance, and a supportive community to help seniors connect, learn, and thrive.
              By bridging cultures and generations, we aim to ensure every senior feels welcome, valued, and at home in
              their new environment
            </p>
          </div>
        </div>
      </div>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <p class="animate__animated animate__fadeInUp wow">Hello</p>
    </section>
  </div>
</template>

<style scoped>
h2 {
  font-size: 2.5rem
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
  background-image: url('https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-attachment: fixed;
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



.our_mission_left {
  flex: 1 1 50%;
  min-width: 0;
  min-height: 600px;
  background-image: url('https://static.wixstatic.com/media/9d0f12_2673b1f519594338983efe92d82543cc~mv2.jpg/v1/fill/w_832,h_836,al_c,q_85,enc_avif,quality_auto/9d0f12_2673b1f519594338983efe92d82543cc~mv2.jpg');
  background-size: contain;
  background-position: left center;
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
  max-width: 600px;
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

.mission_banner {
  background-color: #BE36EC
}

.p_ourmission {
  border: black 2px solid;
  padding: 20px;
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

.get-started-text {
  display: inline-block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
  cursor: pointer;
  transition: color 0.2s, text-shadow 0.2s, transform 0.2s;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

.get-started-text:hover {
  color: #BE36EC;
  text-shadow: 0 4px 16px #be36ec99, 0 2px 8px rgba(0, 0, 0, 0.18);
  transform: scale(1.08) translateY(-2px);
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
  animation: arrowDown 1s linear 0s infinite;
}
</style>
