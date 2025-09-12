// Translation data management service
import { CSVLoader } from '@/utils/csvLoader.js'

// Translation data will be loaded from CSV
let translationData = []

// Language configuration
export const supportedLanguages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
]

// Category definitions for learning modules
export const learningCategories = [
  {
    id: 'greetings',
    name: 'Basic Greetings & Communication',
    description: 'Learn how to greet people and have basic conversations',
    icon: '👋',
    color: '#4F46E5',
    phrases: [
      'hello',
      'good morning',
      'good afternoon',
      'good evening',
      'how are you',
      'i’m fine, thank you',
      'what’s your name',
      'my name is',
      'nice to meet you',
      'where are you from',
      'i’m from china',
      'please',
      'thank you',
      'you’re welcome',
      'excuse me',
      'sorry',
      'yes',
      'no',
      'do you speak english',
      'a little',
      'can you help me',
      'where is the toilet',
      'i don’t understand',
      'please speak slowly',
      'goodbye',
    ],
  },
  {
    id: 'emergency',
    name: 'Emergency & Medical',
    description: 'Essential phrases for medical emergencies and urgent situations',
    icon: '🚨',
    color: '#DC2626',
    phrases: [
      'i need a doctor',
      'i feel sick',
      'i have a headache',
      'i have a fever',
      'i have chest pain',
      'i feel dizzy',
      'i have diabetes',
      'i need medicine',
      'call an ambulance',
      'where is the hospital',
      'head',
      'eye',
      'ear',
      'nose',
      'mouth',
      'stomach',
      'back',
      'arm',
      'leg',
      'foot',
      'help',
      'call the police',
      'i lost my wallet',
      'i lost my phone',
      'my bag was stolen',
      'where is the police station',
      'i don’t feel safe',
      'please write it down',
      'i need a translator',
      'can you call my family',
    ],
  },
  {
    id: 'shopping',
    name: 'Shopping & Daily Needs',
    description: 'Learn vocabulary for grocery shopping and everyday purchases',
    icon: '🛒',
    color: '#059669',
    phrases: [
      'how much is this',
      'it’s too expensive',
      'can you give me a discount',
      'i want this one',
      'do you have another size',
      'small',
      'medium',
      'large',
      'cash',
      'credit card',
      'receipt',
      'bag',
      'where is the supermarket',
      'bread',
      'rice',
      'milk',
      'water',
      'vegetables',
      'fruit',
      'meat',
      'fish',
      'egg',
      'salt',
      'sugar',
      'toilet paper',
    ],
  },
  {
    id: 'activities',
    name: 'Activities & Hobbies',
    description: 'Vocabulary for talking about activities and interests',
    icon: '🎯',
    color: '#7C3AED',
    phrases: [
      'yoga',
      'tai chi',
      'table tennis',
      'badminton',
      'walking',
      'dancing',
      'singing',
      'playing chess',
      'reading',
      'watching tv',
      'gardening',
      'cooking',
      'shopping',
      'exercise',
      'swimming',
      'playing cards',
      'listening to music',
      'painting',
      'drinking tea',
      'visiting friends',
    ],
  },
]

// Service functions
export class TranslationService {
  // Initialize and load data from CSV
  static async initialize() {
    if (translationData.length === 0) {
      translationData = await CSVLoader.loadTranslations()
    }
    return translationData
  }

  // Get translation by key and language
  static getTranslation(key, langCode) {
    const result = translationData.find((item) => item.key === key && item.langCode === langCode)
    return result?.text || key
  }

  // Get all translations for a specific key
  static getTranslationsForKey(key) {
    return translationData.filter((item) => item.key === key)
  }

  // Get all phrases for a category
  static getCategoryPhrases(categoryId, nativeLanguage = 'vi') {
    const category = learningCategories.find((cat) => cat.id === categoryId)
    if (!category) return []

    return category.phrases.map((phraseKey) => {
      const englishText = this.getTranslation(phraseKey, 'en')
      const nativeText = this.getTranslation(phraseKey, nativeLanguage)

      return {
        key: phraseKey,
        english: englishText,
        native: nativeText,
        translations: this.getTranslationsForKey(phraseKey),
      }
    })
  }

  // Get available languages
  static getSupportedLanguages() {
    return supportedLanguages
  }

  // Get all categories
  static getCategories() {
    return learningCategories
  }

  // Check if data is loaded
  static isDataLoaded() {
    return translationData.length > 0
  }
}
