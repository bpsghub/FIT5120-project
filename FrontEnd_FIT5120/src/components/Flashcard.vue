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

          <!-- Audio Controls -->
          <div class="audio-controls">
            <button class="audio-btn" @click.stop="playAudio(phrase.english, 'en')" :disabled="isPlayingAudio">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="height: 16px; width: 16px">
                <path
                  d="M3 10v4a1 1 0 0 0 1 1h2.22l3.13 3.13a1 1 0 0 0 1.65-.76V6.63a1 1 0 0 0-1.65-.76L6.22 9H4a1 1 0 0 0-1 1zM14 8.24a1 1 0 0 1 1.41 0 5 5 0 0 1 0 7.07 1 1 0 1 1-1.41-1.41 3 3 0 0 0 0-4.24 1 1 0 0 1 0-1.42z" />
                <path
                  d="M17.7 5.14a1 1 0 1 1 1.41 1.41 9 9 0 0 1 0 12.73 1 1 0 0 1-1.41-1.41 7 7 0 0 0 0-9.9 1 1 0 0 1 0-1.42z" />
              </svg>
              {{ isPlayingAudio ? 'Playing...' : 'Listen' }}
            </button>

            <button class="talk-btn" @click.stop="handleTalk" :disabled="isRecording || isAssessing"
              :title="getTalkButtonTitle()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                style="height: 16px; width: 16px">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path
                  d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
              {{ getTalkButtonText() }}
            </button>
          </div>

          <!-- Recording Instructions -->
          <div v-if="isRecording" class="recording-instructions">
            🎤 Speak clearly: "{{ phrase.english }}"
          </div>

          <!-- Pronunciation Result (Simple Feedback Only) -->
          <div v-if="pronunciationResult" class="pronunciation-result">
            <div class="result-feedback">{{ pronunciationResult.feedback }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSpeechRecognition } from '@/composables/useSpeechRecognition.js'

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
const isRecording = ref(false)
const isAssessing = ref(false)
const pronunciationResult = ref(null)

// Speech recognition composable
const {
  startRecordingWebAPI,
  stopRecording,
  evaluatePronunciation,
  recognitionResult
} = useSpeechRecognition()

// Computed properties
const getLanguageName = computed(() => {
  const languageMap = {
    zh: '中文',
    vi: 'Tiếng Việt',
    id: 'Bahasa Indonesia',
  }
  return (langCode) => languageMap[langCode] || langCode
})

// Get talk button text
const getTalkButtonText = () => {
  if (isRecording.value) return 'Recording... (5s)'
  if (isAssessing.value) return 'Assessing...'
  return 'Talk'
}

// Get talk button title/tooltip
const getTalkButtonTitle = () => {
  return 'Click and speak clearly: "' + props.phrase.english + '"'
}

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

// Handle "Talk" button click
const handleTalk = async () => {
  if (isRecording.value || isAssessing.value) return

  // Reset previous result
  pronunciationResult.value = null

  try {
    console.log('🎤 Using Web Speech API for pronunciation assessment')
    await handleWebSpeechPronunciation()
  } catch (error) {
    console.error('Talk handler error:', error)
    pronunciationResult.value = {
      success: false,
      score: 0,
      feedback: `Error: ${error.message || 'Please try again.'}`,
      level: 'error'
    }
    isRecording.value = false
    isAssessing.value = false
  }
}

// Web Speech API pronunciation assessment (enhanced)
const handleWebSpeechPronunciation = async () => {
  isRecording.value = true

  try {
    console.log('Starting Web Speech API pronunciation assessment...')
    console.log('Target phrase:', props.phrase.english)

    // Reset previous results
    recognitionResult.value = null

    // Start Web Speech Recognition with better settings
    await startRecordingWebAPI('en-US')

    // Wait for recognition result or timeout (longer timeout for better accuracy)
    await new Promise((resolve) => {
      let attempts = 0
      const maxAttempts = 100 // 10 seconds with 100ms intervals

      const checkInterval = setInterval(() => {
        attempts++

        if (recognitionResult.value || attempts >= maxAttempts) {
          clearInterval(checkInterval)
          stopRecording()
          resolve()
        }
      }, 100)
    })

    isRecording.value = false
    isAssessing.value = true

    // Evaluate pronunciation
    if (recognitionResult.value && recognitionResult.value.text) {
      console.log('Recognition successful:', {
        transcribed: recognitionResult.value.text,
        confidence: recognitionResult.value.confidence,
        target: props.phrase.english
      })

      const result = evaluatePronunciation(
        props.phrase.english,
        recognitionResult.value.text,
        recognitionResult.value.confidence || 1
      )

      pronunciationResult.value = {
        feedback: result.feedback,
        method: 'web-speech-api'
      }

      // Auto-clear result after 5 seconds
      setTimeout(() => {
        pronunciationResult.value = null
      }, 5000)
    } else {
      // No speech detected
      console.warn('No speech detected by Web Speech API')
      pronunciationResult.value = {
        feedback: 'No speech detected. Please speak clearly and try again.',
        method: 'web-speech-api'
      }

      // Auto-clear result after 5 seconds
      setTimeout(() => {
        pronunciationResult.value = null
      }, 5000)
    }

    isAssessing.value = false
  } catch (error) {
    console.error('Web Speech API error:', error)
    isRecording.value = false
    isAssessing.value = false

    pronunciationResult.value = {
      feedback: `Speech recognition error: ${error.message}. Please try again.`,
      method: 'web-speech-api'
    }

    // Auto-clear result after 5 seconds
    setTimeout(() => {
      pronunciationResult.value = null
    }, 5000)
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

/* Audio Controls Container */
.audio-controls {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  width: 100%;
}

/* Talk Button */
.talk-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #ffffff;
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
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.talk-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.talk-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.talk-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
}

/* Pronunciation Result */
.pronunciation-result {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  animation: slideIn 0.3s ease-out;
  width: 100%;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-score {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.score-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

.score-label {
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
}

.result-feedback {
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #22c55e;
  background: #e6fbe6;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.08);
}

.result-transcribed {
  font-size: 0.8125rem;
  color: #64748b;
  text-align: center;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
}

/* Result Level Colors */
.result-excellent {
  border-color: #22c55e;
  background: #f0fdf4;
}

.result-excellent .score-value {
  color: #16a34a;
}

.result-excellent .result-feedback {
  color: #15803d;
}

.result-great {
  border-color: #3b82f6;
  background: #eff6ff;
}

.result-great .score-value {
  color: #2563eb;
}

.result-great .result-feedback {
  color: #1d4ed8;
}

.result-good {
  border-color: #eab308;
  background: #fefce8;
}

.result-good .score-value {
  color: #ca8a04;
}

.result-good .result-feedback {
  color: #a16207;
}

.result-fair {
  border-color: #f59e0b;
  background: #fff7ed;
}

.result-fair .score-value {
  color: #d97706;
}

.result-fair .result-feedback {
  color: #b45309;
}

.result-needs-improvement {
  border-color: #ef4444;
  background: #fef2f2;
}

.result-needs-improvement .score-value {
  color: #dc2626;
}

.result-needs-improvement .result-feedback {
  color: #b91c1c;
}

.result-error {
  border-color: #dc2626;
  background: #fef2f2;
}

.result-error .score-value {
  color: #991b1b;
}

.result-error .result-feedback {
  color: #7f1d1d;
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

/* Recording instructions */
.recording-instructions {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
  animation: pulse 2s infinite;
  margin-top: 8px;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.8;
  }
}

/* Talk button enhancements */
.talk-btn:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.talk-btn:disabled {
  background: #94a3b8 !important;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.talk-btn:disabled:hover {
  background: #94a3b8 !important;
  transform: none;
  box-shadow: none;
}

/* Pronunciation result enhancements */
.result-confidence {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 4px;
}

.result-method {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 4px;
  font-style: italic;
}

.result-transcribed {
  background: #f3f4f6;
  padding: 8px;
  border-radius: 6px;
  margin-top: 8px;
  font-size: 0.875rem;
}

/* Recording animation */
.recording-instructions {
  animation: recordingPulse 1.5s ease-in-out infinite;
}

@keyframes recordingPulse {

  0%,
  100% {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    transform: scale(1);
  }

  50% {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    transform: scale(1.02);
  }
}
</style>
