#!/usr/bin/env python3
"""
Test script to check if the chatbot API is working
"""
import requests
import json

def test_api():
    base_url = "http://localhost:5002"
    
    print("Testing Chatbot API...")
    print("=" * 50)
    
    # Test 1: Health check
    try:
        print("1. Testing health endpoint...")
        response = requests.get(f"{base_url}/api/health")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print(f"   Response: {response.json()}")
            print("   ✅ Health check passed!")
        else:
            print("   ❌ Health check failed!")
            return
    except Exception as e:
        print(f"   ❌ Health check failed: {e}")
        return
    
    # Test 2: Root endpoint
    try:
        print("\n2. Testing root endpoint...")
        response = requests.get(f"{base_url}/")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print(f"   Response: {response.json()}")
            print("   ✅ Root endpoint passed!")
        else:
            print("   ❌ Root endpoint failed!")
    except Exception as e:
        print(f"   ❌ Root endpoint failed: {e}")
    
    # Test 3: Chat endpoint
    try:
        print("\n3. Testing chat endpoint...")
        test_message = {
            "message": "Hello, how are you?",
            "character": "cat",
            "topic": "general"
        }
        
        response = requests.post(
            f"{base_url}/api/chat",
            headers={"Content-Type": "application/json"},
            data=json.dumps(test_message)
        )
        
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: {data.get('response', 'No response')}")
            print(f"   Topic: {data.get('topic', 'No topic')}")
            print(f"   Confidence: {data.get('confidence', 'No confidence')}")
            print("   ✅ Chat endpoint passed!")
        else:
            print(f"   Response: {response.text}")
            print("   ❌ Chat endpoint failed!")
    except Exception as e:
        print(f"   ❌ Chat endpoint failed: {e}")
    
    print("\n" + "=" * 50)
    print("API Test Complete!")

if __name__ == "__main__":
    test_api()