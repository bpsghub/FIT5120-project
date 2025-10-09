# Testing Guide - Pronunciation Assessment Feature

## 🧪 Hướng dẫn Test Tính năng Pronunciation Assessment

### Chuẩn bị môi trường test

#### 1. Cài đặt dependencies
```powershell
cd "c:\Users\WIN10\OneDrive\Desktop\Monash Project_5120\FIT5120-project\FrontEnd_FIT5120"
npm install
```

#### 2. Cấu hình environment (Optional - cho Azure)
```powershell
# Copy file .env.example sang .env
Copy-Item .env.example .env

# Mở file .env và thêm Azure credentials (nếu có)
notepad .env
```

#### 3. Chạy development server
```powershell
npm run dev
```

Server sẽ chạy tại: `http://localhost:5173` (hoặc port khác nếu 5173 đã được sử dụng)

---

## 📋 Test Cases

### Test Case 1: Kiểm tra Web Speech API (Không cần Azure)

**Mục đích**: Đảm bảo tính năng hoạt động với Web Speech API khi Azure chưa cấu hình

**Điều kiện tiên quyết**:
- File `.env` không có `VITE_AZURE_SPEECH_KEY` hoặc để trống
- Browser: Chrome hoặc Edge (Safari không support Web Speech Recognition)
- Microphone hoạt động tốt

**Các bước test**:
1. Mở browser và truy cập `http://localhost:5173`
2. Click vào menu "Learn English" hoặc "Học tiếng Anh"
3. Chọn ngôn ngữ: Chinese (中文), Vietnamese (Tiếng Việt), hoặc Indonesian (Bahasa Indonesia)
4. Chọn một category: Greetings, Emergency, Shopping, hoặc Activities
5. Hệ thống hiển thị flashcard với ngôn ngữ native ở mặt trước
6. Click vào flashcard để lật sang mặt tiếng Anh
7. Click nút **"Listen"** để nghe phát âm chuẩn
8. Click nút **"Talk"** (màu tím gradient)
9. Khi hiển thị "Recording...", đọc to câu tiếng Anh
10. Đợi hệ thống phân tích (hiển thị "Assessing...")
11. Xem kết quả hiển thị

**Kết quả mong đợi**:
- ✅ Nút "Talk" chuyển sang "Recording..." khi bắt đầu ghi âm
- ✅ Sau 5-10 giây, hiển thị "Assessing..."
- ✅ Hiển thị kết quả với:
  - Score (0-100)
  - Feedback message
  - "You said: [transcribed text]"
- ✅ Màu sắc kết quả phù hợp với điểm (xanh lá = cao, đỏ = thấp)

**Ghi chú**: 
- Web Speech API có thể không chính xác 100%
- Nếu không nhận diện được, hiển thị "Could not recognize speech"

---

### Test Case 2: Kiểm tra Azure Speech Service

**Mục đích**: Đảm bảo tính năng hoạt động với Azure Speech Service

**Điều kiện tiên quyết**:
- File `.env` có `VITE_AZURE_SPEECH_KEY` và `VITE_AZURE_SPEECH_REGION`
- Azure Speech Service đã được cấu hình đúng
- Internet connection ổn định

**Các bước test**:
1. Cấu hình `.env`:
```env
VITE_AZURE_SPEECH_KEY=your_actual_azure_key
VITE_AZURE_SPEECH_REGION=eastus
```

2. Restart dev server:
```powershell
# Ctrl+C để stop server hiện tại
npm run dev
```

3. Làm theo các bước giống Test Case 1 (bước 1-11)

**Kết quả mong đợi**:
- ✅ Tất cả như Test Case 1
- ✅ Thêm chi tiết:
  - Accuracy Score
  - Fluency Score
  - Completeness Score
- ✅ Feedback chi tiết hơn và chính xác hơn
- ✅ Transcription chính xác hơn Web Speech API

---

### Test Case 3: Error Handling - Microphone bị từ chối

**Mục đích**: Kiểm tra xử lý lỗi khi user từ chối quyền truy cập microphone

**Các bước test**:
1. Mở browser settings và chặn microphone access cho localhost
2. Reload trang và làm theo Test Case 1
3. Click nút "Talk"

**Kết quả mong đợi**:
- ✅ Hiển thị error message: "Microphone access denied" hoặc tương tự
- ✅ Nút "Talk" không bị disabled vĩnh viễn
- ✅ User có thể thử lại sau khi cho phép microphone

---

### Test Case 4: Error Handling - Azure Key không hợp lệ

**Mục đích**: Kiểm tra fallback về Web Speech API khi Azure fail

**Các bước test**:
1. Cấu hình `.env` với Azure key sai:
```env
VITE_AZURE_SPEECH_KEY=invalid_key_12345
VITE_AZURE_SPEECH_REGION=eastus
```

2. Restart server và test như Test Case 1

**Kết quả mong đợi**:
- ✅ Hệ thống tự động fallback về Web Speech API
- ✅ Hiển thị error trong console (có thể bỏ qua)
- ✅ Vẫn có thể sử dụng tính năng với Web Speech API
- ✅ Không crash toàn bộ app

---

### Test Case 5: Kiểm tra các mức điểm khác nhau

**Mục đích**: Đảm bảo UI hiển thị đúng cho từng mức điểm

**Các bước test**:

**Test 5.1 - Điểm cao (90-100)**:
1. Đọc chính xác câu tiếng Anh với phát âm chuẩn
2. Kiểm tra màu xanh lá, feedback "Excellent!"

**Test 5.2 - Điểm trung bình (60-79)**:
1. Đọc với một vài lỗi phát âm nhẹ
2. Kiểm tra màu vàng/cam, feedback "Good" hoặc "Fair"

**Test 5.3 - Điểm thấp (0-59)**:
1. Đọc hoàn toàn sai hoặc không đọc
2. Kiểm tra màu đỏ, feedback "Keep trying!"

**Kết quả mong đợi**:
- ✅ Mỗi mức điểm có màu sắc riêng
- ✅ Feedback message phù hợp
- ✅ Animation slideIn khi hiển thị kết quả

---

### Test Case 6: Kiểm tra responsive design

**Mục đích**: Đảm bảo UI hoạt động tốt trên mobile

**Các bước test**:
1. Mở DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Chọn iPhone 12 Pro hoặc Galaxy S21
4. Test toàn bộ flow như Test Case 1

**Kết quả mong đợi**:
- ✅ Flashcard fit màn hình
- ✅ Nút "Listen" và "Talk" đủ lớn để click trên mobile
- ✅ Kết quả hiển thị đầy đủ không bị cắt
- ✅ Font size đọc được trên màn hình nhỏ

---

### Test Case 7: Kiểm tra nhiều lần liên tiếp

**Mục đích**: Đảm bảo không có memory leak hoặc bug khi test nhiều lần

**Các bước test**:
1. Test Case 1 nhưng click "Talk" 5-10 lần liên tiếp
2. Mỗi lần đọc câu khác nhau (hoặc giống nhau)
3. Kiểm tra performance

**Kết quả mong đợi**:
- ✅ Không lag sau nhiều lần test
- ✅ Kết quả cũ bị clear khi bắt đầu test mới
- ✅ Memory không tăng bất thường (check DevTools Performance)

---

## 🐛 Common Issues và Giải pháp

### Issue 1: "Talk" button bị disabled
**Nguyên nhân**: Đang recording hoặc assessing
**Giải pháp**: Đợi process hiện tại hoàn thành

### Issue 2: Không có âm thanh khi click "Listen"
**Nguyên nhân**: Text-to-Speech chưa load
**Giải pháp**: 
- Kiểm tra browser có support SpeechSynthesis không
- Thử trên Chrome/Edge

### Issue 3: Score luôn = 0
**Nguyên nhân**: 
- Microphone không hoạt động
- Speech recognition không nhận diện được
**Giải pháp**:
- Test microphone trên trang khác (Google Voice Search)
- Nói to và rõ hơn
- Kiểm tra browser permissions

### Issue 4: Azure error "Invalid region"
**Nguyên nhân**: Region trong .env không đúng format
**Giải pháp**: 
- Dùng lowercase: `eastus`, `southeastasia`, không phải `East US`
- Xem danh sách regions: https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/regions

---

## 📊 Test Results Template

Sử dụng template này để ghi lại kết quả test:

```markdown
## Test Results - [Date]

### Test Case 1: Web Speech API
- ✅ Passed / ❌ Failed
- Notes: [any issues found]

### Test Case 2: Azure Speech Service
- ✅ Passed / ❌ Failed
- Notes: [any issues found]

### Test Case 3: Error Handling
- ✅ Passed / ❌ Failed
- Notes: [any issues found]

### Browsers Tested:
- [ ] Chrome (Version: ___)
- [ ] Edge (Version: ___)
- [ ] Firefox (Version: ___)
- [ ] Safari (Version: ___)

### Devices Tested:
- [ ] Desktop Windows
- [ ] MacBook
- [ ] iPhone
- [ ] Android Phone

### Performance:
- Average response time: ___ seconds
- Memory usage: Normal / High
- Any lag: Yes / No
```

---

## 🔍 Debugging Tools

### Console Logging
Mở DevTools Console (F12) để xem:
- Speech recognition events
- Azure API calls
- Error messages

### Network Tab
Kiểm tra API calls tới Azure:
- Request headers
- Response status
- Payload size

### Performance Tab
Monitor:
- Memory usage
- CPU usage
- Recording/playback performance

---

## ✅ Sign-off Checklist

Trước khi deploy production:

- [ ] Tất cả test cases passed
- [ ] Tested trên ít nhất 2 browsers
- [ ] Tested trên mobile device
- [ ] Azure credentials được secure
- [ ] `.env` không bị commit lên Git
- [ ] Error handling hoạt động tốt
- [ ] Performance ổn định
- [ ] Documentation đầy đủ
- [ ] Code đã được review

---

**Chúc bạn test thành công! 🚀**
