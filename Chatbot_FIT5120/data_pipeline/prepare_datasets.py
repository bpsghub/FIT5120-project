"""Utility helpers to download and normalise third-party dialogue datasets.

The script follows a three step process:
1. Download / locate the raw corpora under ``datasets/raw/<topic>``.
2. Convert them into light-weight question/answer pairs that align with the
   format expected by ``chatbot_api.py`` and ``train_chatbot_model.py``.
3. Persist the merged dataset to ``datasets/processed/qa_pairs.json`` while also
   emitting topic specific JSON files for manual inspection.

Datasets supported out of the box (the user can add more by extending the
``DATASETS`` map):
- General chit-chat: https://github.com/FareedKhan-dev/AI-Chatbot-Conversation-Dataset
- Hobbies & topical conversations: https://github.com/alexa/Topical-Chat
- Travel & weather (goal-driven dialogues): https://github.com/budzianowski/multiwoz

The script intentionally avoids shipping raw data to keep the repository light.
Instead, it offers helper functions that download the sources the first time it
is executed. Users who prefer an offline workflow can manually place the files
under the ``datasets/raw`` folder and skip the download step.
"""
from __future__ import annotations

import json
import math
import os
import random
import re
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Tuple

import requests

try:
    from datasets import load_dataset
except Exception:  # pragma: no cover - handled gracefully in runtime
    load_dataset = None  # type: ignore

BASE_DIR = Path(__file__).resolve().parents[1]
RAW_DIR = BASE_DIR / "datasets" / "raw"
PROCESSED_DIR = BASE_DIR / "datasets" / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

QA_OUTPUT_PATH = PROCESSED_DIR / "qa_pairs.json"
TOPIC_OUTPUT_TEMPLATE = PROCESSED_DIR / "{topic}.json"

random.seed(42)

@dataclass
class QAPair:
    question: str
    answer: str
    topic: str
    source: str
    metadata: Optional[Dict[str, str]] = None

    def to_dict(self) -> Dict[str, object]:
        payload: Dict[str, object] = {
            "question": self.question.strip(),
            "answer": self.answer.strip(),
            "topic": self.topic,
            "source": self.source,
        }
        if self.metadata:
            payload["metadata"] = self.metadata
        return payload


def ensure_raw_dir(topic: str) -> Path:
    path = RAW_DIR / topic
    path.mkdir(parents=True, exist_ok=True)
    return path


def download_file(url: str, destination: Path) -> Path:
    response = requests.get(url, timeout=60)
    response.raise_for_status()
    destination.parent.mkdir(parents=True, exist_ok=True)
    with open(destination, "wb") as f:
        f.write(response.content)
    return destination


# ---------------------------------------------------------------------------
# General conversation dataset helpers
# ---------------------------------------------------------------------------

def collect_general_pairs(max_pairs: Optional[int] = None) -> List[QAPair]:
    """Collect general conversation pairs from existing legacy dataset.
    
    Instead of downloading external data, we'll use the existing 
    chatbot_dataset/general files which are already working.
    """
    topic = "general"
    qa_pairs: List[QAPair] = []
    
    # Use existing legacy dataset
    legacy_questions = Path("chatbot_dataset/general/questions.json")
    legacy_answers = Path("chatbot_dataset/general/answers.json")
    
    if legacy_questions.exists() and legacy_answers.exists():
        print(f"[general] Loading from existing legacy dataset...")
        try:
            with open(legacy_questions, "r", encoding="utf-8") as f:
                questions = json.load(f)
            with open(legacy_answers, "r", encoding="utf-8") as f:
                answers = json.load(f)
            
            # Match questions with answers based on "for" field
            answer_map = {}
            for answer_group in answers:
                if "for" in answer_group and "responses" in answer_group:
                    answer_map[answer_group["for"]] = answer_group["responses"]
                elif "for" in answer_group and "cat_responses" in answer_group:
                    answer_map[answer_group["for"]] = answer_group["cat_responses"]
            
            # Create QA pairs from questions
            for question_text in questions:
                if question_text in answer_map:
                    for response in answer_map[question_text]:
                        qa_pairs.append(
                            QAPair(
                                question=question_text,
                                answer=response,
                                topic=topic,
                                source="legacy-dataset"
                            )
                        )
                        if max_pairs and len(qa_pairs) >= max_pairs:
                            break
                if max_pairs and len(qa_pairs) >= max_pairs:
                    break
                    break
                    
        except Exception as e:
            print(f"[general] Error loading legacy dataset: {e}")
    
    # Load additional general conversation data
    additional_general = Path("additional_general_answers.json")
    if additional_general.exists():
        print(f"[general] Loading additional conversation data...")
        try:
            with open(additional_general, "r", encoding="utf-8") as f:
                additional_data = json.load(f)
            
            for item in additional_data:
                question = item["for"]
                responses = item["responses"]
                for response in responses:
                    qa_pairs.append(
                        QAPair(
                            question=question,
                            answer=response,
                            topic=topic,
                            source="additional-data"
                        )
                    )
                    if max_pairs and len(qa_pairs) >= max_pairs:
                        break
                if max_pairs and len(qa_pairs) >= max_pairs:
                    break
        except Exception as e:
            print(f"[general] Error loading additional data: {e}")
    
    # Add some basic fallback pairs if we don't have enough
    if len(qa_pairs) < 10:
        print(f"[general] Adding basic conversation pairs...")
        basic_pairs = [
            QAPair("Hello", "Hi there! How are you doing today?", topic, "fallback"),
            QAPair("How are you?", "I'm doing great, thank you for asking!", topic, "fallback"),
            QAPair("What's your name?", "I'm a friendly chatbot cat! Meow!", topic, "fallback"),
            QAPair("Nice to meet you", "Nice to meet you too! I'm excited to chat.", topic, "fallback"),
            QAPair("Goodbye", "Goodbye! Have a wonderful day!", topic, "fallback"),
            QAPair("Thank you", "You're very welcome! Happy to help.", topic, "fallback"),
            QAPair("Help", "I'm here to help! What do you need assistance with?", topic, "fallback"),
            QAPair("Tell me a joke", "Why don't cats play poker? Because they're afraid of cheetahs!", topic, "fallback"),
        ]
        qa_pairs.extend(basic_pairs)
    
    print(f"[general] Collected {len(qa_pairs)} conversation pairs")
    return qa_pairs[:max_pairs] if max_pairs else qa_pairs


# ---------------------------------------------------------------------------
# Topical-Chat helpers (Hobbies / interests)
# ---------------------------------------------------------------------------


def _iter_topical_dialogues(split: str) -> Iterable[Tuple[List[str], List[str], Dict[str, str]]]:
    if load_dataset is None:
        raise RuntimeError(
            "datasets package is required. Install it with 'pip install datasets'."
        )
    dataset = load_dataset("topical_chat", split=split)
    for sample in dataset:
        dialogue = sample["dialogue"]
        user_turns: List[str] = []
        bot_turns: List[str] = []
        for turn in dialogue:
            if turn["speaker"] == "user":
                user_turns.append(turn["utterance"])
            else:
                bot_turns.append(turn["utterance"])
        yield user_turns, bot_turns, {
            "topic": sample.get("topic", ""),
            "facet": sample.get("facet", ""),
        }


def collect_hobbies_pairs(max_pairs: Optional[int] = None) -> List[QAPair]:
    """Collect hobbies conversation pairs from existing legacy dataset."""
    topic = "hobbies"
    qa_pairs: List[QAPair] = []
    
    # Use existing legacy dataset
    legacy_questions = Path("chatbot_dataset/hobbies/questions.json")
    legacy_answers = Path("chatbot_dataset/hobbies/answers.json")
    
    if legacy_questions.exists() and legacy_answers.exists():
        print(f"[hobbies] Loading from existing legacy dataset...")
        try:
            with open(legacy_questions, "r", encoding="utf-8") as f:
                questions_data = json.load(f)
            with open(legacy_answers, "r", encoding="utf-8") as f:
                answers_data = json.load(f)
            
            # Build answer map
            answer_map = {}
            for answer_group in answers_data:
                if "for" in answer_group and "responses" in answer_group:
                    answer_map[answer_group["for"]] = answer_group["responses"]
                elif "for" in answer_group and "cat_responses" in answer_group:
                    answer_map[answer_group["for"]] = answer_group["cat_responses"]
            
            # Process questions
            for question_item in questions_data:
                if isinstance(question_item, dict):
                    main_question = question_item.get("text", "")
                    if main_question in answer_map:
                        for response in answer_map[main_question]:
                            qa_pairs.append(
                                QAPair(main_question, response, topic, "legacy-dataset")
                            )
                    
                    # Add variations
                    for variation in question_item.get("variations", []):
                        if main_question in answer_map:
                            for response in answer_map[main_question]:
                                qa_pairs.append(
                                    QAPair(variation, response, topic, "legacy-dataset")
                                )
                                if max_pairs and len(qa_pairs) >= max_pairs:
                                    break
                        if max_pairs and len(qa_pairs) >= max_pairs:
                            break
                    if max_pairs and len(qa_pairs) >= max_pairs:
                        break
                        
        except Exception as e:
            print(f"[hobbies] Error loading legacy dataset: {e}")
    
    # Load additional hobbies conversation data
    additional_hobbies = Path("additional_hobbies_answers.json")
    if additional_hobbies.exists():
        print(f"[hobbies] Loading additional conversation data...")
        try:
            with open(additional_hobbies, "r", encoding="utf-8") as f:
                additional_data = json.load(f)
            
            for item in additional_data:
                question = item["for"]
                responses = item["responses"]
                for response in responses:
                    qa_pairs.append(
                        QAPair(
                            question=question,
                            answer=response,
                            topic=topic,
                            source="additional-data"
                        )
                    )
                    if max_pairs and len(qa_pairs) >= max_pairs:
                        break
                if max_pairs and len(qa_pairs) >= max_pairs:
                    break
        except Exception as e:
            print(f"[hobbies] Error loading additional data: {e}")
    
    print(f"[hobbies] Collected {len(qa_pairs)} pairs")
    return qa_pairs[:max_pairs] if max_pairs else qa_pairs


def collect_travel_pairs(max_pairs: Optional[int] = None) -> List[QAPair]:
    """Collect travel conversation pairs from existing legacy dataset."""
    topic = "travelling"
    qa_pairs: List[QAPair] = []
    
    # Use existing legacy dataset
    legacy_questions = Path("chatbot_dataset/travelling/questions.json")
    legacy_answers = Path("chatbot_dataset/travelling/answers.json")
    
    if legacy_questions.exists() and legacy_answers.exists():
        print(f"[travel] Loading from existing legacy dataset...")
        try:
            with open(legacy_questions, "r", encoding="utf-8") as f:
                questions_data = json.load(f)
            with open(legacy_answers, "r", encoding="utf-8") as f:
                answers_data = json.load(f)
            
            # Build answer map
            answer_map = {}
            for answer_group in answers_data:
                if "for" in answer_group and "responses" in answer_group:
                    answer_map[answer_group["for"]] = answer_group["responses"]
                elif "for" in answer_group and "cat_responses" in answer_group:
                    answer_map[answer_group["for"]] = answer_group["cat_responses"]
            
            # Process questions
            for question_item in questions_data:
                if isinstance(question_item, dict):
                    main_question = question_item.get("text", "")
                    if main_question in answer_map:
                        for response in answer_map[main_question]:
                            qa_pairs.append(
                                QAPair(main_question, response, topic, "legacy-dataset")
                            )
                    
                    # Add variations
                    for variation in question_item.get("variations", []):
                        if main_question in answer_map:
                            for response in answer_map[main_question]:
                                qa_pairs.append(
                                    QAPair(variation, response, topic, "legacy-dataset")
                                )
                                if max_pairs and len(qa_pairs) >= max_pairs:
                                    break
                        if max_pairs and len(qa_pairs) >= max_pairs:
                            break
                    if max_pairs and len(qa_pairs) >= max_pairs:
                        break
                        
        except Exception as e:
            print(f"[travel] Error loading legacy dataset: {e}")
    
    print(f"[travel] Collected {len(qa_pairs)} pairs")
    return qa_pairs[:max_pairs] if max_pairs else qa_pairs


def collect_weather_pairs(max_pairs: Optional[int] = None) -> List[QAPair]:
    """Collect weather conversation pairs from existing legacy dataset."""
    topic = "weather"
    qa_pairs: List[QAPair] = []
    
    # Use existing legacy dataset
    legacy_questions = Path("chatbot_dataset/weather/questions.json")
    legacy_answers = Path("chatbot_dataset/weather/answers.json")
    
    if legacy_questions.exists() and legacy_answers.exists():
        print(f"[weather] Loading from existing legacy dataset...")
        try:
            with open(legacy_questions, "r", encoding="utf-8") as f:
                questions_data = json.load(f)
            with open(legacy_answers, "r", encoding="utf-8") as f:
                answers_data = json.load(f)
            
            # Build answer map
            answer_map = {}
            for answer_group in answers_data:
                if "for" in answer_group and "responses" in answer_group:
                    answer_map[answer_group["for"]] = answer_group["responses"]
                elif "for" in answer_group and "cat_responses" in answer_group:
                    answer_map[answer_group["for"]] = answer_group["cat_responses"]
            
            # Process questions
            for question_item in questions_data:
                if isinstance(question_item, dict):
                    main_question = question_item.get("text", "")
                    if main_question in answer_map:
                        for response in answer_map[main_question]:
                            qa_pairs.append(
                                QAPair(main_question, response, topic, "legacy-dataset")
                            )
                    
                    # Add variations
                    for variation in question_item.get("variations", []):
                        if main_question in answer_map:
                            for response in answer_map[main_question]:
                                qa_pairs.append(
                                    QAPair(variation, response, topic, "legacy-dataset")
                                )
                                if max_pairs and len(qa_pairs) >= max_pairs:
                                    break
                        if max_pairs and len(qa_pairs) >= max_pairs:
                            break
                    if max_pairs and len(qa_pairs) >= max_pairs:
                        break
                        
        except Exception as e:
            print(f"[weather] Error loading legacy dataset: {e}")
    
    # Load additional weather conversation data
    additional_weather = Path("additional_weather_answers.json")
    if additional_weather.exists():
        print(f"[weather] Loading additional conversation data...")
        try:
            with open(additional_weather, "r", encoding="utf-8") as f:
                additional_data = json.load(f)
            
            for item in additional_data:
                question = item["for"]
                responses = item["responses"]
                for response in responses:
                    qa_pairs.append(
                        QAPair(
                            question=question,
                            answer=response,
                            topic=topic,
                            source="additional-data"
                        )
                    )
                    if max_pairs and len(qa_pairs) >= max_pairs:
                        break
                if max_pairs and len(qa_pairs) >= max_pairs:
                    break
        except Exception as e:
            print(f"[weather] Error loading additional data: {e}")
    
    print(f"[weather] Collected {len(qa_pairs)} pairs")
    return qa_pairs[:max_pairs] if max_pairs else qa_pairs


# ---------------------------------------------------------------------------
# MultiWOZ helpers (Travel + Weather-ish via keyword matching)
# ---------------------------------------------------------------------------


def _iter_multiwoz_dialogues() -> Iterable[Dict[str, object]]:
    if load_dataset is not None:
        dataset = load_dataset("multi_woz_v22", split="train")
        for sample in dataset:
            yield sample
        return

    # Offline fallback: expect a data.json file under raw/travel or raw/weather
    data_json = None
    for topic in ("travel", "weather"):
        candidate = ensure_raw_dir(topic) / "data.json"
        if candidate.exists():
            data_json = candidate
            break
    if not data_json:
        raise RuntimeError(
            "MultiWOZ data.json not found. Download the repository and place "
            "data.json under datasets/raw/travel."
        )
    with open(data_json, "r", encoding="utf-8") as f:
        raw = json.load(f)
    # File contains a dict keyed by dialogue ID
    for dialogue in raw.values():
        yield dialogue


WEATHER_KEYWORDS = tuple(
    kw.lower()
    for kw in [
        "weather",
        "temperature",
        "rain",
        "snow",
        "sunny",
        "forecast",
        "climate",
        "wind",
    ]
)

TRAVEL_DOMAINS = {"train", "taxi", "hotel", "attraction", "restaurant", "flight"}


def collect_multiwoz_pairs() -> Tuple[List[QAPair], List[QAPair]]:
    travel_pairs: List[QAPair] = []
    weather_pairs: List[QAPair] = []

    for dialogue in _iter_multiwoz_dialogues():
        log = dialogue["log"]  # type: ignore[index]
        meta_domains: Sequence[str] = dialogue.get("domains", [])  # type: ignore[assignment]
        last_user: Optional[str] = None
        for turn in log:
            # Some variants expose ``metadata`` entries instead of plain text
            if "text" not in turn:
                continue
            text = turn["text"].strip()
            if not text:
                continue
            if turn.get("speaker", "user").lower() in {"user", "customer"}:
                last_user = text
                continue

            if last_user is None:
                continue

            lower_user = last_user.lower()
            lower_text = text.lower()
            metadata = {
                "domains": ",".join(meta_domains) if meta_domains else "",
                "dialogue_id": dialogue.get("dialogue_id", ""),
            }
            metadata = {k: v for k, v in metadata.items() if v}

            if meta_domains and TRAVEL_DOMAINS.intersection(set(md.lower() for md in meta_domains)):
                travel_pairs.append(
                    QAPair(
                        question=last_user,
                        answer=text,
                        topic="travel",
                        source="MultiWOZ",
                        metadata=metadata,
                    )
                )
            if any(keyword in lower_user or keyword in lower_text for keyword in WEATHER_KEYWORDS):
                weather_pairs.append(
                    QAPair(
                        question=last_user,
                        answer=text,
                        topic="weather",
                        source="MultiWOZ",
                        metadata=metadata,
                    )
                )
            last_user = None

    print(f"[multiwoz] collected {len(travel_pairs)} travel pairs and {len(weather_pairs)} weather pairs")
    return travel_pairs, weather_pairs


# ---------------------------------------------------------------------------
# Export helpers
# ---------------------------------------------------------------------------


def deduplicate(pairs: List[QAPair]) -> List[QAPair]:
    seen: set[Tuple[str, str, str]] = set()
    unique_pairs: List[QAPair] = []
    for pair in pairs:
        key = (pair.question.lower().strip(), pair.answer.lower().strip(), pair.topic)
        if key in seen:
            continue
        seen.add(key)
        unique_pairs.append(pair)
    return unique_pairs


def save_topic_file(topic: str, pairs: Sequence[QAPair]) -> None:
    output_path = TOPIC_OUTPUT_TEMPLATE.with_name(f"{topic}.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump([pair.to_dict() for pair in pairs], f, ensure_ascii=False, indent=2)
    print(f"[export] wrote {len(pairs)} items to {output_path.relative_to(BASE_DIR)}")


def main(max_pairs: Optional[int] = None) -> None:
    """Main function to collect and process all conversation datasets."""
    general_pairs = collect_general_pairs(max_pairs=max_pairs)
    hobbies_pairs = collect_hobbies_pairs(max_pairs=max_pairs)
    travel_pairs = collect_travel_pairs(max_pairs=max_pairs)
    weather_pairs = collect_weather_pairs(max_pairs=max_pairs)

    all_pairs = deduplicate(general_pairs + hobbies_pairs + travel_pairs + weather_pairs)

    # Persist per-topic files for manual review
    for topic, pairs in (
        ("general", general_pairs),
        ("hobbies", hobbies_pairs),
        ("travel", travel_pairs),
        ("weather", weather_pairs),
    ):
        save_topic_file(topic, deduplicate(pairs))

    with open(QA_OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump([pair.to_dict() for pair in all_pairs], f, ensure_ascii=False, indent=2)
    print(f"[export] wrote consolidated dataset with {len(all_pairs)} pairs to {QA_OUTPUT_PATH.relative_to(BASE_DIR)}")
    print(f"[export] Total topics processed: {len(set(pair.topic for pair in all_pairs))}")
    print(f"[export] Files available in: {PROCESSED_DIR.relative_to(BASE_DIR)}")


if __name__ == "__main__":  # pragma: no cover
    main()
