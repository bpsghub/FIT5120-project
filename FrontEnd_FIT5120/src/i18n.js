import { createI18n } from 'vue-i18n'
import { messages } from './locales.js'

const getSavedLang = () => {
  return localStorage.getItem('lang') || 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getSavedLang(),
  fallbackLocale: 'en',
  messages,
  globalInjection: true,
})

export default i18n
