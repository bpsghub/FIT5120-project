# Azure Speech Service with Smart Fallback Guide

## 📋 Tổng quan

Hệ thống pronunciation assessment đã được cấu hình để **ưu tiên sử dụng Azure Speech Service** (cho độ chính xác cao hơn) và **tự động fallback về Web Speech API** khi Azure gặp lỗi.

---

## 🎯 Cách hoạt động

### 1. **Kiểm tra cấu hình Azure**

Khi ứng dụng khởi động, hệ thống sẽ kiểm tra:

- `VITE_AZURE_SPEECH_KEY` có được cấu hình không?
- `VITE_AZURE_SPEECH_REGION` có hợp lệ không?

Nếu **CẢ HAI** điều kiện đều thỏa mãn → Sử dụng **Azure Speech Service**  
Nếu thiếu 1 trong 2 → Sử dụng **Web Speech API** (fallback ngay từ đầu)

### 2. **Quy trình Assessment với Azure**

```
User clicks "Talk"
    ↓
Check: Azure configured?
    ↓
YES → Try Azure Speech Service
    ↓
Record audio (WAV PCM 16kHz mono)
    ↓
Send to Azure API
    ↓
Azure Error? (401, 400, 503, network...)
    ↓
YES → Auto fallback to Web Speech API
NO  → Return Azure result ✅
```

### 3. **Các tình huống Fallback tự động**

Hệ thống sẽ tự động chuyển sang Web Speech API trong các trường hợp:

| Lỗi                         | Mô tả                                 | Giải pháp                 |
| --------------------------- | ------------------------------------- | ------------------------- |
| **401 Unauthorized**        | API key hết hạn hoặc không hợp lệ     | Fallback → Web Speech API |
| **400 Bad Request**         | Audio format không đúng               | Fallback → Web Speech API |
| **503 Service Unavailable** | Azure service tạm thời không khả dụng | Fallback → Web Speech API |
| **Network Error**           | Không có kết nối internet             | Fallback → Web Speech API |
| **Other Errors**            | Bất kỳ lỗi nào khác                   | Fallback → Web Speech API |

---

## 🔧 Cấu hình Azure

### File `.env`

```env
# Azure Speech Service Configuration
VITE_AZURE_SPEECH_KEY=your_api_key_here
VITE_AZURE_SPEECH_REGION=australiaeast
```

### Lấy API Key từ Azure Portal

1. Đăng nhập vào [Azure Portal](https://portal.azure.com/)
2. Tìm **Cognitive Services** → **Speech Service**
3. Tạo mới hoặc chọn resource có sẵn
4. Vào **Keys and Endpoint** → Copy **KEY 1** hoặc **KEY 2**
5. Copy **REGION** (ví dụ: `australiaeast`, `eastus`, etc.)
6. Paste vào `.env` file

---

## 📊 So sánh Azure vs Web Speech API

| Tiêu chí            | Azure Speech Service                                                | Web Speech API                    |
| ------------------- | ------------------------------------------------------------------- | --------------------------------- |
| **Độ chính xác**    | ⭐⭐⭐⭐⭐ Rất cao                                                  | ⭐⭐⭐ Trung bình                 |
| **Tính năng**       | Pronunciation assessment chi tiết (Accuracy, Fluency, Completeness) | Chỉ có transcription + confidence |
| **Hỗ trợ ngôn ngữ** | 100+ ngôn ngữ                                                       | Tùy browser (thường < 50)         |
| **Yêu cầu mạng**    | ✅ Cần internet                                                     | ⚠️ Một số browser offline được    |
| **Chi phí**         | 💰 Có phí (free tier 5,000 transactions/month)                      | 🆓 Miễn phí                       |
| **Độ tin cậy**      | ⭐⭐⭐⭐ (tùy network)                                              | ⭐⭐⭐⭐⭐ (local processing)     |

---

## 🧪 Testing Guide

### 1. **Test với Azure (khi có API key)**

1. Mở app → Navigate to **Learning English** → **Flashcard**
2. Click vào card để xem English side
3. Click **"Talk"** button
4. Nói theo cụm từ hiển thị
5. Kiểm tra console log:
   ```
   ✅ Azure Speech Service is configured and will be used
   Attempting Azure Speech pronunciation assessment...
   Sending audio to Azure for assessment...
   Azure Assessment Result: {...}
   ```
6. Kết quả sẽ hiển thị với điểm số chi tiết từ Azure

### 2. **Test Fallback (khi Azure lỗi)**

1. **Tắt internet** hoặc **sai API key** trong `.env`
2. Click **"Talk"** và nói
3. Kiểm tra console log:
   ```
   Azure pronunciation error: ...
   🔄 Network error, falling back to Web Speech API
   Falling back to Web Speech API...
   ```
4. Kết quả sẽ hiển thị từ Web Speech API

### 3. **Test Web Speech API (khi không có Azure key)**

1. Xóa hoặc comment out `VITE_AZURE_SPEECH_KEY` trong `.env`
2. Restart dev server: `npm run dev`
3. Click **"Talk"**
4. Kiểm tra console log:
   ```
   ⚠️ Azure Speech Service not configured, will use Web Speech API fallback
   Azure not configured, using Web Speech API...
   ```

---

## 🐛 Troubleshooting

### Azure luôn trả về 401 Unauthorized

**Nguyên nhân:** API key hoặc region không đúng  
**Giải pháp:**

1. Kiểm tra lại API key trong Azure Portal
2. Đảm bảo region khớp với resource (e.g., `australiaeast`)
3. Kiểm tra key không có khoảng trắng ở đầu/cuối
4. Thử regenerate key mới từ Azure Portal

### Azure luôn trả về 400 Bad Request

**Nguyên nhân:** Audio format không đúng  
**Giải pháp:**

- Hệ thống đã tự động convert sang WAV PCM 16kHz mono
- Nếu vẫn lỗi → Sẽ auto fallback về Web Speech API
- Không cần can thiệp thủ công

### Web Speech API không nhận diện được giọng nói

**Nguyên nhân:**

- Microphone không được cấp quyền
- Browser không hỗ trợ Web Speech API
- Nói quá nhanh/không rõ ràng

**Giải pháp:**

1. Cho phép microphone access khi browser hỏi
2. Sử dụng Chrome/Edge (hỗ trợ tốt nhất)
3. Nói chậm, rõ ràng, gần microphone

### Kết quả assessment không chính xác

**Nguyên nhân:**

- Web Speech API đang được sử dụng (thay vì Azure)
- Môi trường ồn, mic kém chất lượng

**Giải pháp:**

1. Đảm bảo Azure đang được sử dụng (check console log)
2. Ghi âm ở môi trường yên tĩnh
3. Sử dụng headset/mic chất lượng tốt

---

## 📝 Implementation Details

### Files đã được cập nhật

1. **`src/services/azureSpeechService.js`**
   - `isAzureConfigured()`: Kiểm tra cấu hình Azure
   - `shouldFallbackToWebSpeech(error)`: Quyết định có nên fallback không
   - `assessPronunciation()`: Gửi audio lên Azure để đánh giá

2. **`src/composables/useSpeechRecognition.js`**
   - `startRecording()`: Record audio cho Azure
   - `getRecordedAudio()`: Lấy audio blob đã convert sang WAV
   - `convertWebMToWav()`: Convert WebM → WAV PCM 16kHz mono
   - `startRecordingWebAPI()`: Web Speech API fallback

3. **`src/components/Flashcard.vue`**
   - `handleTalk()`: Entry point, kiểm tra Azure vs Web Speech
   - `handleAzurePronunciation()`: Xử lý Azure assessment + auto fallback
   - `handleWebSpeechPronunciation()`: Fallback method

---

## ✅ Best Practices

1. **Luôn có .env backup** với API key hợp lệ
2. **Monitor console logs** để biết service nào đang được dùng
3. **Test cả 2 scenarios**: Azure success và fallback
4. **Educate users** về sự khác biệt giữa Azure và Web Speech results
5. **Handle errors gracefully** - không để user bị stuck

---

## 🚀 Next Steps

Nếu muốn cải thiện thêm:

1. **Add retry logic**: Thử lại Azure 1-2 lần trước khi fallback
2. **Cache Azure token**: Lưu token để tránh request nhiều lần
3. **Add analytics**: Track success rate của Azure vs Web Speech
4. **Custom UI indicators**: Hiển thị icon cho biết đang dùng service nào
5. **Progressive enhancement**: Tự động switch về Azure khi network recovery

---

## 📞 Support

Nếu gặp vấn đề:

1. Check console logs
2. Verify `.env` configuration
3. Test với Web Speech API trước (để đảm bảo mic hoạt động)
4. Test Azure riêng biệt (để đảm bảo API key hợp lệ)

---

**Tác giả**: GitHub Copilot  
**Ngày cập nhật**: 2025-10-07  
**Version**: 2.0 - Smart Fallback Implementation
