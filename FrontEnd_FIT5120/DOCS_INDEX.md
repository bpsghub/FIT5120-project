# 📚 Pronunciation Assessment Documentation - Table of Contents

## 🎯 Tổng quan tính năng

Tính năng **Pronunciation Assessment** cho phép người dùng:
- ✅ Ghi âm phát âm tiếng Anh
- ✅ Nhận điểm số từ 0-100
- ✅ Nhận phản hồi chi tiết về chất lượng phát âm
- ✅ So sánh với phát âm chuẩn
- ✅ Cải thiện kỹ năng giao tiếp

---

## 📖 Hướng dẫn theo từng đối tượng

### 👨‍💻 Dành cho Developers

#### 1️⃣ **[START_HERE.md](./START_HERE.md)** ⭐ BẮT ĐẦU TẠI ĐÂY
**Thời gian**: 5 phút
- ✅ Quick checklist 4 bước
- ✅ Chạy project ngay lập tức
- ✅ Test nhanh tính năng
- ✅ Troubleshooting cơ bản

**Khi nào dùng**: Lần đầu tiên setup project

---

#### 2️⃣ **[QUICK_START_PRONUNCIATION.md](./QUICK_START_PRONUNCIATION.md)**
**Thời gian**: 10 phút
- 📦 Installation guide
- 🔧 Configuration examples
- 🎨 UI components overview
- 📊 API response format
- 💻 Code examples
- 🧪 Quick test commands

**Khi nào dùng**: Cần reference nhanh về API và code

---

#### 3️⃣ **[FLOW_DIAGRAM.md](./FLOW_DIAGRAM.md)**
**Thời gian**: 15 phút
- 🔄 Visual flow diagram
- 📊 Step-by-step execution
- 🎯 Decision trees (Azure vs Web Speech)
- 🧮 Algorithm explanation (Levenshtein Distance)
- 🎨 Color coding logic
- ❌ Error handling flows

**Khi nào dùng**: Cần hiểu chi tiết cách hoạt động của hệ thống

---

#### 4️⃣ **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)**
**Thời gian**: 20 phút
- 📁 Complete file structure
- ⚙️ Technical architecture
- 🔐 Security implementation
- 📊 Performance metrics
- 💰 Cost analysis
- ✅ Deployment checklist

**Khi nào dùng**: Review toàn bộ implementation hoặc trước khi deploy

---

### 🔧 Dành cho System Administrators

#### 5️⃣ **[AZURE_SPEECH_SETUP.md](./AZURE_SPEECH_SETUP.md)**
**Thời gian**: 30 phút
- 🌐 Tạo Azure account (step-by-step)
- 🔑 Get API keys và region
- ⚙️ Configure environment variables
- 💲 Pricing tiers và quota
- 🔄 Rotate keys (security)
- 🐛 Troubleshooting Azure errors

**Khi nào dùng**: Setup Azure Speech Service lần đầu

---

### 🧪 Dành cho QA/Testers

#### 6️⃣ **[TESTING_GUIDE.md](./TESTING_GUIDE.md)**
**Thời gian**: 45 phút
- ✅ 7 test cases chi tiết
- 🧪 Test với Web Speech API
- 🌐 Test với Azure Speech Service
- 🐛 Error handling tests
- 📱 Responsive design tests
- 📊 Performance tests
- 📝 Test results template

**Khi nào dùng**: QA testing trước release

---

### 👥 Dành cho End Users

#### 7️⃣ **[PRONUNCIATION_GUIDE.md](./PRONUNCIATION_GUIDE.md)**
**Thời gian**: 10 phút
- 🎯 Cách sử dụng tính năng
- 📊 Hiểu kết quả (score levels)
- 💡 Tips để đạt điểm cao
- 🐛 Xử lý lỗi thường gặp (user-facing)
- 🔒 Privacy và security
- 🤝 Support contact

**Khi nào dùng**: Hướng dẫn người dùng cuối

---

## 🗺️ Roadmap đọc tài liệu

### Scenario 1: "Tôi là developer mới, lần đầu setup"
```
1. START_HERE.md              (5 min)
   ↓
2. QUICK_START_PRONUNCIATION.md (10 min)
   ↓
3. Test thử tính năng
   ↓
4. FLOW_DIAGRAM.md (optional)  (15 min)
```

### Scenario 2: "Tôi cần setup Azure"
```
1. START_HERE.md              (5 min)
   ↓
2. AZURE_SPEECH_SETUP.md      (30 min)
   ↓
3. Restart server & test
```

### Scenario 3: "Tôi cần QA/test toàn bộ"
```
1. TESTING_GUIDE.md           (45 min)
   ↓
2. Follow test cases
   ↓
3. Fill test results template
```

### Scenario 4: "Tôi cần deploy production"
```
1. IMPLEMENTATION_SUMMARY.md  (20 min)
   ↓
2. AZURE_SPEECH_SETUP.md (setup production keys)
   ↓
3. TESTING_GUIDE.md (final QA)
   ↓
4. Deploy checklist
```

### Scenario 5: "Tôi là user, muốn học cách dùng"
```
1. PRONUNCIATION_GUIDE.md     (10 min)
   ↓
2. Practice with flashcards
   ↓
3. Check troubleshooting if needed
```

---

## 📂 File Structure Overview

```
FrontEnd_FIT5120/
│
├── 📄 Documentation Files (đọc theo thứ tự trên)
│   ├── START_HERE.md                    ← 1. Bắt đầu tại đây!
│   ├── QUICK_START_PRONUNCIATION.md     ← 2. Quick reference
│   ├── FLOW_DIAGRAM.md                  ← 3. Technical flow
│   ├── IMPLEMENTATION_SUMMARY.md        ← 4. Complete overview
│   ├── AZURE_SPEECH_SETUP.md            ← 5. Azure setup
│   ├── TESTING_GUIDE.md                 ← 6. QA guide
│   ├── PRONUNCIATION_GUIDE.md           ← 7. User guide
│   └── DOCS_INDEX.md                    ← This file
│
├── 📁 Source Code
│   └── src/
│       ├── composables/
│       │   └── useSpeechRecognition.js  ← Speech logic
│       ├── services/
│       │   └── azureSpeechService.js    ← Azure API
│       └── components/
│           └── Flashcard.vue            ← UI component
│
└── 📁 Configuration
    ├── .env                             ← Azure credentials (gitignored)
    ├── .env.example                     ← Template
    └── package.json                     ← Dependencies
```

---

## 🔍 Quick Links

### Most Common Tasks:

| Task | File | Time |
|------|------|------|
| First time setup | [START_HERE.md](./START_HERE.md) | 5 min |
| Setup Azure | [AZURE_SPEECH_SETUP.md](./AZURE_SPEECH_SETUP.md) | 30 min |
| Code reference | [QUICK_START_PRONUNCIATION.md](./QUICK_START_PRONUNCIATION.md) | 10 min |
| Understand flow | [FLOW_DIAGRAM.md](./FLOW_DIAGRAM.md) | 15 min |
| Full testing | [TESTING_GUIDE.md](./TESTING_GUIDE.md) | 45 min |
| User manual | [PRONUNCIATION_GUIDE.md](./PRONUNCIATION_GUIDE.md) | 10 min |
| Deploy prep | [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | 20 min |

---

## 🆘 Troubleshooting Quick Reference

### "Talk button doesn't work"
→ See: [PRONUNCIATION_GUIDE.md - Troubleshooting](./PRONUNCIATION_GUIDE.md#-x%E1%BB%AD-l%C3%BD-l%E1%BB%97i-th%C6%B0%E1%BB%9Dng-g%E1%BA%B7p)

### "Azure API error"
→ See: [AZURE_SPEECH_SETUP.md - Troubleshooting](./AZURE_SPEECH_SETUP.md#5-troubleshooting)

### "Score always 0"
→ See: [TESTING_GUIDE.md - Common Issues](./TESTING_GUIDE.md#-common-issues-v%C3%A0-gi%E1%BA%A3i-ph%C3%A1p)

### "How to setup Azure?"
→ See: [AZURE_SPEECH_SETUP.md](./AZURE_SPEECH_SETUP.md)

### "Need code examples"
→ See: [QUICK_START_PRONUNCIATION.md - Code Examples](./QUICK_START_PRONUNCIATION.md#-code-examples)

---

## 📊 Documentation Statistics

| Metric | Value |
|--------|-------|
| Total docs | 8 files |
| Total pages | ~50 pages |
| Code examples | 20+ examples |
| Test cases | 7 complete scenarios |
| Setup time | 5-30 minutes |
| Reading time | 2 hours (all docs) |

---

## 🎯 Learning Path

### Level 1: Beginner (30 minutes)
- [ ] Read START_HERE.md
- [ ] Setup project
- [ ] Test với Web Speech API
- [ ] Đọc PRONUNCIATION_GUIDE.md

### Level 2: Intermediate (2 hours)
- [ ] Read QUICK_START_PRONUNCIATION.md
- [ ] Setup Azure Speech Service
- [ ] Read FLOW_DIAGRAM.md
- [ ] Complete basic test cases

### Level 3: Advanced (4 hours)
- [ ] Read IMPLEMENTATION_SUMMARY.md
- [ ] Complete all TESTING_GUIDE.md test cases
- [ ] Review source code
- [ ] Prepare for production deployment

---

## 📝 Changelog

### v1.0 (October 6, 2025)
- ✅ Initial implementation complete
- ✅ All 8 documentation files created
- ✅ Web Speech API support
- ✅ Azure Speech Service integration
- ✅ Full test coverage
- ✅ Production-ready

---

## 🤝 Contributing

Want to improve this documentation?
1. Fork the repository
2. Make your changes
3. Submit a pull request

---

## 📞 Support

### Documentation Issues:
- Create GitHub issue with label: `documentation`

### Technical Support:
- Check TESTING_GUIDE.md first
- Review TROUBLESHOOTING sections
- Contact team via GitHub

### Azure Support:
- See AZURE_SPEECH_SETUP.md
- Check Azure Portal
- Microsoft Azure support

---

## 📜 License

MIT License - See LICENSE file for details

---

## ✅ Document Checklist

Before using this feature, ensure you have:
- [ ] Read at least START_HERE.md
- [ ] Installed dependencies (`npm install`)
- [ ] Configured .env (for Azure) OR accepting Web Speech API fallback
- [ ] Tested on your local machine
- [ ] Understood the flow (at least basics)

---

**Last Updated**: October 6, 2025
**Version**: 1.0.0
**Maintained By**: FIT5120 Project Team

---

## 🚀 Ready to Start?

### Choose your path:

**Path A: Quick Start (5 min)**
```
→ Go to START_HERE.md now!
```

**Path B: Full Learning (2 hours)**
```
1. START_HERE.md
2. QUICK_START_PRONUNCIATION.md
3. FLOW_DIAGRAM.md
4. IMPLEMENTATION_SUMMARY.md
```

**Path C: Azure Setup (30 min)**
```
1. START_HERE.md
2. AZURE_SPEECH_SETUP.md
```

**Path D: Testing (45 min)**
```
1. START_HERE.md
2. TESTING_GUIDE.md
```

---

**Happy Learning! 🎓**
