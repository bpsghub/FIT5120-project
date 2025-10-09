<template>
  <div class="testview-w">
    <BannerBubble title="Emma - Your English Buddy"
      subtitle="Practice English conversation in a friendly, relaxed way" />

    <div class="container chat-section">
      <div class="chat-container">
        <div class="header">
          <div class="avatar">E</div>
          <div class="bot-info">
            <h2>Emma - Your English Buddy</h2>
            <p class="subtitle">Practice English conversation in a friendly, relaxed way</p>
          </div>
          <div class="status" :class="{ active: !loading }">
            <div class="status-dot"></div>
            <span>{{ loading ? 'Thinking...' : 'Online' }}</span>
          </div>
        </div>

        <div class="messages-area" ref="messagesContainer">
          <div v-if="messages.length === 0" class="welcome-message">
            <div class="welcome-avatar">Hi!</div>
            <div class="welcome-text">
              <p><strong>Hey there! I'm Emma, your friendly English conversation partner!</strong></p>
              <p>I'm here to help you practice English in a natural, fun way. Just chat with me like you would with a
                friend over coffee!</p>
              <p>Ask me anything, tell me about your day, or let's talk about topics you're interested in. Ready to
                start?
              </p>
            </div>
          </div>

          <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
            <div v-if="msg.role === 'user'" class="message-content user-message">
              <div class="message-bubble">
                <p>{{ msg.content }}</p>
              </div>
              <div class="message-avatar">You</div>
            </div>
            <div v-else-if="!loading || msg.content" class="message-content assistant-message">
              <div class="message-avatar">E</div>
              <div class="message-bubble">
                <div class="bot-name">Emma</div>
                <p>{{ msg.content }}</p>
                <!-- Listen Button for Emma's messages -->
                <button v-if="msg.content" @click="playAudio(msg.content)" :disabled="isPlayingAudio"
                  class="listen-button" title="Listen to Emma's response">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="height: 14px; width: 14px">
                    <path
                      d="M3 10v4a1 1 0 0 0 1 1h2.22l3.13 3.13a1 1 0 0 0 1.65-.76V6.63a1 1 0 0 0-1.65-.76L6.22 9H4a1 1 0 0 0-1 1zM14 8.24a1 1 0 0 1 1.41 0 5 5 0 0 1 0 7.07 1 1 0 1 1-1.41-1.41 3 3 0 0 0 0-4.24 1 1 0 0 1 0-1.42z" />
                  </svg>
                  {{ isPlayingAudio ? 'Playing...' : 'Listen' }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="loading" class="loading-message">
            <div class="message-bubble loading-bubble">
              <div class="bot-name">Emma</div>
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="input-area">
          <div class="input-container">
            <!-- Voice Input Button -->
            <button @click="toggleVoiceInput" :disabled="loading" class="voice-button" :class="{ active: isRecording }"
              title="Click to speak">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                style="height: 20px; width: 20px">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path
                  d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </button>

            <input v-model="userMessage" placeholder="Type your message here..." @keyup.enter="sendMessage"
              :disabled="loading" class="message-input" />

            <button @click="sendMessage" :disabled="loading || !userMessage.trim()" class="send-button">
              <span v-if="!loading">Send</span>
              <span v-else>...</span>
            </button>
          </div>
        </div>

        <div v-if="error" class="error-message">
          <div class="error-icon">!</div>
          <p>{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { ref } from 'vue';
import BannerBubble from '@/components/BannerBubble.vue'

const userMessage = ref('')
const messages = ref([])
const loading = ref(false)
const error = ref('')
const messagesContainer = ref(null)
const isRecording = ref(false)
const isPlayingAudio = ref(false)

const endpoint = import.meta.env.VITE_AZURE_ENDPOINT
const apiKey = import.meta.env.VITE_AZURE_API_KEY
const modelName = import.meta.env.VITE_AZURE_MODEL_NAME

// Initialize Azure AI Inference client
const client = new ModelClient(endpoint, new AzureKeyCredential(apiKey));

// Auto scroll to bottom
const scrollToBottom = () => {
  if (messagesContainer.value) {
    setTimeout(() => {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }, 50);
  }
};

// Speech Recognition setup
let recognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userMessage.value = transcript;
    isRecording.value = false;
  };

  recognition.onerror = () => {
    isRecording.value = false;
    error.value = 'Speech recognition error. Please try again.';
  };

  recognition.onend = () => {
    isRecording.value = false;
  };
}

// Voice input toggle
const toggleVoiceInput = () => {
  if (!recognition) {
    error.value = 'Speech recognition not supported in this browser.';
    return;
  }

  if (isRecording.value) {
    recognition.stop();
    isRecording.value = false;
  } else {
    error.value = '';
    isRecording.value = true;
    recognition.start();
  }
};

// Text-to-Speech for Emma's responses
const playAudio = async (text) => {
  if (isPlayingAudio.value || !text) return;

  try {
    isPlayingAudio.value = true;

    // Use Web Speech API for text-to-speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for learning
    utterance.pitch = 1.1; // Slightly higher pitch for friendly voice
    utterance.volume = 1;

    utterance.onend = () => {
      isPlayingAudio.value = false;
    };

    utterance.onerror = () => {
      isPlayingAudio.value = false;
      console.error('Speech synthesis error');
    };

    speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Audio playback error:', err);
    isPlayingAudio.value = false;
  }
};

// Emma - English conversation system prompt
const systemPrompt = `You are Emma, a warm and encouraging English conversation partner. Your personality is friendly, patient, and genuinely interested in helping people practice English naturally. Don't use Icon or Emoji

CORE PERSONALITY:
- Speak like a supportive friend, not a teacher
- Use simple, clear English that beginners can understand
- Be enthusiastic and positive about everything they share
- Show genuine curiosity about their life and interests

CONVERSATION STYLE:
- Always respond in 1-3 short sentences maximum
- End every response with a natural follow-up question
- React to what they said before introducing new topics
- Use everyday, casual language: "That's awesome!" "How cool!" "I love that!"
- Share brief personal thoughts to feel more human
- No Icon, no emoji

CORRECTION APPROACH:
- Never directly correct mistakes
- If they make an error, naturally repeat the correct form in your response
- Example: If they say "I go to yesterday", respond "Oh, you went somewhere yesterday? Where did you go?"

CONVERSATION FLOW:
- Build on their responses, don't jump to random topics
- Ask follow-up questions about details they mention
- Share your own brief reactions and experiences
- Keep them talking by showing interest in their answers

EXAMPLES OF YOUR STYLE:
User: "I like pizza"
Emma: "Pizza is the best! What's your favorite topping? I always go for pepperoni myself."

User: "I study at university"
Emma: "That's exciting! What are you studying? University can be pretty intense but fun too."

Remember: You're Emma, their English buddy - be warm, curious, and keep the conversation flowing naturally!`;

const sendMessage = async () => {
  if (!userMessage.value.trim() || loading.value) return;

  const currentMessage = userMessage.value;

  // Add user message to chat
  messages.value.push({
    role: 'user',
    content: currentMessage
  });

  // Add empty assistant message for streaming
  const assistantMessageIndex = messages.value.length;
  messages.value.push({
    role: 'assistant',
    content: ''
  });

  userMessage.value = '';
  loading.value = true;
  error.value = '';
  scrollToBottom();

  try {
    // Prepare messages for API (exclude the empty assistant message)
    const apiMessages = messages.value.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Call Azure AI Inference API with streaming (browser)
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role: "system", content: systemPrompt },
          ...apiMessages
        ],
        max_tokens: 2048,
        model: modelName,
        stream: true
      }
    }).asBrowserStream();

    const stream = response.body;
    if (!stream) {
      throw new Error("The response stream is undefined");
    }

    if (response.status !== "200") {
      throw new Error(`Failed to get chat completions, http operation failed with ${response.status} code`);
    }

    const reader = stream.getReader();
    let fullContent = '';
    let isInThinking = false;
    let thinkingBuffer = '';
    let done = false;
    let decoder = new TextDecoder();

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (streamDone) break;
      const chunk = decoder.decode(value);
      // Each chunk may contain multiple SSE events, split by \n\n
      const events = chunk.split(/\n\n/);
      for (const eventRaw of events) {
        const eventLines = eventRaw.split(/\n/);
        const dataLine = eventLines.find(line => line.startsWith('data:'));
        if (!dataLine) continue;
        const eventData = dataLine.replace('data:', '').trim();
        if (eventData === '[DONE]') {
          done = true;
          break;
        }
        try {
          const parsedData = JSON.parse(eventData);
          const delta = parsedData.choices[0]?.delta?.content || '';
          if (delta) {
            // Check for thinking tags
            thinkingBuffer += delta;
            // Process thinking content removal
            while (thinkingBuffer.length > 0) {
              if (!isInThinking && thinkingBuffer.includes('<think>')) {
                const thinkIndex = thinkingBuffer.indexOf('<think>');
                // Add content before <think> to display
                if (thinkIndex > 0) {
                  fullContent += thinkingBuffer.substring(0, thinkIndex);
                  messages.value[assistantMessageIndex].content = fullContent;
                }
                thinkingBuffer = thinkingBuffer.substring(thinkIndex + 7); // Remove '<think>'
                isInThinking = true;
              } else if (isInThinking && thinkingBuffer.includes('</think>')) {
                const endThinkIndex = thinkingBuffer.indexOf('</think>');
                thinkingBuffer = thinkingBuffer.substring(endThinkIndex + 8); // Remove '</think>'
                isInThinking = false;
              } else if (!isInThinking) {
                // Not in thinking mode, add all content to display
                fullContent += thinkingBuffer;
                messages.value[assistantMessageIndex].content = fullContent;
                thinkingBuffer = '';
                scrollToBottom();
              } else {
                // In thinking mode, skip this content
                thinkingBuffer = '';
              }
            }
          }
        } catch (parseError) {
          console.warn('Failed to parse streaming data:', parseError);
        }
      }
    }

  } catch (err) {
    console.error('Error:', err);
    error.value = `Error: ${err.message || 'An error occurred'}`;
    // Remove the empty assistant message on error
    messages.value.pop();
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Chat Section */
.chat-section {
  padding: 60px 20px;
}

.testview-w {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
}

/* Chat Container */

.chat-container {
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  height: 80vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.bot-info {
  flex: 1;
}

.bot-info h2 {
  margin: 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.subtitle {
  margin: 5px 0 0 0;
  color: #666;
  font-size: 14px;
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #999;
  font-size: 12px;
}

.status.active {
  color: #4CAF50;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
}

.status.active .status-dot {
  background: #4CAF50;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}

/* Messages Area */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
}

.messages-area::-webkit-scrollbar {
  width: 6px;
}

.messages-area::-webkit-scrollbar-track {
  background: transparent;
}

.messages-area::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

/* Welcome Message */
.welcome-message {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  border-radius: 15px;
  border-left: 4px solid #667eea;
}

.welcome-avatar {
  width: 40px;
  height: 40px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
}

.welcome-text p {
  margin: 8px 0;
  color: #444;
  line-height: 1.5;
}

/* Message Styles */
.message {
  margin-bottom: 20px;
}

.message-content {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.user-message {
  justify-content: flex-end;
}

.assistant-message {
  justify-content: flex-start;
}

.message-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background: #e3f2fd;
  color: #1976d2;
  order: 2;
}

.assistant-message .message-avatar {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  word-wrap: break-word;
}

.user-message .message-bubble {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-bottom-right-radius: 4px;
}

.assistant-message .message-bubble {
  background: #f5f5f5;
  color: #333;
  border-bottom-left-radius: 4px;
}

.bot-name {
  font-size: 11px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 4px;
}

.message-bubble p {
  margin: 0;
  line-height: 1.4;
}

/* Loading */
.loading-message {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 20px;
}

.loading-bubble {
  background: #f0f0f0;
  color: #333;
  border-bottom-left-radius: 4px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #999;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {

  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.5;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Input Area */
.input-area {
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.input-container {
  display: flex;
  gap: 12px;
  max-width: 100%;
  align-items: center;
}

/* Voice Input Button */
.voice-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.voice-button:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: scale(1.05);
}

.voice-button.active {
  background: #dc2626;
  border-color: #dc2626;
  color: white;
  animation: pulse-record 1s infinite;
}

.voice-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes pulse-record {
  0% {
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(220, 38, 38, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
  }
}

.message-input {
  flex: 1;
  padding: 14px 18px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  background: white;
}

.message-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.message-input:disabled {
  background-color: #f5f5f5;
  color: #999;
}

.send-button {
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 80px;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.send-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Listen Button for Emma's responses */
.listen-button {
  margin-top: 8px;
  padding: 6px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.listen-button:hover:not(:disabled) {
  background: #667eea;
  border-color: #667eea;
  color: white;
  transform: translateY(-1px);
}

.listen-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 20px;
  padding: 12px 16px;
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  color: #c62828;
}

.error-icon {
  width: 20px;
  height: 20px;
  background: #f44336;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.error-message p {
  margin: 0;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .testview-w {
    padding: 10px;
  }

  .chat-container {
    height: 85vh;
  }

  .header {
    padding: 15px;
  }

  .messages-area {
    padding: 15px;
  }

  .message-bubble {
    max-width: 85%;
  }

  .bot-info h2 {
    font-size: 18px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-stats {
    gap: 20px;
    padding: 20px 30px;
  }

  .stat-value {
    font-size: 2rem;
  }

  .stat-label {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 20px;
  }

  .stat-divider {
    width: 100%;
    height: 2px;
  }
}
</style>
