<template>
  <div class="eating-out-container">
    <header class="header">
      <div class="logo">Ankang Life</div>
      <nav class="nav">
        <router-link to="/facilities">Find Facility / Event</router-link>
        <router-link to="/learnenglish">Learn English</router-link>
        <router-link to="/socialnorms">Social Norms</router-link>
        <router-link to="/navigatelife">Navigate your Life</router-link>
      </nav>
    </header>
    <div class="banner">
      <h1>Eating Out</h1>
      <p>Understand the dining customs in Australia — including how to order, share meals, and show respect.</p>
    </div>
    <div class="content-box">
      <EatingOutContent :lang="lang" />
    </div>
    <div class="lang-switcher">
      <div :class="['lang-btn', lang === 'en' ? 'active' : '']" @click="lang = 'en'">EN</div>
      <div :class="['lang-btn', lang === 'cn' ? 'active' : '']" @click="lang = 'cn'">CN</div>
      <div :class="['lang-btn', lang === 'vn' ? 'active' : '']" @click="lang = 'vn'">VN</div>
      <div :class="['lang-btn', lang === 'id' ? 'active' : '']" @click="lang = 'id'">ID</div>
    </div>
    <div class="quiz-btn-row">
      <button class="quiz-btn">
        Take the Quiz
        <span class="play-icon">
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="16" fill="#B6E24B" />
            <polygon points="13,10 23,16 13,22" fill="#fff" />
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import EatingOutContent from '@/components/EatingOutContent.vue';
export default {
  name: 'EatingOut',
  components: { EatingOutContent },
  data() {
    return {
      lang: 'en',
    };
  },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #222;
  padding: 24px 0 8px 0;
  margin-bottom: 0px;
}

.logo {
  font-family: 'Brush Script MT', cursive;
  font-size: 2.5rem;
  margin-left: 48px;
  font-weight: bold;
}

.nav {
  display: flex;
  gap: 32px;
  margin-right: 48px;
}

.nav a {
  color: #222;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav a.router-link-exact-active {
  color: #a259e6;
}

.eating-out-container {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.banner {
  background: #97b34a;
  color: #222;
  padding: 48px 0 32px 0;
  text-align: center;
  font-family: 'Quicksand', 'Arial', sans-serif;
  border-top: 0px solid #fff;
  border-bottom: 8px dashed #fff;
}

.banner h1 {
  font-size: 2.3rem;
  font-family: 'Quicksand', 'Arial', sans-serif;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.banner p {
  font-size: 1.2rem;
  margin: 0 auto;
  max-width: 900px;
}

.content-box {
  background: #e5e5e5;
  margin: 40px auto 0 auto;
  width: 85vw;
  max-width: 900px;
  min-height: 250px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #222;
}

.placeholder {
  font-size: 2rem;
  color: #222;
  text-align: center;
}

.lang-switcher {
  position: fixed;
  right: 48px;
  top: calc(120px + 96px);
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
  transition: opacity 0.2s, background 0.2s;
}

.lang-btn.active {
  background: #d1aaff;
  color: #222;
  opacity: 1;
}

.quiz-btn-row {
  display: flex;
  justify-content: flex-end;
  margin: 32px 60px 0 0;
}

.quiz-btn {
  background: #661aff;
  color: #fff;
  font-size: 1.5rem;
  border: none;
  border-radius: 12px;
  padding: 12px 32px 12px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102, 26, 255, 0.10);
  transition: background 0.2s;
}

.quiz-btn:hover {
  background: #a259e6;
}

.play-icon {
  display: flex;
  align-items: center;
}

@media (max-width: 900px) {
  .lang-switcher {
    position: static;
    flex-direction: row;
    justify-content: center;
    margin-top: 32px;
  }
}
</style>
