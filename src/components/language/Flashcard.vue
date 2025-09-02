<template>
  <div class="flashcard-container">
    <div class="flashcard" :class="{ 'is-flipped': isFlipped }" @click="flip">
      <!-- Front side (Native language) -->
      <div class="flashcard-side flashcard-front">
        <div class="card-content">
          <div class="language-label">{{ getLanguageName(nativeLanguage) }}</div>
          <div class="text-content">{{ phrase.native }}</div>
          <div class="flip-hint">Click to see English translation</div>
          <button class="audio-btn" @click.stop="playAudio(phrase.native, nativeLanguage)" :disabled="isPlayingAudio">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="height: 16px; width: 16px">
              <path
                d="M3 10v4a1 1 0 0 0 1 1h2.22l3.13 3.13a1 1 0 0 0 1.65-.76V6.63a1 1 0 0 0-1.65-.76L6.22 9H4a1 1 0 0 0-1 1zM14 8.24a1 1 0 0 1 1.41 0 5 5 0 0 1 0 7.07 1 1 0 1 1-1.41-1.41 3 3 0 0 0 0-4.24 1 1 0 0 1 0-1.42z" />
              <path
                d="M17.7 5.14a1 1 0 1 1 1.41 1.41 9 9 0 0 1 0 12.73 1 1 0 0 1-1.41-1.41 7 7 0 0 0 0-9.9 1 1 0 0 1 0-1.42z" />
            </svg>
            {{ isPlayingAudio ? 'Playing...' : 'Listen' }}
          </button>
        </div>
      </div>

      <!-- Back side (English) -->
      <div class="flashcard-side flashcard-back">
        <div class="card-content">
          <div class="language-label">English</div>
          <div class="text-content">{{ phrase.english }}</div>
          <div class="flip-hint">Click to see {{ getLanguageName(nativeLanguage) }}</div>
          <button class="audio-btn" @click.stop="playAudio(phrase.english, 'en')" :disabled="isPlayingAudio">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="height: 16px; width: 16px">
              <path
                d="M3 10v4a1 1 0 0 0 1 1h2.22l3.13 3.13a1 1 0 0 0 1.65-.76V6.63a1 1 0 0 0-1.65-.76L6.22 9H4a1 1 0 0 0-1 1zM14 8.24a1 1 0 0 1 1.41 0 5 5 0 0 1 0 7.07 1 1 0 1 1-1.41-1.41 3 3 0 0 0 0-4.24 1 1 0 0 1 0-1.42z" />
              <path
                d="M17.7 5.14a1 1 0 1 1 1.41 1.41 9 9 0 0 1 0 12.73 1 1 0 0 1-1.41-1.41 7 7 0 0 0 0-9.9 1 1 0 0 1 0-1.42z" />
            </svg>
            {{ isPlayingAudio ? 'Playing...' : 'Listen' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  phrase: {
    type: Object,
    required: true,
  },
  nativeLanguage: {
    type: String,
    required: true,
  },
  autoFlip: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['flip', 'audio-start', 'audio-end'])

// Reactive state
const isFlipped = ref(false)
const isPlayingAudio = ref(false)

// Computed properties
const getLanguageName = computed(() => {
  const languageMap = {
    zh: '中文',
    vi: 'Tiếng Việt',
    id: 'Bahasa Indonesia',
  }
  return (langCode) => languageMap[langCode] || langCode
})

// Methods
const flip = () => {
  isFlipped.value = !isFlipped.value
  emit('flip', isFlipped.value)
}

const playAudio = async (text, langCode) => {
  if (isPlayingAudio.value) return

  try {
    isPlayingAudio.value = true
    emit('audio-start')

    // Use Web Speech API for text-to-speech
    const utterance = new SpeechSynthesisUtterance(text)

    // Set language for speech synthesis
    const langMap = {
      en: 'en-US',
      zh: 'zh-CN',
      vi: 'vi-VN',
      id: 'id-ID',
    }
    utterance.lang = langMap[langCode] || 'en-US'

    utterance.rate = 0.8 // Slightly slower for learning
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onend = () => {
      isPlayingAudio.value = false
      emit('audio-end')
    }

    utterance.onerror = () => {
      isPlayingAudio.value = false
      emit('audio-end')
    }

    speechSynthesis.speak(utterance)
  } catch (error) {
    console.error('Audio playback error:', error)
    isPlayingAudio.value = false
    emit('audio-end')
  }
}

// Auto-flip functionality
if (props.autoFlip) {
  setTimeout(() => flip(), 2000)
}

// Expose methods for parent component
defineExpose({
  flip,
  playAudio,
  isFlipped,
})
</script>

<style scoped>
/* Quizlet-style Flashcard Design */
.flashcard-container {
  perspective: 1000px;
  width: 100%;
  max-width: 560px;
  height: 340px;
  margin: 0 auto;
}

.flashcard {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.45s ease;
  transform-style: preserve-3d;
  cursor: pointer;
  border-radius: 12px;
}

.flashcard.is-flipped {
  transform: rotateY(180deg);
}

.flashcard-side {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #2e3856;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  transition: all 0.2s ease;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

.flashcard-front {
  /* Clean white background with subtle border */
  background: #ffffff;
}

.flashcard-back {
  /* Slightly different background for distinction */
  background: #fafbfc;
  transform: rotateY(180deg);
}

.flashcard:hover .flashcard-side {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
}

.card-content {
  text-align: center;
  padding: 2.5rem 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.language-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.text-content {
  font-size: clamp(1.25rem, 3vw, 1.875rem);
  font-weight: 600;
  line-height: 1.4;
  color: #1e293b;
  margin: 0;
  text-align: center;
  max-width: 100%;
  word-wrap: break-word;
}

.flip-hint {
  font-size: 0.8125rem;
  color: #94a3b8;
  font-weight: 400;
  margin: 0;
  opacity: 0.8;
}

.audio-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 100px;
  justify-content: center;
}

.audio-btn:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.audio-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.audio-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .flashcard-container {
    max-width: 90vw;
    height: 300px;
  }

  .card-content {
    padding: 2rem 1.5rem;
    gap: 1.25rem;
  }

  .text-content {
    font-size: clamp(1.125rem, 4vw, 1.5rem);
  }
}

@media (max-width: 576px) {
  .flashcard-container {
    height: 280px;
  }

  .card-content {
    padding: 1.5rem 1rem;
    gap: 1rem;
  }

  .language-label {
    font-size: 0.8125rem;
  }

  .flip-hint {
    font-size: 0.75rem;
  }

  .audio-btn {
    padding: 8px 16px;
    font-size: 0.8125rem;
    min-width: 90px;
  }
}

/* Focus states for accessibility */
.flashcard:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.audio-btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Loading state */
.flashcard.loading .flashcard-side {
  opacity: 0.7;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .flashcard-side {
    border: 2px solid #000;
  }

  .language-label {
    color: #000;
  }

  .text-content {
    color: #000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .flashcard {
    transition: none;
  }

  .flashcard-side {
    transition: none;
  }

  .audio-btn {
    transition: none;
  }
}
</style>
