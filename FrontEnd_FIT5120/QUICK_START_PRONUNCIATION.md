# 🚀 Quick Start - Pronunciation Assessment Feature

## Tóm tắt: Tính năng đã hoàn thành

✅ **Composable**: `useSpeechRecognition.js` - Quản lý ghi âm và nhận diện giọng nói
✅ **Service**: `azureSpeechService.js` - Tích hợp Azure Speech API
✅ **Component**: `Flashcard.vue` - UI cho flashcard với nút "Talk"
✅ **Fallback**: Tự động chuyển về Web Speech API nếu Azure không khả dụng

---

## ⚡ Cài đặt nhanh (5 phút)

### 1. Clone và cài dependencies
```powershell
cd "c:\Users\WIN10\OneDrive\Desktop\Monash Project_5120\FIT5120-project\FrontEnd_FIT5120"
npm install
```

### 2. Cấu hình Azure (Optional - bỏ qua nếu chỉ test)
```powershell
# Copy .env.example sang .env
Copy-Item .env.example .env
```

Mở `.env` và thêm (nếu có Azure account):
```env
VITE_AZURE_SPEECH_KEY=your_key_here
VITE_AZURE_SPEECH_REGION=eastus
```

### 3. Chạy project
```powershell
npm run dev
```

### 4. Test ngay
1. Mở browser: `http://localhost:5173`
2. Vào **Learn English** → Chọn language → Chọn category
3. Click **Talk** button → Nói câu tiếng Anh → Xem kết quả

---

## 📁 Files đã tạo

### Core Files:
```
src/
├── composables/
│   └── useSpeechRecognition.js       ← Speech recognition logic
├── services/
│   └── azureSpeechService.js         ← Azure API integration
└── components/
    └── Flashcard.vue                 ← Updated with Talk button

Root:
├── .env                              ← Azure credentials (don't commit!)
├── .env.example                      ← Template for .env
├── AZURE_SPEECH_SETUP.md             ← Chi tiết setup Azure
├── PRONUNCIATION_GUIDE.md            ← User guide
└── TESTING_GUIDE.md                  ← Test cases
```

---

## 🎯 Cách sử dụng trong code

### Import composable:
```javascript
import { useSpeechRecognition } from '@/composables/useSpeechRecognition.js'

const {
  isRecording,
  pronunciationScore,
  startRecordingWebAPI,
  startRecordingForAzure,
  stopRecording,
  evaluatePronunciation
} = useSpeechRecognition()
```

### Import Azure service:
```javascript
import { assessPronunciation, isAzureConfigured } from '@/services/azureSpeechService.js'

// Check if Azure is configured
if (isAzureConfigured()) {
  // Use Azure
  const result = await assessPronunciation(audioBlob, referenceText, 'en-US')
} else {
  // Fallback to Web Speech API
}
```

---

## 🔧 Configuration

### Environment Variables:
```env
# Required for Azure (optional)
VITE_AZURE_SPEECH_KEY=your_subscription_key
VITE_AZURE_SPEECH_REGION=eastus

# Optional
VITE_API_BASE_URL=http://localhost:3000
```

### Supported Regions:
- `eastus` (US East)
- `westus` (US West)
- `southeastasia` (Singapore)
- `westeurope` (Netherlands)
- `australiaeast` (Sydney)

Full list: https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/regions

---

## 🎨 UI Components

### Talk Button:
```vue
<button class="talk-btn" @click.stop="handleTalk" :disabled="isRecording || isAssessing">
  {{ isRecording ? 'Recording...' : isAssessing ? 'Assessing...' : 'Talk' }}
</button>
```

### Pronunciation Result:
```vue
<div v-if="pronunciationResult" class="pronunciation-result" :class="`result-${pronunciationResult.level}`">
  <div class="result-score">
    <span class="score-value">{{ pronunciationResult.score }}</span>
    <span class="score-label">/100</span>
  </div>
  <div class="result-feedback">{{ pronunciationResult.feedback }}</div>
</div>
```

---

## 📊 API Response Format

### Azure Speech Service Response:
```javascript
{
  success: true,
  score: 85,                    // Overall score (0-100)
  accuracyScore: 87,            // Pronunciation accuracy
  fluencyScore: 84,             // Speech fluency
  completenessScore: 90,        // Completeness of speech
  confidence: 95,               // Confidence level
  transcribed: "Hello world",   // What user said
  reference: "Hello world",     // Expected text
  feedback: "Great job!",       // User-friendly message
  level: "great"                // excellent|great|good|fair|needs-improvement
}
```

### Web Speech API Response:
```javascript
{
  success: true,
  score: 78,
  similarity: 78,               // Text similarity (Levenshtein)
  confidence: 100,
  reference: "Hello world",
  transcribed: "Hello world",
  feedback: "Good!",
  level: "good"
}
```

---

## 🚨 Error Handling

### Common Errors:

**1. Microphone Access Denied**
```javascript
{
  success: false,
  score: 0,
  feedback: "Microphone access denied",
  level: "error"
}
```

**2. Azure API Error**
```javascript
{
  success: false,
  score: 0,
  feedback: "Azure Speech API error: Invalid key",
  level: "error"
}
```

**3. No Speech Recognized**
```javascript
{
  success: false,
  score: 0,
  feedback: "Could not recognize speech. Please try again.",
  level: "error"
}
```

---

## 🎓 Code Examples

### Example 1: Basic Usage (Web Speech API)
```javascript
const handleTalk = async () => {
  // Start recording
  await startRecordingWebAPI('en-US')
  
  // Wait for result
  await waitForRecognition()
  
  // Evaluate
  if (recognitionResult.value?.text) {
    const result = evaluatePronunciation(
      referenceText,
      recognitionResult.value.text,
      recognitionResult.value.confidence
    )
    console.log('Score:', result.score)
  }
}
```

### Example 2: Azure Integration
```javascript
const handleTalkWithAzure = async () => {
  // Start recording
  await startRecordingForAzure()
  
  // Record for 5 seconds
  await new Promise(resolve => setTimeout(resolve, 5000))
  
  // Stop and get audio
  stopRecording()
  const audioBlob = await getAudioBlob()
  
  // Send to Azure
  const result = await assessPronunciation(
    audioBlob,
    referenceText,
    'en-US'
  )
  
  console.log('Azure Score:', result.score)
  console.log('Accuracy:', result.accuracyScore)
  console.log('Fluency:', result.fluencyScore)
}
```

---

## 🧪 Quick Test

### Test with Console:
```javascript
// In browser console
const test = async () => {
  const { useSpeechRecognition } = await import('/src/composables/useSpeechRecognition.js')
  const { startRecordingWebAPI, recognitionResult } = useSpeechRecognition()
  
  await startRecordingWebAPI('en-US')
  console.log('Say something...')
  
  setTimeout(() => {
    console.log('Result:', recognitionResult.value)
  }, 5000)
}

test()
```

---

## 📚 Documentation Links

- **Azure Speech Setup**: [`AZURE_SPEECH_SETUP.md`](./AZURE_SPEECH_SETUP.md)
- **User Guide**: [`PRONUNCIATION_GUIDE.md`](./PRONUNCIATION_GUIDE.md)
- **Testing Guide**: [`TESTING_GUIDE.md`](./TESTING_GUIDE.md)
- **Azure Docs**: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/
- **Web Speech API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

---

## 🔒 Security Best Practices

1. **Never commit `.env` file**
   - Already in `.gitignore`
   - Use `.env.example` as template

2. **Rotate Azure keys regularly**
   - Azure Portal → Keys → Regenerate

3. **Use environment variables in production**
   - Deploy with proper env vars
   - Don't hardcode keys in code

4. **Limit API usage**
   - Monitor Azure dashboard
   - Set up budget alerts

---

## 🐛 Troubleshooting

### Problem: Talk button not working
**Solution**: Check browser console for errors, ensure microphone permissions granted

### Problem: Always getting 0 score
**Solution**: Check if speech is being recognized, try speaking louder and clearer

### Problem: Azure not working
**Solution**: 
1. Check `.env` file has correct keys
2. Verify region matches Azure Portal
3. Restart dev server after changing `.env`
4. Check Azure quota not exceeded

### Problem: "import.meta.env is undefined"
**Solution**: Using Vite, ensure you're using `VITE_` prefix for env vars

---

## 📦 Build for Production

```powershell
# Build
npm run build

# Preview production build
npm run preview
```

**Important**: Set environment variables in your hosting platform (Vercel, Netlify, etc.)

---

## ✅ Checklist

Before deploying:
- [ ] `.env` file not committed
- [ ] Azure keys configured (or fallback to Web Speech)
- [ ] Tested on Chrome, Edge
- [ ] Tested on mobile device
- [ ] Error handling works
- [ ] All test cases passed

---

**Ready to go! 🎉**

Questions? Check the documentation files or create an issue on GitHub.
