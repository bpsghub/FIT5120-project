<template>
  <header class="learning-banner">
    <div class="hero-gradient"></div>
    <div class="hero-particles">
      <span v-for="n in particleCount" :key="n" class="particle" :style="particleStyle(n)" />
    </div>
    <div class="hero-content">
      <h1 class="main-title" data-aos="fade-down" data-aos-delay="200">{{ title }}</h1>
      <h2 class="subtitle" data-aos="zoom-in" data-aos-delay="400">{{ subtitle }}</h2>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  particleCount: { type: Number, default: 18 },
  particleRadius: { type: Number, default: 120 },
  particleSpread: { type: Number, default: 40 },
  particleSize: { type: Number, default: 12 },
  particleSizeVar: { type: Number, default: 10 },
  particleDelay: { type: Number, default: 2 }
})

function particleStyle(n) {
  const angle = (n / props.particleCount) * 2 * Math.PI
  const radius = props.particleRadius + Math.random() * props.particleSpread
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  const size = props.particleSize + Math.random() * props.particleSizeVar
  const delay = Math.random() * props.particleDelay
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(60% + ${y}px)`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`
  }
}
</script>

<style scoped>
.learning-banner {
  position: relative;
  width: 100vw;
  min-height: 260px;
  background: linear-gradient(120deg, #E6E6FA 0%, #9370DB 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 32px;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, #E6E6FA 0%, #9370DB 100%);
  z-index: 0;
  pointer-events: none;
}

.hero-particles {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(155, 89, 182, 0.18);
  border-radius: 50%;
  box-shadow: 0 2px 8px #4B0082;
  animation: float 4s ease-in-out infinite alternate;
}

@keyframes float {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }

  100% {
    transform: translateY(-24px) scale(1.1);
    opacity: 1;
  }
}

.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
}

.main-title {
  font-family: 'Montserrat', Arial, sans-serif;
  font-size: 36px;
  color: #fff;
  font-weight: 700;
  text-shadow: 0 4px 16px rgba(75, 0, 130, 0.25);
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 24px;
  font-style: italic;
  color: #f8f8ff;
  font-weight: 400;
  margin-bottom: 0;
}
</style>
