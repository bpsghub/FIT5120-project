#!/usr/bin/env python3
"""
Alternative enhanced data pipeline using different external datasets
that are more accessible and reliable.
"""

import json
import random
from pathlib import Path
from typing import List, Optional, Dict
from dataclasses import dataclass
import requests

try:
    from datasets import load_dataset
except ImportError:
    print("Installing datasets library...")
    import subprocess
    subprocess.check_call(["pip", "install", "datasets"])
    from datasets import load_dataset

BASE_DIR = Path(__file__).resolve().parent
PROCESSED_DIR = BASE_DIR / "datasets" / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

random.seed(42)

@dataclass
class QAPair:
    question: str
    answer: str
    topic: str
    source: str
    metadata: Optional[Dict[str, str]] = None

    def to_dict(self) -> Dict[str, object]:
        return {
            "question": self.question.strip(),
            "answer": self.answer.strip(),
            "topic": self.topic,
            "source": self.source,
            "metadata": self.metadata or {}
        }

def download_conversational_datasets() -> List[QAPair]:
    """Download alternative conversational datasets."""
    qa_pairs = []
    
    # Try Cornell Movie Dialogs
    print("[external] Trying Cornell Movie Dialogs...")
    try:
        dataset = load_dataset("conv_questions", split="train")
        for i, sample in enumerate(dataset):
            if i >= 300:  # Limit for performance
                break
            question = sample.get("question", "").strip()
            answers = sample.get("answers", [])
            if question and answers and len(question) > 5:
                for answer in answers[:2]:  # Take first 2 answers
                    if len(answer.strip()) > 5:
                        qa_pairs.append(QAPair(
                            question=question,
                            answer=answer.strip(),
                            topic="general",
                            source="external-conv"
                        ))
        print(f"[external] Downloaded {len(qa_pairs)} conversation pairs")
    except Exception as e:
        print(f"[external] Cornell dialogs failed: {e}")
    
    # Try OpenAssistant conversations
    print("[external] Trying OpenAssistant conversations...")
    try:
        dataset = load_dataset("OpenAssistant/oasst1", split="train")
        for i, sample in enumerate(dataset):
            if i >= 200:  # Limit for performance
                break
            if sample.get("role") == "prompter":
                question = sample.get("text", "").strip()
                if question and len(question) > 10 and len(question) < 200:
                    # Create a generic helpful response for variety
                    response = "That's an interesting question! I'd be happy to help you with that. Could you tell me more about what specifically you'd like to know?"
                    qa_pairs.append(QAPair(
                        question=question,
                        answer=response,
                        topic="general",
                        source="external-oasst"
                    ))
        print(f"[external] Added {len([p for p in qa_pairs if p.source == 'external-oasst'])} OpenAssistant pairs")
    except Exception as e:
        print(f"[external] OpenAssistant failed: {e}")
    
    return qa_pairs

def download_manual_enrichment_data() -> List[QAPair]:
    """Add manually curated conversation data for better variety."""
    print("[manual] Adding curated conversation data...")
    
    manual_data = [
        # English learning conversations
        ("I'm learning English", "That's wonderful! English can be challenging, but practice makes perfect. I'm here to help you practice!", "general"),
        ("Can you help me with English?", "Of course! I'd love to help you practice English. What would you like to work on?", "general"),
        ("Is my English good?", "Your English is doing great! The more you practice, the better you'll get. Keep it up!", "general"),
        ("I make mistakes in English", "Don't worry about mistakes! They're part of learning. Every mistake helps you improve.", "general"),
        
        # More casual conversations
        ("What's up?", "Not much! Just here chatting with you. How's your day going?", "general"),
        ("How's it going?", "Going well, thanks for asking! How about you?", "general"),
        ("What are you doing?", "I'm here talking with you! I enjoy our conversations. What about you?", "general"),
        ("Are you busy?", "Never too busy to chat with you! What's on your mind?", "general"),
        
        # Weather variety
        ("What's the weather like?", "I wish I could look outside for you! You might want to check your weather app or look out the window.", "weather"),
        ("Is it going to be nice today?", "I hope so! Nice weather always makes the day better. What kind of weather do you enjoy?", "weather"),
        ("I love summer", "Summer can be wonderful! Warm days, longer daylight, and lots of outdoor activities. What do you like most about summer?", "weather"),
        ("Winter is coming", "Winter has its own charm! Cozy days inside, maybe some hot chocolate. How do you feel about winter?", "weather"),
        
        # Hobby enrichment
        ("What should I do today?", "That depends on what you enjoy! Do you like indoor activities like reading or cooking, or outdoor ones like walking?", "hobbies"),
        ("I'm bored", "Being bored can be a chance to try something new! Maybe read a book, watch a movie, or learn a new skill?", "hobbies"),
        ("I need a new hobby", "That's exciting! There are so many hobbies to explore. Do you prefer creative activities, sports, or learning new things?", "hobbies"),
        ("I love learning new things", "That's a great attitude! Learning keeps life interesting. What kind of things are you curious about?", "hobbies"),
        
        # Cat personality responses
        ("You're funny", "Meow! I try to be entertaining. Cats are naturally amusing, don't you think?", "general"),
        ("Are you really a cat?", "Well, I'm a chatbot cat! I have the curiosity of a cat and love of conversation. Purr!", "general"),
        ("Do you like fish?", "As a cat, I should say yes! But I prefer conversations and helping people practice English.", "general"),
        ("Meow", "Meow meow! I see you speak cat language too! How wonderful!", "general"),
    ]
    
    qa_pairs = []
    for question, answer, topic in manual_data:
        qa_pairs.append(QAPair(question, answer, topic, "manual-enrichment"))
    
    print(f"[manual] Added {len(qa_pairs)} curated conversation pairs")
    return qa_pairs

def load_legacy_data() -> List[QAPair]:
    """Load existing legacy datasets and additional data."""
    print("[legacy] Loading existing datasets...")
    qa_pairs = []
    
    # Load legacy general data
    legacy_general = Path("chatbot_dataset/general/questions.json")
    legacy_answers = Path("chatbot_dataset/general/answers.json")
    
    if legacy_general.exists() and legacy_answers.exists():
        with open(legacy_general) as f:
            questions = json.load(f)
        with open(legacy_answers) as f:
            answers = json.load(f)
        
        answer_map = {}
        for answer_group in answers:
            if "for" in answer_group:
                responses = answer_group.get("responses", answer_group.get("cat_responses", []))
                answer_map[answer_group["for"]] = responses
        
        for question in questions:
            if question in answer_map:
                for response in answer_map[question]:
                    qa_pairs.append(QAPair(question, response, "general", "legacy-general"))
    
    # Load additional data files
    additional_files = [
        ("additional_general_answers.json", "general", "additional-general"),
        ("additional_hobbies_answers.json", "hobbies", "additional-hobbies"),
        ("additional_weather_answers.json", "weather", "additional-weather")
    ]
    
    for filename, topic, source in additional_files:
        filepath = Path(filename)
        if filepath.exists():
            with open(filepath) as f:
                additional_data = json.load(f)
            for item in additional_data:
                question = item["for"]
                for response in item["responses"]:
                    qa_pairs.append(QAPair(question, response, topic, source))
    
    # Load legacy hobbies data  
    legacy_hobbies_q = Path("chatbot_dataset/hobbies/questions.json")
    legacy_hobbies_a = Path("chatbot_dataset/hobbies/answers.json")
    
    if legacy_hobbies_q.exists() and legacy_hobbies_a.exists():
        with open(legacy_hobbies_q) as f:
            hobbies_questions = json.load(f)
        with open(legacy_hobbies_a) as f:
            hobbies_answers = json.load(f)
        
        answer_map = {}
        for answer_group in hobbies_answers:
            if "for" in answer_group:
                responses = answer_group.get("responses", answer_group.get("cat_responses", []))
                answer_map[answer_group["for"]] = responses
        
        for question_item in hobbies_questions:
            if isinstance(question_item, dict):
                main_question = question_item.get("text", "")
                if main_question in answer_map:
                    for response in answer_map[main_question]:
                        qa_pairs.append(QAPair(main_question, response, "hobbies", "legacy-hobbies"))
                
                for variation in question_item.get("variations", []):
                    if main_question in answer_map:
                        for response in answer_map[main_question]:
                            qa_pairs.append(QAPair(variation, response, "hobbies", "legacy-hobbies"))
    
    # Load legacy weather data
    legacy_weather_q = Path("chatbot_dataset/weather/questions.json")
    legacy_weather_a = Path("chatbot_dataset/weather/answers.json")
    
    if legacy_weather_q.exists() and legacy_weather_a.exists():
        with open(legacy_weather_q) as f:
            weather_questions = json.load(f)
        with open(legacy_weather_a) as f:
            weather_answers = json.load(f)
        
        answer_map = {}
        for answer_group in weather_answers:
            if "for" in answer_group:
                responses = answer_group.get("responses", answer_group.get("cat_responses", []))
                answer_map[answer_group["for"]] = responses
        
        for question_item in weather_questions:
            if isinstance(question_item, dict):
                main_question = question_item.get("text", "")
                if main_question in answer_map:
                    for response in answer_map[main_question]:
                        qa_pairs.append(QAPair(main_question, response, "weather", "legacy-weather"))
                
                for variation in question_item.get("variations", []):
                    if main_question in answer_map:
                        for response in answer_map[main_question]:
                            qa_pairs.append(QAPair(variation, response, "weather", "legacy-weather"))
    
    print(f"[legacy] Loaded {len(qa_pairs)} legacy and additional pairs")
    return qa_pairs

def main():
    """Enhanced data pipeline with multiple data sources."""
    print("Enhanced Data Pipeline - Multiple Sources Integration")
    print("=" * 60)
    
    all_pairs = []
    
    # Load legacy + additional data first (proven working)
    legacy_pairs = load_legacy_data()
    all_pairs.extend(legacy_pairs)
    
    # Add manual enrichment data
    manual_pairs = download_manual_enrichment_data()
    all_pairs.extend(manual_pairs)
    
    # Try to download external datasets (graceful failure)
    try:
        external_pairs = download_conversational_datasets()
        all_pairs.extend(external_pairs)
    except Exception as e:
        print(f"[external] External datasets unavailable: {e}")
    
    # Group by topics for analysis
    topics = {}
    for pair in all_pairs:
        if pair.topic not in topics:
            topics[pair.topic] = []
        topics[pair.topic].append(pair)
    
    # Save topic-specific files
    for topic, pairs in topics.items():
        topic_file = PROCESSED_DIR / f"{topic}.json"
        topic_data = [pair.to_dict() for pair in pairs]
        with open(topic_file, "w", encoding="utf-8") as f:
            json.dump(topic_data, f, indent=2, ensure_ascii=False)
        print(f"[export] wrote {len(pairs)} items to {topic_file}")
    
    # Save consolidated dataset
    consolidated_file = PROCESSED_DIR / "qa_pairs.json"
    consolidated_data = [pair.to_dict() for pair in all_pairs]
    with open(consolidated_file, "w", encoding="utf-8") as f:
        json.dump(consolidated_data, f, indent=2, ensure_ascii=False)
    
    print(f"[export] wrote consolidated dataset with {len(all_pairs)} pairs to {consolidated_file}")
    print(f"[export] Total topics processed: {len(topics)}")
    print("=" * 60)
    
    # Summary statistics
    for topic, pairs in topics.items():
        sources = {}
        for pair in pairs:
            source = pair.source
            sources[source] = sources.get(source, 0) + 1
        print(f"STATS {topic.upper()}: {len(pairs)} pairs")
        for source, count in sorted(sources.items()):
            print(f"   - {source}: {count}")
    
    print(f"\nEnhanced dataset generation complete! Total: {len(all_pairs)} pairs")

if __name__ == "__main__":
    main()