import { ref } from 'vue'

/**
 * Composable for speech recognition and pronunciation assessment
 * Supports both Web Speech API (fallback) and Azure Speech Service
 */
export function useSpeechRecognition() {
  const isRecording = ref(false)
  const transcript = ref('')
  const error = ref(null)
  const recognitionResult = ref(null)
  const pronunciationScore = ref(null)
  
  let recognition = null
  let mediaRecorder = null
  let audioChunks = []

  /**
   * Initialize Web Speech API (fallback method)
   */
  const initWebSpeechAPI = (language = 'en-US') => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      throw new Error('Speech Recognition is not supported in this browser')
    }

    recognition = new SpeechRecognition()
    recognition.lang = language
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    return recognition
  }

  /**
   * Start recording with Web Speech API
   */
  const startRecordingWebAPI = async (language = 'en-US') => {
    try {
      error.value = null
      transcript.value = ''
      isRecording.value = true

      const rec = initWebSpeechAPI(language)

      rec.onresult = (event) => {
        const result = event.results[0][0]
        transcript.value = result.transcript
        recognitionResult.value = {
          text: result.transcript,
          confidence: result.confidence
        }
      }

      rec.onerror = (event) => {
        error.value = `Speech recognition error: ${event.error}`
        isRecording.value = false
      }

      rec.onend = () => {
        isRecording.value = false
      }

      rec.start()
    } catch (err) {
      error.value = err.message
      isRecording.value = false
    }
  }

  /**
   * Stop recording
   */
  const stopRecording = () => {
    if (recognition) {
      recognition.stop()
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
    isRecording.value = false
  }

  /**
   * Record audio for Azure Speech Service
   */
  const startRecordingForAzure = async () => {
    try {
      error.value = null
      audioChunks = []
      isRecording.value = true

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder = new MediaRecorder(stream)

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        stream.getTracks().forEach(track => track.stop())
        return audioBlob
      }

      mediaRecorder.start()
      return mediaRecorder
    } catch (err) {
      error.value = `Microphone access error: ${err.message}`
      isRecording.value = false
      throw err
    }
  }

  /**
   * Get recorded audio blob
   */
  const getAudioBlob = () => {
    return new Promise((resolve) => {
      if (mediaRecorder) {
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
          resolve(audioBlob)
        }
      }
    })
  }

  /**
   * Compare transcribed text with reference text
   * Returns similarity score (0-100)
   */
  const calculateSimilarity = (reference, transcribed) => {
    const ref = reference.toLowerCase().trim()
    const trans = transcribed.toLowerCase().trim()

    if (ref === trans) return 100

    // Levenshtein distance algorithm
    const matrix = []
    for (let i = 0; i <= trans.length; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= ref.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= trans.length; i++) {
      for (let j = 1; j <= ref.length; j++) {
        if (trans.charAt(i - 1) === ref.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    const distance = matrix[trans.length][ref.length]
    const maxLength = Math.max(ref.length, trans.length)
    const similarity = ((maxLength - distance) / maxLength) * 100

    return Math.round(similarity)
  }

  /**
   * Evaluate pronunciation based on reference text
   */
  const evaluatePronunciation = (referenceText, transcribedText, confidence = 1) => {
    const similarity = calculateSimilarity(referenceText, transcribedText)
    const finalScore = Math.round(similarity * confidence)

    let feedback = ''
    let level = ''

    if (finalScore >= 90) {
      feedback = 'Excellent! Your pronunciation is very accurate.'
      level = 'excellent'
    } else if (finalScore >= 75) {
      feedback = 'Good job! Your pronunciation is clear.'
      level = 'good'
    } else if (finalScore >= 60) {
      feedback = 'Not bad, but try to practice more.'
      level = 'fair'
    } else {
      feedback = 'Keep practicing. Listen carefully and try again.'
      level = 'needs-improvement'
    }

    pronunciationScore.value = {
      score: finalScore,
      similarity,
      confidence: Math.round(confidence * 100),
      feedback,
      level,
      reference: referenceText,
      transcribed: transcribedText
    }

    return pronunciationScore.value
  }

  /**
   * Reset all states
   */
  const reset = () => {
    isRecording.value = false
    transcript.value = ''
    error.value = null
    recognitionResult.value = null
    pronunciationScore.value = null
    audioChunks = []
  }

  return {
    // State
    isRecording,
    transcript,
    error,
    recognitionResult,
    pronunciationScore,

    // Methods
    startRecordingWebAPI,
    startRecordingForAzure,
    stopRecording,
    getAudioBlob,
    evaluatePronunciation,
    calculateSimilarity,
    reset
  }
}
