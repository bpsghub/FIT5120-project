import axios from 'axios'

const API_KEY = 'AIzaSyCi8f57LNBdx-xxIyOf67_5j-yFzHlRNcs' // Replace with your actual key
const ENDPOINT = 'https://translation.googleapis.com/language/translate/v2'

export async function translateText(text, targetLang, sourceLang = 'en') {
  const response = await axios.post(`${ENDPOINT}?key=${API_KEY}`, {
    q: text,
    source: sourceLang,
    target: targetLang,
    format: 'text',
  })
  return response.data.data.translations[0].translatedText
}

export async function translateBatch(texts, targetLang, sourceLang = 'en') {
  const response = await axios.post(`${ENDPOINT}?key=${API_KEY}`, {
    q: texts,
    source: sourceLang,
    target: targetLang,
    format: 'text',
  })
  return response.data.data.translations.map((t) => t.translatedText)
}
