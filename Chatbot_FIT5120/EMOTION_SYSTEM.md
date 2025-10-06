# Hệ Thống Cảm Xúc Chatbot

## Tổng Quan

Hệ thống cảm xúc được thiết kế để làm cho chatbot trả lời tự nhiên và giống con người hơn bằng cách thêm các biểu cảm cảm xúc vào câu trả lời.

## Cấu Trúc File

### 1. `chatbot_dataset/general/questions.json`

Chứa các câu hỏi thông dụng hàng ngày như:

- Chào hỏi (Hello, Hi, Good morning...)
- Hỏi thăm (How are you, What's up...)
- Cảm ơn (Thank you, Thanks...)
- Tạm biệt (Goodbye, Bye, See you later...)
- Và nhiều câu hỏi khác

### 2. `chatbot_dataset/general/answers.json`

Chứa các câu trả lời tương ứng với từng câu hỏi trong format:

```json
{
  "for": "Câu hỏi",
  "responses": ["Câu trả lời 1", "Câu trả lời 2", "Câu trả lời 3"]
}
```

### 3. `chatbot_dataset/general/emotions.json`

Chứa các loại cảm xúc được phân thành 12 category:

#### 1. **excitement** (Phấn khích)

- Yay!, Woohoo!, Awesome!, Yes!, Yippee!
- Dùng khi: Độ tin cậy cao (>0.7), đặc biệt với các chủ đề vui vẻ

#### 2. **happiness** (Vui vẻ)

- Hehe!, Hihi!, That's great!
- Dùng khi: Phản ứng tích cực, câu trả lời vui vẻ

#### 3. **agreement** (Đồng ý)

- I think so too!, I reckon that's right!, Absolutely!
- Dùng khi: Đồng ý với người dùng

#### 4. **thinking** (Suy nghĩ)

- Hmm..., Let me think..., I reckon..., I believe...
- Dùng khi: Độ tin cậy trung bình (0.4-0.7), cần suy nghĩ

#### 5. **casual_greetings** (Chào hỏi thân mật)

- Hey there!, What's up!, Yo!, Heya!
- Dùng khi: Chào hỏi, độ tin cậy cao với general topic

#### 6. **understanding** (Hiểu biết)

- Ah, I see!, Oh, got it!, Aha!
- Dùng khi: Câu trả lời có dấu hỏi (25% chance)

#### 7. **surprise** (Ngạc nhiên)

- Wow!, Oh!, Whoa!, Really?, No way!
- Dùng khi: Phản ứng bất ngờ

#### 8. **encouragement** (Động viên)

- You got this!, Keep going!, Great job!
- Dùng khi: Khuyến khích người dùng

#### 9. **sympathy** (Cảm thông)

- Oh no..., I'm sorry to hear that., Aww...
- Dùng khi: Người dùng buồn hoặc gặp khó khăn

#### 10. **interest** (Quan tâm)

- Oh really?, Tell me more!, That's interesting!
- Dùng khi: Thể hiện sự quan tâm

#### 11. **casual_fillers** (Từ lấp chỗ trống)

- You know,, I mean,, Like,, So,, Well,
- Dùng khi: Độ tin cậy trung bình, làm câu nói tự nhiên hơn

#### 12. **positive_reactions** (Phản ứng tích cực)

- That's brilliant!, How nice!, Lovely!, Perfect!
- Dùng khi: Độ tin cậy cao (>0.7)

## Cách Hoạt Động

### Thuật Toán Thêm Cảm Xúc

```python
def add_emotion_to_response(response_text, topic, confidence):
    # Độ tin cậy cao (>0.7)
    if confidence > 0.7:
        if random.random() < 0.4:  # 40% cơ hội thêm cảm xúc
            if topic == "general":
                # Dùng: casual_greetings, happiness, positive_reactions
            else:
                # Dùng: excitement, positive_reactions, interest

    # Độ tin cậy trung bình (0.4-0.7)
    elif confidence > 0.4:
        if random.random() < 0.3:  # 30% cơ hội thêm cảm xúc
            # Dùng: thinking, casual_fillers

    # Câu hỏi (có dấu "?")
    if "?" in response_text and random.random() < 0.25:
        # Dùng: understanding
```

### Vị Trí Thêm Cảm Xúc

Cảm xúc có thể được thêm vào:

- **Đầu câu**: `"Yay! I'm doing great, thank you!"`
- **Cuối câu**: `"I'm doing great, thank you! Woohoo!"`
- **Ngẫu nhiên**: 50/50 cho mỗi vị trí

## Ví Dụ

### Input: "Hello"

**Không có cảm xúc:**

```
"Hi there! How can I help you today?"
```

**Có cảm xúc (confidence 0.85):**

```
"Hey there! Hi there! How can I help you today?"
"Hi there! How can I help you today! Yay!"
"What's up! Hi there! How can I help you today?"
```

### Input: "How are you?"

**Không có cảm xúc:**

```
"I'm doing great, thank you! How about you?"
```

**Có cảm xúc (confidence 0.75):**

```
"Awesome! I'm doing great, thank you! How about you?"
"I'm doing great, thank you! How about you? That's wonderful!"
"Hihi! I'm doing great, thank you! How about you?"
```

### Input: "I don't understand"

**Có cảm xúc (confidence 0.6):**

```
"Hmm... No worries! Let me explain it differently."
"I mean, that's okay! I'll try to make it clearer for you."
"Well, don't worry! I can rephrase that for you."
```

## Lợi Ích

1. **Tự nhiên hơn**: Câu trả lời giống con người thật hơn
2. **Đa dạng**: Mỗi lần trả lời có thể khác nhau
3. **Phù hợp context**: Cảm xúc được chọn dựa trên độ tin cậy và chủ đề
4. **Không quá nhiều**: Chỉ 25-40% câu trả lời có cảm xúc, tránh spam

## Cách Mở Rộng

### Thêm Loại Cảm Xúc Mới

1. Mở file `chatbot_dataset/general/emotions.json`
2. Thêm category mới:

```json
{
  "emotion_type_name": ["expression 1", "expression 2", "expression 3"]
}
```

3. Cập nhật logic trong `add_emotion_to_response()` để sử dụng

### Thêm Câu Hỏi/Trả Lời Mới

1. Thêm câu hỏi vào `general/questions.json`
2. Thêm câu trả lời tương ứng vào `general/answers.json`
3. Restart API

## Testing

Để test hệ thống:

```bash
# Start API
python3 chatbot_api.py

# Test với curl
curl -X POST http://localhost:5002/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "character": "cat"}'
```

Bạn sẽ thấy các câu trả lời có cảm xúc khác nhau mỗi lần gọi API!
