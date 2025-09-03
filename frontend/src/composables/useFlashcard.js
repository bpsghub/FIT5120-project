import { ref, computed, watch } from 'vue'
import { TranslationService } from '@/data/translation.js'

export function useFlashcard(categoryId, nativeLanguage) {
  // Reactive state
  const phrases = ref([])
  const currentIndex = ref(0)
  const isLoading = ref(true)
  const error = ref(null)
  const isShuffled = ref(false)
  const originalOrder = ref([])

  // Progress tracking
  const viewedPhrases = ref(new Set())
  const correctAnswers = ref(new Set())

  // Computed properties
  const currentPhrase = computed(() => {
    if (!phrases.value.length || currentIndex.value >= phrases.value.length) {
      return null
    }
    return phrases.value[currentIndex.value]
  })

  const progress = computed(() => {
    if (!phrases.value.length) return 0
    return Math.round((viewedPhrases.value.size / phrases.value.length) * 100)
  })

  const hasNext = computed(() => {
    return currentIndex.value < phrases.value.length - 1
  })

  const hasPrevious = computed(() => {
    return currentIndex.value > 0
  })

  const totalPhrases = computed(() => phrases.value.length)

  const currentPosition = computed(() => currentIndex.value + 1)

  // Methods
  const loadPhrases = async () => {
    try {
      isLoading.value = true
      error.value = null

      // Ensure translation data is loaded
      await TranslationService.initialize()

      // Get phrases for the category
      const categoryPhrases = TranslationService.getCategoryPhrases(categoryId, nativeLanguage)

      if (!categoryPhrases.length) {
        throw new Error(`No phrases found for category: ${categoryId}`)
      }

      phrases.value = categoryPhrases
      originalOrder.value = [...categoryPhrases]
      currentIndex.value = 0
      viewedPhrases.value.clear()
      correctAnswers.value.clear()

      // Mark first phrase as viewed
      if (phrases.value.length > 0) {
        markAsViewed(0)
      }
    } catch (err) {
      error.value = err.message
      console.error('Error loading phrases:', err)
    } finally {
      isLoading.value = false
    }
  }

  const nextCard = () => {
    if (hasNext.value) {
      currentIndex.value++
      markAsViewed(currentIndex.value)
    }
  }

  const previousCard = () => {
    if (hasPrevious.value) {
      currentIndex.value--
      markAsViewed(currentIndex.value)
    }
  }

  const goToCard = (index) => {
    if (index >= 0 && index < phrases.value.length) {
      currentIndex.value = index
      markAsViewed(index)
    }
  }

  const shuffle = () => {
    if (!phrases.value.length) return

    const currentPhrase = phrases.value[currentIndex.value]

    // Fisher-Yates shuffle algorithm
    const shuffled = [...phrases.value]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    phrases.value = shuffled
    isShuffled.value = true

    // Find the new index of the current phrase
    const newIndex = phrases.value.findIndex((phrase) => phrase.key === currentPhrase.key)
    currentIndex.value = newIndex >= 0 ? newIndex : 0
  }

  const resetOrder = () => {
    phrases.value = [...originalOrder.value]
    isShuffled.value = false
    currentIndex.value = 0
    markAsViewed(0)
  }

  const markAsViewed = (index) => {
    if (phrases.value[index]) {
      viewedPhrases.value.add(phrases.value[index].key)
    }
  }

  const markAsCorrect = (index) => {
    if (phrases.value[index]) {
      correctAnswers.value.add(phrases.value[index].key)
    }
  }

  const restart = () => {
    currentIndex.value = 0
    viewedPhrases.value.clear()
    correctAnswers.value.clear()
    markAsViewed(0)
  }

  // Watch for changes in category or language
  watch(
    [() => categoryId, () => nativeLanguage],
    () => {
      if (categoryId && nativeLanguage) {
        loadPhrases()
      }
    },
    { immediate: true },
  )

  return {
    // State
    phrases,
    currentIndex,
    isLoading,
    error,
    isShuffled,
    viewedPhrases,
    correctAnswers,

    // Computed
    currentPhrase,
    progress,
    hasNext,
    hasPrevious,
    totalPhrases,
    currentPosition,

    // Methods
    loadPhrases,
    nextCard,
    previousCard,
    goToCard,
    shuffle,
    resetOrder,
    markAsViewed,
    markAsCorrect,
    restart,
  }
}
