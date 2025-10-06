# Pronunciation Assessment Feature - Quick Start Guide

## 📌 Tổng quan

Tính năng **Pronunciation Assessment** cho phép người dùng:
- ✅ Ghi âm phát âm của họ
- ✅ So sánh với câu chuẩn
- ✅ Nhận điểm số và phản hồi chi tiết
- ✅ Cải thiện kỹ năng phát âm tiếng Anh

## 🚀 Cách sử dụng

### 1. Trên trang Learn English
1. Chọn ngôn ngữ của bạn (Chinese, Vietnamese, Indonesian)
2. Chọn một category (Greetings, Emergency, Shopping, Activities)
3. Xem flashcard với câu trong ngôn ngữ của bạn ở mặt trước
4. Click để lật sang mặt tiếng Anh

### 2. Sử dụng chức năng "Talk"
1. Ở mặt sau (English), click nút **"Listen"** để nghe phát âm chuẩn
2. Click nút **"Talk"** (màu tím gradient)
3. Hệ thống sẽ bắt đầu ghi âm (hiển thị "Recording...")
4. Đọc to câu tiếng Anh trong thời gian 5 giây
5. Hệ thống tự động dừng và phân tích (hiển thị "Assessing...")
6. Xem kết quả với:
   - **Điểm số**: 0-100
   - **Feedback**: Đánh giá chất lượng phát âm
   - **Transcription**: Những gì bạn đã nói

### 3. Hiểu kết quả

#### Thang điểm:
- 🎉 **90-100**: Excellent (Xuất sắc)
- 👏 **80-89**: Great (Rất tốt)
- 👍 **70-79**: Good (Tốt)
- 😊 **60-69**: Fair (Khá)
- 💪 **0-59**: Needs improvement (Cần cải thiện)

#### Màu sắc:
- 🟢 Xanh lá: Excellent
- 🔵 Xanh dương: Great
- 🟡 Vàng: Good
- 🟠 Cam: Fair
- 🔴 Đỏ: Needs improvement

## 🔧 Cấu hình

### Option 1: Sử dụng Azure Speech Service (Khuyến nghị)
**Ưu điểm**: Độ chính xác cao, phản hồi chi tiết

1. Đọc file [`AZURE_SPEECH_SETUP.md`](./AZURE_SPEECH_SETUP.md) để biết cách:
   - Tạo tài khoản Azure (miễn phí)
   - Lấy API key và region
   - Cấu hình trong project

2. Cập nhật file `.env`:
```env
VITE_AZURE_SPEECH_KEY=your_key_here
VITE_AZURE_SPEECH_REGION=eastus
```

3. Restart dev server:
```bash
npm run dev
```

### Option 2: Sử dụng Web Speech API (Mặc định)
**Ưu điểm**: Miễn phí, không cần cấu hình

- Tự động được sử dụng khi Azure chưa cấu hình
- Hoạt động tốt với Chrome và Edge
- Độ chính xác thấp hơn Azure

## 🎯 Lời khuyên để đạt điểm cao

1. **Môi trường**: Tìm nơi yên tĩnh, ít tiếng ồn
2. **Microphone**: Sử dụng microphone tốt hoặc headset
3. **Phát âm**: Nói rõ ràng, từ tốc, không quá nhanh
4. **Lắng nghe**: Click "Listen" trước để nghe phát âm chuẩn
5. **Luyện tập**: Thử nhiều lần cho đến khi đạt 90+ điểm

## 🐛 Xử lý lỗi thường gặp

### "Microphone access denied"
**Giải pháp**: 
- Cho phép browser truy cập microphone
- Trên Chrome: Click biểu tượng khóa/camera ở thanh địa chỉ
- Reload lại trang

### "Could not recognize speech"
**Giải pháp**:
- Kiểm tra microphone có hoạt động không
- Nói to và rõ hơn
- Thử lại trong môi trường yên tĩng hơn

### "Error: Please try again"
**Giải pháp**:
- Kiểm tra kết nối internet
- Nếu dùng Azure: Kiểm tra API key trong `.env`
- Xem console log để biết chi tiết lỗi

### Azure không hoạt động
**Giải pháp**:
- Hệ thống tự động fallback về Web Speech API
- Kiểm tra file `.env` có đúng format không
- Xem chi tiết trong `AZURE_SPEECH_SETUP.md`

## 📊 Technical Details

### Luồng hoạt động:

```
User clicks "Talk"
    ↓
Check if Azure configured
    ↓
[Yes] → Use Azure Speech Service
    ↓
    - Record audio (5s)
    - Send to Azure API
    - Get pronunciation score
    - Display detailed feedback
    
[No] → Use Web Speech API
    ↓
    - Start speech recognition
    - Convert speech to text
    - Compare with reference text
    - Calculate similarity score
    - Display feedback
```

### API Endpoints:

**Azure Speech Service**:
- Endpoint: `https://{region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`
- Method: POST
- Headers: Authorization token, Pronunciation-Assessment params
- Body: Audio blob (WAV format)

**Response format**:
```json
{
  "success": true,
  "score": 85,
  "accuracyScore": 87,
  "fluencyScore": 84,
  "completenessScore": 90,
  "feedback": "Great job! Your pronunciation is very good.",
  "level": "great",
  "transcribed": "Hello, how are you?",
  "reference": "Hello, how are you?"
}
```

## 🔐 Bảo mật

- ✅ API keys được lưu trong file `.env` (không commit lên Git)
- ✅ Audio không được lưu trữ lâu dài
- ✅ Dữ liệu chỉ gửi lên Azure khi user click "Talk"
- ✅ Tuân thủ GDPR và privacy policies

## 📚 Resources

- [Azure Speech Documentation](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Pronunciation Assessment Guide](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment)

## 🤝 Contributing

Nếu bạn muốn cải thiện tính năng này:
1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📝 License

MIT License - xem file LICENSE để biết chi tiết

---

**Chúc bạn học tốt! 🎓**
