# Hướng dẫn cấu hình Azure Speech Service cho chức năng Pronunciation Assessment

## 1. Tạo tài khoản Azure Speech Service

### Bước 1: Đăng ký Azure
1. Truy cập [Azure Portal](https://portal.azure.com/)
2. Đăng ký tài khoản miễn phí (được 200 USD credit trong 30 ngày đầu)
3. Đăng nhập vào Azure Portal

### Bước 2: Tạo Speech Service Resource
1. Trong Azure Portal, click **"Create a resource"**
2. Tìm kiếm **"Speech"** hoặc **"Cognitive Services"**
3. Chọn **"Speech Services"**
4. Click **"Create"**

### Bước 3: Cấu hình Speech Service
Điền thông tin sau:
- **Subscription**: Chọn subscription của bạn
- **Resource Group**: Tạo mới hoặc chọn existing (ví dụ: `rg-fit5120-dev`)
- **Region**: Chọn region gần nhất (ví dụ: `East US`, `Southeast Asia`)
- **Name**: Đặt tên duy nhất (ví dụ: `fit5120-speech-service`)
- **Pricing Tier**: 
  - **Free (F0)**: 5,000 transactions/month miễn phí (đủ cho development)
  - **Standard (S0)**: Pay-as-you-go (tính theo usage)

5. Click **"Review + Create"** → **"Create"**

### Bước 4: Lấy API Keys
1. Sau khi resource được tạo, vào **"Keys and Endpoint"**
2. Copy **Key 1** hoặc **Key 2**
3. Copy **Region** (ví dụ: `eastus`, `southeastasia`)

## 2. Cấu hình trong Project

### Cập nhật file `.env`
Mở file `.env` trong thư mục root của project và thêm:

```env
VITE_AZURE_SPEECH_KEY=your_azure_speech_key_here
VITE_AZURE_SPEECH_REGION=eastus
```

**Lưu ý**: 
- Thay `your_azure_speech_key_here` bằng Key bạn vừa copy
- Thay `eastus` bằng region bạn đã chọn

### Ví dụ file `.env`:
```env
VITE_AZURE_SPEECH_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
VITE_AZURE_SPEECH_REGION=southeastasia
```

## 3. Giá cả và Quota

### Free Tier (F0):
- **Speech-to-Text**: 5 giờ audio miễn phí/tháng
- **Pronunciation Assessment**: 5,000 transactions miễn phí/tháng
- Đủ cho development và testing

### Standard Tier (S0):
- **Speech-to-Text**: $1 USD/giờ audio
- **Pronunciation Assessment**: $1.50 USD/1000 transactions
- Phù hợp cho production

Xem chi tiết: [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)

## 4. Testing

### Kiểm tra Azure đã hoạt động:
1. Chạy project: `npm run dev`
2. Mở trang Learn English → Chọn category và language
3. Click nút **"Talk"** trên mặt sau của flashcard (English side)
4. Nói câu tiếng Anh theo như trên card
5. Hệ thống sẽ chấm điểm phát âm của bạn

### Nếu Azure chưa cấu hình:
- Hệ thống sẽ tự động sử dụng **Web Speech API** (built-in browser)
- Chức năng vẫn hoạt động nhưng độ chính xác thấp hơn

## 5. Troubleshooting

### Lỗi: "Invalid Subscription Key"
- Kiểm tra lại `VITE_AZURE_SPEECH_KEY` trong file `.env`
- Đảm bảo không có khoảng trắng thừa
- Restart lại dev server sau khi cập nhật `.env`

### Lỗi: "Region not found"
- Kiểm tra lại `VITE_AZURE_SPEECH_REGION`
- Phải khớp với region trong Azure Portal (ví dụ: `eastus`, không phải `East US`)

### Lỗi: "Microphone access denied"
- Cho phép browser truy cập microphone
- Chỉ hoạt động trên HTTPS hoặc localhost

### Lỗi: "Quota exceeded"
- Bạn đã vượt quá free quota (5,000 transactions/tháng)
- Upgrade lên Standard tier hoặc đợi tháng mới

## 6. Giải pháp thay thế (miễn phí)

Nếu không muốn dùng Azure, hệ thống sẽ tự động fallback về **Web Speech API**:
- ✅ Hoàn toàn miễn phí
- ✅ Không cần API key
- ✅ Built-in trong browser
- ⚠️ Độ chính xác thấp hơn Azure
- ⚠️ Không có detailed feedback như Azure

## 7. Resources

- [Azure Speech Service Documentation](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/)
- [Pronunciation Assessment Overview](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment)
- [Azure Free Account](https://azure.microsoft.com/en-us/free/)
- [Pricing Details](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/)

## 8. Best Practices

1. **Bảo mật API Key**:
   - Không commit file `.env` lên Git
   - Sử dụng environment variables trong production
   - Rotate keys định kỳ

2. **Tối ưu chi phí**:
   - Sử dụng Free tier cho development
   - Implement caching cho kết quả
   - Monitor usage qua Azure Portal

3. **Fallback Strategy**:
   - Luôn có Web Speech API làm backup
   - Graceful degradation khi Azure không khả dụng
   - Hiển thị thông báo rõ ràng cho user

---

**Cần hỗ trợ?** Liên hệ với team hoặc tạo issue trên GitHub repository.
