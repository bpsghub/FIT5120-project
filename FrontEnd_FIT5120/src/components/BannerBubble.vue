<template>
  <header class="chatbot-banner">
    <div class="chat-background">
      <div class="message-bubbles">
        <div v-for="n in 12" :key="n" class="bubble" :style="bubbleStyle(n)">
          <span>{{ getBubbleText(n) }}</span>
        </div>
      </div>

      <div class="floating-particles">
        <div v-for="n in 30" :key="n" class="particle" :style="particleStyle(n)" />
      </div>
    </div>

    <div class="banner-content">
      <!-- Avatar with online status (only for chatbot) -->
      <div v-if="showAvatar" class="avatar-container" data-aos="zoom-in" data-aos-duration="1000">
        <div class="avatar-glow"></div>
        <div class="avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 9h-4v4h-2v-4H7V9h4V5h2v4h4v2z" />
          </svg>
        </div>
        <div class="status-dot"></div>
      </div>

      <!-- Custom icon (for other pages, without online status) -->
      <div v-else-if="customIcon" class="icon-container" data-aos="zoom-in" data-aos-duration="1000">
        <div class="icon-glow"></div>
        <div class="page-icon">
          <component :is="customIcon" />
        </div>
      </div>

      <h1 class="title" data-aos="fade-down" data-aos-delay="300">
        {{ title }}
      </h1>

      <p v-if="subtitle" class="subtitle" data-aos="fade-up" data-aos-delay="500">
        {{ subtitle }}
      </p>

      <div v-if="showTypingIndicator" class="typing-indicator" data-aos="zoom-in" data-aos-delay="700">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div v-if="showFeatureTags" class="feature-tags" data-aos="fade-up" data-aos-delay="900">
        <div class="tag" v-for="(feature, idx) in features" :key="idx" :style="{ animationDelay: `${idx * 0.1}s` }">
          <component :is="feature.icon" />
          <span>{{ feature.text }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { h } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Emma - Your English Buddy' },
  subtitle: { type: String, default: 'Practice English conversation in a friendly, relaxed way' },
  bubbleTexts: {
    type: Array,
    default: () => ['Hi!', 'Hello', 'Wave', 'How are you?', 'Great!', 'Smile', 'Let\'s chat', 'Nice!', 'Star', 'Good job', 'Thanks', 'Chat']
  },
  showTypingIndicator: { type: Boolean, default: false },
  showFeatureTags: { type: Boolean, default: false },
  showAvatar: { type: Boolean, default: false },
  customIcon: { type: Function, default: null }
})

function bubbleStyle(n) {
  const positions = [
    { left: '5%', top: '10%' },
    { left: '15%', top: '60%' },
    { left: '85%', top: '15%' },
    { left: '90%', top: '70%' },
    { left: '8%', top: '80%' },
    { left: '75%', top: '45%' },
    { left: '25%', top: '25%' },
    { left: '65%', top: '80%' },
    { left: '40%', top: '10%' },
    { left: '92%', top: '35%' },
    { left: '12%', top: '40%' },
    { left: '55%', top: '65%' }
  ]

  return {
    ...positions[n - 1],
    animationDelay: `${n * 0.4}s`,
    animationDuration: `${4 + Math.random() * 3}s`
  }
}

function getBubbleText(n) {
  return props.bubbleTexts[n - 1] || ''
}

function particleStyle() {
  const size = 3 + Math.random() * 5
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${3 + Math.random() * 4}s`
  }
}

const features = [
  {
    text: 'Voice Chat',
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z' }),
      h('path', { d: 'M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z' })
    ])
  },
  {
    text: 'Real-time',
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z' })
    ])
  },
  {
    text: 'AI Powered',
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z' })
    ])
  },
  {
    text: 'Friendly',
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z' })
    ])
  }
]
</script>

<style scoped>
.chatbot-banner {
  position: relative;
  width: 100%;
  min-height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
}

.chat-background {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.message-bubbles {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.bubble {
  position: absolute;
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: bubble-float 7s ease-in-out infinite;
}

@keyframes bubble-float {

  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }

  25% {
    transform: translateY(-15px) scale(1.05);
    opacity: 0.6;
  }

  50% {
    transform: translateY(-25px) scale(1);
    opacity: 0.4;
  }

  75% {
    transform: translateY(-10px) scale(1.05);
    opacity: 0.7;
  }
}

.floating-particles {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particle-rise 6s ease-in-out infinite;
}

@keyframes particle-rise {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }

  10% {
    opacity: 0.8;
  }

  90% {
    opacity: 0.3;
  }

  100% {
    transform: translateY(-100vh) scale(0.3);
    opacity: 0;
  }
}

.banner-content {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: 40px 20px;
  max-width: 900px;
}

.avatar-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
}

.icon-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
}

.avatar-glow {
  position: absolute;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow-pulse 2s ease-in-out infinite;
}

.icon-glow {
  position: absolute;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }

  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.avatar {
  position: relative;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: avatar-bounce 3s ease-in-out infinite;
}

.page-icon {
  position: relative;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: avatar-bounce 3s ease-in-out infinite;
}

@keyframes avatar-bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.avatar svg {
  width: 70px;
  height: 70px;
  color: #667eea;
}

.page-icon svg {
  width: 70px;
  height: 70px;
  color: #667eea;
}

.status-dot {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #4ade80;
  border: 3px solid #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(74, 222, 128, 0.5);
  animation: status-blink 2s ease-in-out infinite;
}

@keyframes status-blink {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.title {
  font-family: 'Montserrat', 'Arial', sans-serif;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 400;
  margin-bottom: 28px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  line-height: 1.6;
}

.typing-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  margin-bottom: 28px;
  backdrop-filter: blur(10px);
}

.typing-indicator span {
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 50%;
  animation: typing-dot 1.4s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-dot {

  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.7;
  }

  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

.tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: tag-slide-in 0.6s ease-out;
}

.tag:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

@keyframes tag-slide-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tag svg {
  width: 20px;
  height: 20px;
  color: #fff;
}

.tag span {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.3px;
}

@media (max-width: 768px) {
  .chatbot-banner {
    min-height: 380px;
  }

  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .avatar {
    width: 90px;
    height: 90px;
  }

  .avatar svg {
    width: 55px;
    height: 55px;
  }

  .avatar-glow {
    width: 110px;
    height: 110px;
  }

  .feature-tags {
    gap: 10px;
  }

  .tag {
    padding: 10px 16px;
  }

  .tag svg {
    width: 18px;
    height: 18px;
  }

  .tag span {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .avatar {
    width: 75px;
    height: 75px;
  }

  .avatar svg {
    width: 45px;
    height: 45px;
  }

  .avatar-glow {
    width: 95px;
    height: 95px;
  }

  .tag {
    padding: 8px 14px;
  }

  .tag svg {
    width: 16px;
    height: 16px;
  }

  .tag span {
    font-size: 0.8rem;
  }
}
</style>
