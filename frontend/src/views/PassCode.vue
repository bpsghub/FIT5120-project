<template>
  <div class="passcode-container">
    <div class="passcode-card">
      <div class="logo-section">
        <h1 class="app-title">FIT5120 Project</h1>
        <p class="subtitle">Team TE06</p>
      </div>

      <form @submit.prevent="checkPasscode" class="passcode-form">
        <div class="input-group">
          <label for="passcode" class="passcode-label">Enter Passcode</label>
          <input id="passcode" v-model="userInput" type="password" class="passcode-input"
            :class="{ 'error': showError }" placeholder="Enter passcode" maxlength="10" autocomplete="off" />
        </div>

        <div v-if="showError" class="error-message">
          Incorrect passcode. Please try again.
        </div>

        <button type="submit" class="submit-button" :disabled="!userInput.trim()">
          Enter
        </button>
      </form>

      <div class="footer-text">
        Please enter the correct passcode to access the application
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userInput = ref('')
const showError = ref(false)

const CORRECT_PASSCODE = 'TE06'

const checkPasscode = () => {
  if (userInput.value.trim() === CORRECT_PASSCODE) {
    // Store authentication state
    localStorage.setItem('isAuthenticated', 'true')
    // Redirect to home
    router.push('/')
  } else {
    showError.value = true
    userInput.value = ''
    // Hide error after 3 seconds
    setTimeout(() => {
      showError.value = false
    }, 3000)
  }
}
</script>

<style scoped>
.passcode-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.passcode-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.logo-section {
  margin-bottom: 40px;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.1rem;
  color: #718096;
  margin: 0;
  font-weight: 500;
}

.passcode-form {
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.passcode-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
}

.passcode-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
  background: #f7fafc;
}

.passcode-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.passcode-input.error {
  border-color: #e53e3e;
  background: #fed7d7;
}

.error-message {
  color: #e53e3e;
  font-size: 0.9rem;
  margin-bottom: 20px;
  font-weight: 500;
}

.submit-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.footer-text {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Responsive design */
@media (max-width: 480px) {
  .passcode-card {
    padding: 30px 20px;
  }

  .app-title {
    font-size: 2rem;
  }
}
</style>
