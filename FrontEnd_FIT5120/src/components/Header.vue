<template>
  <div class="header-w">
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm header-navbar">
      <div class="container-fluid">
        <router-link class="navbar-brand fw-bold fs-2 logo-link" to="/">{{$t('nav.brand')}}</router-link>
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
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/facilities">{{$t('nav.facility')}}</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/learnenglish">{{$t('nav.english')}}</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/socialnorms">{{$t('nav.social')}}</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/navigatelife">{{$t('nav.navigate')}}</router-link>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{$t('nav.language')}}
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click.prevent="setLang('en')">{{$t('nav.lang.en')}}</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="setLang('zh')">{{$t('nav.lang.zh')}}</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="setLang('vi')">{{$t('nav.lang.vi')}}</a></li>
                <li><a class="dropdown-item" href="#" @click.prevent="setLang('id')">{{$t('nav.lang.id')}}</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
function setLang(lang) {
  locale.value = lang
  localStorage.setItem('locale', lang)
}
</script>

<style scoped>
.header-w {
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-navbar {
  background: #fff;
  box-shadow:
    0 4px 24px rgba(162, 89, 230, 0.08),
    0 1.5px 6px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.3s;
}
.logo-link {
  color: #a259e6 !important;
  letter-spacing: 1px;
  transition: color 0.2s;
}
.logo-link:hover {
  color: #7c3aed !important;
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
    box-shadow 0.2s;
}
.navbar-nav .nav-link:hover {
  background: #d1aaff;
  color: #222;
  box-shadow: 0 2px 12px #d1aaff44;
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
}
.dropdown-menu {
  border-radius: 14px;
  box-shadow: 0 8px 32px #a259e622, 0 1.5px 6px #a259e611;
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
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
}
.dropdown-item:hover, .dropdown-item:focus {
  background: #d1aaff;
  color: #222;
  box-shadow: 0 2px 12px #d1aaff44;
}
.dropdown-item.active, .dropdown-item:active {
  background: #a259e6;
  color: #fff;
  font-weight: 600;
}
@media (max-width: 991px) {
  .navbar-nav .nav-link {
    margin: 6px 0;
    text-align: center;
  }
}
</style>
