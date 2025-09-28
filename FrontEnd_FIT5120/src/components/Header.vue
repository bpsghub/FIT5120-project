<template>
  <div class="header-w">
    <nav class="navbar navbar-expand-lg navbar-light header-navbar">
      <div class="container-fluid">
        <router-link class="navbar-brand fw-bold fs-2 logo-link" to="/">{{
          $t('nav.brand')
        }}</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <TransitionGroup tag="div" class="collapse navbar-collapse" id="navbarNav" name="nav-slide">
          <ul class="navbar-nav ms-auto" key="nav-list">
            <li class="nav-item" v-for="(link, index) in navLinks" :key="index">
              <router-link class="nav-link" :to="link.to">{{ $t(link.text) }}</router-link>
            </li>
            <li class="nav-item" v-for="(link, index) in navLinks_dropdown" :key="index">
              <router-link
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                :to="link.to"
              >
                {{ $t(link.text) }}
              </router-link>
              <TransitionGroup
                v-if="link.children === 'socialNorms'"
                tag="ul"
                class="dropdown-menu"
                name="dropdown-slide"
              >
                <li v-for="(link, index) in socialNorms" :key="index">
                  <!-- <a class="dropdown-item" href="#" @click.prevent="setLang(lang.code)">{{
                    $t(lang.text)
                  }}</a> -->
                  <router-link class="nav-link" :to="link.to">{{ $t(link.text) }}</router-link>
                </li>
              </TransitionGroup>
              <TransitionGroup
                v-if="link.children === 'navigateYourLife'"
                tag="ul"
                class="dropdown-menu"
                name="dropdown-slide"
              >
                <li v-for="(link, index) in navigateYourLife" :key="index">
                  <!-- <a class="dropdown-item" href="#" @click.prevent="setLang(lang.code)">{{
                    $t(lang.text)
                  }}</a> -->
                  <router-link class="nav-link" :to="link.to">{{ $t(link.text) }}</router-link>
                </li>
              </TransitionGroup>
            </li>

            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ $t('nav.language') }}
              </a>
              <TransitionGroup tag="ul" class="dropdown-menu" name="dropdown-slide">
                <li v-for="lang in languages" :key="lang.code">
                  <a class="dropdown-item" href="#" @click.prevent="setLang(lang.code)">{{
                    $t(lang.text)
                  }}</a>
                </li>
              </TransitionGroup>
            </li>
          </ul>
        </TransitionGroup>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const navLinks = [
  { to: '/facilities', text: 'nav.facility' },
  { to: '/learnenglish', text: 'nav.english' },
  {
    
  }
]
const navLinks_dropdown = [
  { to: '/socialnorms', text: 'nav.social', children: 'socialNorms' },
  { to: '/navigatelife', text: 'nav.navigate', children: 'navigateYourLife' },
]

const socialNorms = [
  {
    text: 'nav.main_view',
    to: '/socialnorms',
  },
  {
    text: 'socialnorms.meetingpeople.title',
    to: '/socialnorms/meetingpeople',
  },
  {
    text: 'socialnorms.eatingout.title',
    to: '/socialnorms/eatingout',
  },
]

const navigateYourLife = [
  {
    text: 'nav.main_view',
    to: '/navigatelife',
  },
  {
    text: 'navigate_your_life.cards.publictransportation.title',
    to: '/publicTransportation',
  },
  {
    text: 'navigate_your_life.cards.grocceriesshopping.title',
    to: '/grocceriesShopping',
  },
  {
    text: 'navigate_your_life.cards.publictransportation.title',
    to: '/publicTransportation',
  },
  {
    text: 'navigate_your_life.cards.medicalattention.title',
    to: '/medicalAttention',
  },
  {
    text: 'navigate_your_life.cards.publictransportation.publictransportation_card.cards.myki.myki_page.title',
    to: '/mykicardlearning',
  },
  {
    text: 'navigate_your_life.cards.publictransportation.publictransportation_card.cards.bus.bus_page.title',
    to: '/buslearning',
  },
  {
    text: 'navigate_your_life.cards.publictransportation.publictransportation_card.cards.train.train_page.title',
    to: '/trainlearning',
  },
  {
    text: 'navigate_your_life.cards.publictransportation.publictransportation_card.cards.tram.tram_page.title',
    to: '/tramlearning',
  },
]

const languages = [
  { code: 'en', text: 'nav.lang.en' },
  { code: 'zh', text: 'nav.lang.zh' },
  { code: 'vi', text: 'nav.lang.vi' },
  { code: 'id', text: 'nav.lang.id' },
]

function setLang(lang) {
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>

<style scoped>
.header-w {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.15) !important;
  box-shadow: none !important;
  backdrop-filter: blur(6px);
  transition: background 0.5s ease;
}

.header-w.scrolled {
  background: rgba(255, 255, 255, 0.25) !important;
}

.header-navbar {
  background: transparent;
  box-shadow:
    0 4px 24px rgba(162, 89, 230, 0.08),
    0 1.5px 6px rgba(0, 0, 0, 0.04);
  transition:
    box-shadow 0.3s,
    transform 0.3s;
}

.logo-link {
  color: #a259e6 !important;
  letter-spacing: 1px;
  transition:
    transform 0.2s,
    color 0.2s;
}

.logo-link:hover {
  color: #7c3aed !important;
  transform: scale(1.05);
  text-shadow: 0 2px 12px #d1aaff44;
}

.navbar-nav .nav-link {
  color: #6b21a8;
  font-weight: 500;
  border-radius: 12px;
  padding: 8px 18px;
  margin: 0 4px;
  transition:
    background 0.2s,
    color 0.2s,
    transform 0.2s;
}

.navbar-nav .nav-link:hover {
  background: linear-gradient(45deg, #d1aaff, #a259e6);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px #d1aaff66;
}

.router-link-exact-active.nav-link {
  background: #a259e6;
  color: #fff !important;
  font-weight: 600;
  box-shadow: 0 2px 12px #a259e644;
}

.navbar-nav .nav-link:active {
  background: #be8aed;
  color: #fff;
  transform: scale(0.98);
}

.dropdown-menu {
  border-radius: 14px;
  box-shadow:
    0 8px 32px #a259e622,
    0 1.5px 6px #a259e611;
  border: none;
  padding: 8px 0;
  min-width: 170px;
  background: #fff;
}

.dropdown-item {
  color: #6b21a8;
  font-weight: 500;
  border-radius: 8px;
  margin: 2px 8px;
  padding: 10px 18px;
  transition:
    background 0.18s,
    color 0.18s,
    transform 0.18s;
}

.dropdown-item:hover,
.dropdown-item:focus {
  background: linear-gradient(45deg, #d1aaff, #a259e6);
  color: #fff;
  transform: translateX(4px);
  box-shadow: 0 2px 12px #d1aaff44;
}

.dropdown-item.active,
.dropdown-item:active {
  background: #a259e6;
  color: #fff;
  font-weight: 600;
}

/* Animations */
.nav-slide-enter-active,
.nav-slide-leave-active {
  transition: all 0.3s ease;
}

.nav-slide-enter-from,
.nav-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition: all 0.3s ease;
}

.dropdown-slide-enter-from,
.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 991px) {
  .navbar-nav .nav-link {
    margin: 8px 0;
    text-align: center;
  }

  .dropdown-menu {
    text-align: center;
  }
}
</style>
