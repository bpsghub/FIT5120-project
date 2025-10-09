/**
 * Simple test function for Web Speech API
 * Add this to browser console to test speech recognition
 */

export function testWebSpeechAPI() {
  console.group('🎤 Testing Web Speech API')

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognition) {
    console.error('❌ Speech Recognition not supported in this browser')
    console.log('Please use Chrome, Edge, or Safari')
    console.groupEnd()
    return
  }

  console.log('✅ Speech Recognition is supported')

  const recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.continuous = false
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  console.log('🎯 Settings:', {
    language: recognition.lang,
    continuous: recognition.continuous,
    interimResults: recognition.interimResults,
    maxAlternatives: recognition.maxAlternatives,
  })

  recognition.onstart = () => {
    console.log('🎤 Started listening... Say "Hello world"')
  }

  recognition.onresult = (event) => {
    const result = event.results[0][0]
    console.log('✅ Recognition result:', {
      transcript: result.transcript,
      confidence: result.confidence,
    })
    console.groupEnd()
  }

  recognition.onerror = (event) => {
    console.error('❌ Recognition error:', event.error)
    console.groupEnd()
  }

  recognition.onend = () => {
    console.log('🔇 Recognition ended')
  }

  try {
    recognition.start()
  } catch (error) {
    console.error('❌ Failed to start recognition:', error)
    console.groupEnd()
  }
}

// Global function for browser console
if (typeof window !== 'undefined') {
  window.testWebSpeech = testWebSpeechAPI
  console.log('🎤 Web Speech test function available: testWebSpeech()')
}
