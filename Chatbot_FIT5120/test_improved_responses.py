#!/usr/bin/env python3
"""
Quick test to demonstrate the improved chatbot responses with embedding-based retrieval.
Run this after starting the chatbot API with the new embedding system.
"""

import requests
import json
import time

API_URL = "http://localhost:5002/api/chat"

def test_chatbot(message, character="cat", topic=None):
    """Send a message to the chatbot and return the response."""
    payload = {"message": message, "character": character}
    if topic:
        payload["topic"] = topic
    
    try:
        response = requests.post(API_URL, json=payload, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.ConnectionError:
        return {"error": "Cannot connect to API. Make sure chatbot_api.py is running."}
    except Exception as e:
        return {"error": str(e)}

def main():
    print("Testing Enhanced Chatbot with Embedding-Based Retrieval")
    print("=" * 60)
    
    # Check if API is available
    try:
        health_response = requests.get("http://localhost:5002/api/health", timeout=5)
        if health_response.status_code == 200:
            health_data = health_response.json()
            print(f"API Status: {health_data['status']}")
            print(f"Questions: {health_data['questions_count']}")
            print(f"Answers: {health_data['answers_count']}")
            print(f"Topics: {', '.join(health_data['topics'])}")
            print()
        else:
            print("API health check failed")
            return
    except:
        print("Cannot connect to API. Please start chatbot_api.py first.")
        print("   Run: python3 chatbot_api.py")
        return
    
    # Test queries across different topics
    test_cases = [
        ("Hello", "general conversation"),
        ("How are you today?", "general conversation"),
        ("I love playing soccer", "hobbies"),
        ("What sports do you enjoy?", "hobbies"),
        ("Is it going to rain today?", "weather"),
        ("What's the weather like?", "weather"),
        ("Thank you for your help", "politeness"),
        ("Tell me about yourself", "general conversation"),
    ]
    
    print("Testing Various Conversation Topics:")
    print("-" * 60)
    
    for i, (message, description) in enumerate(test_cases, 1):
        print(f"{i}. {description.title()}")
        print(f"   User: {message}")
        
        result = test_chatbot(message)
        
        if "error" in result:
            print(f"   Error: {result['error']}")
        else:
            print(f"   Bot: {result['response']}")
            print(f"   Confidence: {result['confidence']:.2f}")
            print(f"   Topic: {result['topic']}")
        
        print()
        time.sleep(0.5)  # Be nice to the API
    
    print("Test Summary:")
    print("- Embedding-based retrieval provides more contextually relevant responses")
    print("- Topic classification helps route questions to appropriate answer sets")
    print("- Emotion system adds personality to make responses feel more natural")
    print("- Confidence scores help identify when fallback responses are used")

if __name__ == "__main__":
    main()