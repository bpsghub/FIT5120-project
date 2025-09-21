<template>
  <div class="social-norms-container bg-light min-vh-100 d-flex flex-column">
    <AppHeader />
    <main
      class="container flex-grow-1 d-flex flex-column align-items-center justify-content-center"
    >
      <div class="row g-5 justify-content-center mb-4 w-100">
        <div class="col-12 col-md-6 col-lg-5">
          <router-link
            class="card h-100 text-decoration-none text-dark shadow-sm hover-shadow-lg"
            :to="'/socialnorms/meetingpeople'"
          >
            <img
              src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"
              class="card-img-top rounded-top"
              alt="Meeting New People"
              style="height: 220px; object-fit: cover"
            />
            <div class="card-body">
              <h5 class="card-title fw-bold">Meeting New People</h5>
              <p class="card-text">
                <b>G'day!</b> Discover how to meet new people in Australia with a smile, a
                handshake, and a friendly greeting.
              </p>
            </div>
          </router-link>
        </div>
        <div class="col-12 col-md-6 col-lg-5">
          <router-link
            class="card h-100 text-decoration-none text-dark shadow-sm hover-shadow-lg"
            :to="'/socialnorms/eatingout'"
          >
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
              class="card-img-top rounded-top"
              alt="Eating Out"
              style="height: 220px; object-fit: cover"
            />
            <div class="card-body">
              <h5 class="card-title fw-bold">Eating Out</h5>
              <p class="card-text">
                From menu to manners -- Learn what to expect when eating out in Australia.
              </p>
            </div>
          </router-link>
        </div>
      </div>
      <div
        class="d-flex flex-column align-items-end position-absolute lang-switcher"
        style="right: 48px; top: 220px; gap: 16px"
      >
        <button
          class="btn btn-lg lang-btn mb-2 active"
          disabled
          style="background: #d1aaff; color: #222; border: none"
        >
          EN
        </button>
        <button
          class="btn btn-lg lang-btn mb-2"
          style="background: #be8aed; color: #fff; border: none"
        >
          CN
        </button>
        <button
          class="btn btn-lg lang-btn mb-2"
          style="background: #be8aed; color: #fff; border: none"
        >
          VN
        </button>
        <button class="btn btn-lg lang-btn mb-2" style="background: #be8aed; color: #fff; border: none">
          ID
        </button>
      </div>
    </main>
    <router-view />
  </div>
</template>

<script setup>
import AppHeader from '@/components/Header.vue'
</script>

<style scoped>
.social-norms-container {
  position: relative;
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
  }
}
</style>
