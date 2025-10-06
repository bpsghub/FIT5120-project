#!/usr/bin/env python3
"""
Test script để demo hệ thống cảm xúc của chatbot
"""

import requests
import json
import time

API_URL = "http://localhost:5002/api/chat"

def test_chatbot(message, character="cat"):
    """Gửi tin nhắn đến chatbot và nhận phản hồi"""
    try:
        response = requests.post(
            API_URL,
            json={"message": message, "character": character},
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            return {"error": f"Status code: {response.status_code}"}
    except Exception as e:
        return {"error": str(e)}

def print_response(message, data):
    """In kết quả một cách đẹp mắt"""
    print(f"\n{'='*60}")
    print(f"User: {message}")
    print(f"{'-'*60}")
    if "error" in data:
        print(f"Error: {data['error']}")
    else:
        print(f"Bot: {data['response']}")
        print(f"Topic: {data['topic']}")
        print(f"Confidence: {data['confidence']:.2f}")
    print(f"{'='*60}")

def main():
    print("🤖 Chatbot Emotion System Test Demo")
    print("\nĐang test các câu hỏi general...\n")
    
    # Test general questions
    general_questions = [
        "Hello",
        "How are you?",
        "What is your name?",
        "Can you help me?",
        "Thank you",
        "I don't understand",
        "Goodbye"
    ]
    
    print("\n📝 Test với các câu hỏi general:")
    for question in general_questions:
        data = test_chatbot(question)
        print_response(question, data)
        time.sleep(0.5)  # Delay một chút để dễ đọc
    
    # Test same question multiple times to see emotion variations
    print("\n\n🔄 Test cùng một câu hỏi nhiều lần để thấy sự đa dạng của cảm xúc:")
    test_question = "Hello"
    for i in range(5):
        data = test_chatbot(test_question)
        print(f"\nLần {i+1}: {data.get('response', 'Error')}")
        time.sleep(0.3)
    
    # Test other topics
    print("\n\n🎨 Test với các chủ đề khác:")
    other_questions = [
        "What are your hobbies?",
        "Do you like to read books?",
        "What's the weather like?"
    ]
    
    for question in other_questions:
        data = test_chatbot(question)
        print_response(question, data)
        time.sleep(0.5)

if __name__ == "__main__":
    print("\n⚠️  Đảm bảo chatbot API đang chạy trên port 5002!")
    print("Chạy: python3 chatbot_api.py\n")
    
    try:
        # Check if API is running
        response = requests.get("http://localhost:5002/api/health")
        if response.status_code == 200:
            print("✅ API đang chạy!\n")
            main()
        else:
            print("❌ API không phản hồi đúng!")
    except:
        print("❌ Không thể kết nối đến API. Hãy chạy chatbot_api.py trước!")
