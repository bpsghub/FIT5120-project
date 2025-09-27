<template>

  <div class="quiztaking">
    <Header />
    <div class="quiztaking-w container mt-5 mb-5" v-if="!allCorrect">
      <h2 class="quiz-header">Dining Etiquette Quiz</h2>
      <div v-for="(q, idx) in questions" :key="q.key" class="quiz-question-block">
        <div :class="['question-title',
          userAnswers[q.key] === undefined ? '' : (isCorrect(q) ? 'correct' : 'incorrect')
        ]">
          {{ idx + 1 }}. {{ q.prompt[lang] || q.prompt.en }}
        </div>
        <div class="options-list">
          <button v-for="opt in q.options" :key="opt.id" :disabled="isCorrect(q)" :class="['option-btn',
            userAnswers[q.key] === opt.id ? (opt.id === q.answer ? 'correct' : 'incorrect') : '',
            isCorrect(q) && opt.id === q.answer ? 'correct' : ''
          ]" @click="selectAnswer(q, opt.id)">
            {{ opt.label[lang] || opt.label.en }}
          </button>
        </div>
        <div v-if="userAnswers[q.key] && !isCorrect(q)" class="explanation">
          <span class="wrong-msg">Wrong, try again!</span>
        </div>
        <div v-if="isCorrect(q)" class="explanation">
          <span class="correct-msg">Correct! {{ q.explanation[lang] || q.explanation.en }}</span>
        </div>
      </div>
    </div>
    <div v-else class="congrats-block">
      <h2>Congratulations!</h2>
      <p>You have completed all questions correctly!</p>
      <button class="home-btn" @click="goHome">Go to Home</button>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const lang = 'en' // Set language code here, or get from i18n if needed
const questions = ref([])
const userAnswers = ref({})

// Load quiz data
onMounted(async () => {
  const res = await fetch('/Learning about Australia/quiz_dining_multilang.json')
  const data = await res.json()
  questions.value = data.items
})

function selectAnswer(q, optId) {
  if (userAnswers.value[q.key] === q.answer) return // Already correct, do not allow reselect
  userAnswers.value[q.key] = optId
}

function isCorrect(q) {
  return userAnswers.value[q.key] === q.answer
}

const allCorrect = computed(() => {
  return questions.value.length > 0 && questions.value.every(q => isCorrect(q))
})

const router = useRouter()
function goHome() {
  router.push('/')
}
</script>

<style scoped>
.quiz-header {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 32px;
  color: #661aff;
  text-align: center;
}

.quiz-question-block {
  margin-bottom: 32px;
  padding: 24px 18px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(102, 26, 255, 0.07);
}

.question-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
  transition: color 0.2s;
}

.question-title.incorrect {
  color: #e53935;
}

.question-title.correct {
  color: #43a047;
}

.options-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.option-btn {
  background: #f1f1fa;
  border: 1.5px solid #d1c4e9;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, border 0.2s, color 0.2s;
}

.option-btn.correct {
  background: #e8f5e9;
  border-color: #43a047;
  color: #388e3c;
}

.option-btn.incorrect {
  background: #ffebee;
  border-color: #e53935;
  color: #b71c1c;
}

.option-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.explanation {
  margin-top: 6px;
  font-size: 0.98rem;
}

.wrong-msg {
  color: #e53935;
  font-weight: 500;
}

.correct-msg {
  color: #43a047;
  font-weight: 500;
}

.congrats-block {
  text-align: center;
  margin-top: 80px;
}

.home-btn {
  margin-top: 32px;
  background: #661aff;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  padding: 16px 40px;
  box-shadow: 0 2px 8px rgba(102, 26, 255, 0.1);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.home-btn:hover {
  background: #a259e6;
  transform: scale(1.04);
}
</style>
