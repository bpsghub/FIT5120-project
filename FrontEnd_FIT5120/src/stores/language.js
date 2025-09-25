import { ref } from 'vue'

const defaultLang = localStorage.getItem('locale') || 'en'
export const lang = ref(defaultLang)

export function setLang(newLang) {
  lang.value = newLang
  localStorage.setItem('locale', newLang)
}
