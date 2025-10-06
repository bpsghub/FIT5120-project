# ✅ Quick Checklist - Bắt đầu ngay!

## Bước 1: Cài đặt (2 phút)

```powershell
# Di chuyển vào thư mục project
cd "c:\Users\WIN10\OneDrive\Desktop\Monash Project_5120\FIT5120-project\FrontEnd_FIT5120"

# Cài dependencies (nếu chưa cài)
npm install
```

✅ Node version hiện tại: **v22.18.0** (OK!)

---

## Bước 2: Chạy project (1 phút)

```powershell
# Chạy development server
npm run dev
```

Truy cập: **http://localhost:5173**

---

## Bước 3: Test tính năng (2 phút)

### ✅ Test với Web Speech API (KHÔNG cần Azure)

1. Mở browser → `http://localhost:5173`
2. Click **"Learn English"** hoặc **"Học tiếng Anh"**
3. Chọn ngôn ngữ: **Chinese / Vietnamese / Indonesian**
4. Chọn category: **Greetings / Emergency / Shopping / Activities**
5. Click vào flashcard để lật sang mặt tiếng Anh
6. Click nút **"Listen"** → Nghe phát âm chuẩn
7. Click nút **"Talk"** (màu tím) → Nói câu tiếng Anh
8. Xem kết quả: Score (0-100) + Feedback

**Kết quả mong đợi**:
- ✅ Hiển thị "Recording..." khi ghi âm
- ✅ Hiển thị "Assessing..." khi phân tích
- ✅ Hiển thị điểm số và feedback
- ✅ Màu sắc thay đổi theo điểm (xanh = cao, đỏ = thấp)

---

## Bước 4: Cấu hình Azure (Optional - bỏ qua nếu chỉ test)

### Nếu muốn dùng Azure Speech Service (chất lượng cao hơn):

```powershell
# Copy file .env.example sang .env
Copy-Item .env.example .env

# Mở file .env
notepad .env
```

Thêm vào file `.env`:
```env
VITE_AZURE_SPEECH_KEY=your_azure_key_here
VITE_AZURE_SPEECH_REGION=eastus
```

**Lấy Azure key**: Xem file `AZURE_SPEECH_SETUP.md`

Sau đó **restart server**:
```powershell
# Stop server (Ctrl+C)
# Chạy lại
npm run dev
```

---

## 🎯 Troubleshooting nhanh

### "Talk button không hoạt động"
✅ Kiểm tra browser có cho phép microphone không

### "Không nhận diện được giọng nói"
✅ Nói to và rõ hơn
✅ Kiểm tra microphone hoạt động
✅ Thử trên Chrome/Edge (hỗ trợ tốt nhất)

### "Azure không hoạt động"
✅ Hệ thống tự động dùng Web Speech API (vẫn OK)
✅ Kiểm tra file `.env` có đúng format không
✅ Restart server sau khi sửa `.env`

---

## 📚 Đọc thêm

- **QUICK_START_PRONUNCIATION.md** → Quick reference
- **AZURE_SPEECH_SETUP.md** → Setup Azure (chi tiết 6 bước)
- **TESTING_GUIDE.md** → Test cases đầy đủ
- **IMPLEMENTATION_SUMMARY.md** → Tổng quan toàn bộ tính năng

---

## ✅ Files quan trọng đã tạo

```
src/
├── composables/
│   └── useSpeechRecognition.js      ← Speech recognition logic
├── services/
│   └── azureSpeechService.js        ← Azure integration
└── components/
    └── Flashcard.vue                ← Đã update với Talk button

Root:
├── .env                             ← Azure config (tạo từ .env.example)
└── .env.example                     ← Template
```

---

## 🚀 READY TO TEST!

**Chạy ngay**:
```powershell
npm run dev
```

**Mở browser**:
```
http://localhost:5173
```

**Vào Learn English → Chọn language → Chọn category → Click Talk!**

---

**Chúc bạn test thành công! 🎉**

*Có vấn đề? Check TESTING_GUIDE.md hoặc console log*
