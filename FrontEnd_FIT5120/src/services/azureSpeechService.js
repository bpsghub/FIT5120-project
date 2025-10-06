/**
 * Azure Speech Service for Pronunciation Assessment
 * Documentation: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/
 */

const AZURE_CONFIG = {
  // TODO: Replace with your Azure Speech Service credentials
  subscriptionKey: import.meta.env.VITE_AZURE_SPEECH_KEY || 'YOUR_AZURE_SPEECH_KEY',
  region: import.meta.env.VITE_AZURE_SPEECH_REGION || 'eastus',
  endpoint: null // Will be constructed from region
}

// Construct endpoint from region
AZURE_CONFIG.endpoint = `https://${AZURE_CONFIG.region}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`

/**
 * Get Azure Speech Service access token
 */
export async function getAzureAccessToken() {
  try {
    const response = await fetch(AZURE_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_CONFIG.subscriptionKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`)
    }

    const token = await response.text()
    return token
  } catch (error) {
    console.error('Azure token error:', error)
    throw error
  }
}

/**
 * Assess pronunciation using Azure Speech Service
 * @param {Blob} audioBlob - The recorded audio blob
 * @param {string} referenceText - The text that should be pronounced
 * @param {string} language - Language code (e.g., 'en-US')
 * @returns {Promise<Object>} Pronunciation assessment results
 */
export async function assessPronunciation(audioBlob, referenceText, language = 'en-US') {
  try {
    // Get access token
    const token = await getAzureAccessToken()

    // Convert blob to ArrayBuffer
    const arrayBuffer = await audioBlob.arrayBuffer()

    // Prepare pronunciation assessment parameters
    const pronunciationAssessmentParams = {
      ReferenceText: referenceText,
      GradingSystem: 'HundredMark',
      Granularity: 'Phoneme',
      Dimension: 'Comprehensive',
      EnableMiscue: true
    }

    const url = `https://${AZURE_CONFIG.region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${language}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'audio/wav',
        'Ocp-Apim-Subscription-Key': AZURE_CONFIG.subscriptionKey,
        'Pronunciation-Assessment': JSON.stringify(pronunciationAssessmentParams)
      },
      body: arrayBuffer
    })

    if (!response.ok) {
      throw new Error(`Azure Speech API error: ${response.statusText}`)
    }

    const result = await response.json()
    return parseAzureResult(result, referenceText)
  } catch (error) {
    console.error('Pronunciation assessment error:', error)
    throw error
  }
}

/**
 * Parse Azure Speech Service result into a friendly format
 */
function parseAzureResult(azureResult, referenceText) {
  const { NBest, RecognitionStatus } = azureResult

  if (RecognitionStatus !== 'Success' || !NBest || NBest.length === 0) {
    return {
      success: false,
      error: 'Speech recognition failed',
      score: 0,
      feedback: 'Could not recognize speech. Please try again.',
      level: 'error'
    }
  }

  const best = NBest[0]
  const { PronunciationAssessment, Display, Confidence } = best

  if (!PronunciationAssessment) {
    return {
      success: false,
      error: 'Pronunciation assessment not available',
      score: 0,
      feedback: 'Assessment failed. Please try again.',
      level: 'error'
    }
  }

  const {
    AccuracyScore,
    FluencyScore,
    CompletenessScore,
    PronScore
  } = PronunciationAssessment

  // Overall score (0-100)
  const overallScore = Math.round(PronScore || AccuracyScore)

  // Generate feedback based on score
  let feedback = ''
  let level = ''

  if (overallScore >= 90) {
    feedback = '🎉 Excellent! Your pronunciation is outstanding!'
    level = 'excellent'
  } else if (overallScore >= 80) {
    feedback = '👏 Great job! Your pronunciation is very good.'
    level = 'great'
  } else if (overallScore >= 70) {
    feedback = '👍 Good! Keep practicing to improve further.'
    level = 'good'
  } else if (overallScore >= 60) {
    feedback = '😊 Fair. Try to listen and repeat more carefully.'
    level = 'fair'
  } else {
    feedback = '💪 Keep trying! Practice makes perfect.'
    level = 'needs-improvement'
  }

  return {
    success: true,
    score: overallScore,
    accuracyScore: Math.round(AccuracyScore),
    fluencyScore: Math.round(FluencyScore || 0),
    completenessScore: Math.round(CompletenessScore || 0),
    confidence: Math.round(Confidence * 100),
    transcribed: Display,
    reference: referenceText,
    feedback,
    level,
    details: best.Words || []
  }
}

/**
 * Check if Azure Speech Service is configured
 */
export function isAzureConfigured() {
  return AZURE_CONFIG.subscriptionKey && 
         AZURE_CONFIG.subscriptionKey !== 'YOUR_AZURE_SPEECH_KEY' &&
         AZURE_CONFIG.region
}

export default {
  getAzureAccessToken,
  assessPronunciation,
  isAzureConfigured
}
