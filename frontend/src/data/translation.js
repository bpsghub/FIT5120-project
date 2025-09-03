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
      'good_morning',
      'good_afternoon',
      'good_evening',
      'how_are_you',
      'im_fine_thank_you',
      'whats_your_name',
      'my_name_is',
      'nice_to_meet_you',
      'where_are_you_from',
      'im_from_china',
      'please',
      'thank_you',
      'youre_welcome',
      'excuse_me',
      'sorry',
      'yes',
      'no',
      'do_you_speak_english',
      'a_little',
      'can_you_help_me',
      'where_is_the_toilet',
      'i_dont_understand',
      'please_speak_slowly',
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
      'i_need_a_doctor',
      'i_feel_sick',
      'i_have_a_headache',
      'i_have_a_fever',
      'i_have_chest_pain',
      'i_feel_dizzy',
      'i_have_diabetes',
      'i_need_medicine',
      'call_an_ambulance',
      'where_is_the_hospital',
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
      'call_the_police',
      'i_lost_my_wallet',
      'i_lost_my_phone',
      'my_bag_was_stolen',
      'where_is_the_police_station',
      'i_dont_feel_safe',
      'please_write_it_down',
      'i_need_a_translator',
      'can_you_call_my_family',
    ],
  },
  {
    id: 'shopping',
    name: 'Shopping & Daily Needs',
    description: 'Learn vocabulary for grocery shopping and everyday purchases',
    icon: '🛒',
    color: '#059669',
    phrases: [
      'how_much_is_this',
      'its_too_expensive',
      'can_you_give_me_a_discount',
      'i_want_this_one',
      'do_you_have_another_size',
      'small',
      'medium',
      'large',
      'cash',
      'credit_card',
      'receipt',
      'bag',
      'where_is_the_supermarket',
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
      'toilet_paper',
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
      'tai_chi',
      'table_tennis',
      'badminton',
      'walking',
      'dancing',
      'singing',
      'playing_chess',
      'reading',
      'watching_tv',
      'gardening',
      'cooking',
      'shopping',
      'exercise',
      'swimming',
      'playing_cards',
      'listening_to_music',
      'painting',
      'drinking_tea',
      'visiting_friends',
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
    return (
      translationData.find((item) => item.key === key && item.lang_code === langCode)?.text || key
    )
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
