# 🔐 Security Notice: Environment Variables Setup

## Important Security Update

This project now uses environment variables to protect sensitive API keys. You need to set up your local environment before running the application.

## Setup Instructions

### 1. Create Environment File
Copy the example environment file and add your actual API keys:

```bash
cd FrontEnd_FIT5120
cp .env.example .env
```

### 2. Configure Your API Keys
Edit the `.env` file and replace the placeholder values with your actual API keys:

```bash
# Azure AI Services Configuration
VITE_AZURE_ENDPOINT=your_azure_ai_endpoint_here
VITE_AZURE_API_KEY=your_azure_ai_api_key_here
VITE_AZURE_MODEL_NAME=DeepSeek-R1

# Azure Speech Service Configuration  
VITE_AZURE_SPEECH_KEY=your_azure_speech_key_here
VITE_AZURE_SPEECH_REGION=australiaeast

# Google Translation API
VITE_GOOGLE_TRANSLATION_API_KEY=your_google_translation_api_key_here
```

### 3. Required API Keys

#### Azure AI Services
- Get your endpoint and API key from [Azure Portal](https://portal.azure.com)
- Navigate to your AI Services resource
- Copy the endpoint URL and API key

#### Azure Speech Services  
- Get your Speech Service key from [Azure Portal](https://portal.azure.com)
- Navigate to your Speech Service resource
- Copy the subscription key and region

#### Google Translation API
- Get your API key from [Google Cloud Console](https://console.cloud.google.com)
- Enable the Translation API
- Create credentials and copy the API key

### 4. Security Best Practices

⚠️ **NEVER commit the `.env` file to git**
- The `.env` file is already in `.gitignore`
- Always use `.env.example` for sharing configuration structure
- Rotate API keys regularly
- Use different keys for development and production

### 5. Verify Setup
Run the application to ensure everything works:

```bash
npm run dev
```

## Troubleshooting

- If you see "undefined" errors, check that all environment variables are set correctly
- Ensure there are no spaces around the `=` sign in your `.env` file
- Restart the development server after changing environment variables

## Features Using API Keys

- **AI Chatbot** (`/chatbot`): Uses Azure AI Services for conversation
- **Speech Recognition**: Uses Azure Speech Services for voice input  
- **Text-to-Speech**: Uses Web Speech API for audio output
- **Translation**: Uses Google Translation API for multi-language support

---

🛡️ **This security update protects sensitive API keys from being exposed in the repository.**