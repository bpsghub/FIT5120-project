# train_chatbot_model.py
import json
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import pickle
import nltk
import os
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from typing import Optional

# Download NLTK resources
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('stopwords')

# Initialize lemmatizer and stopwords
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def load_processed_dataset() -> Optional[pd.DataFrame]:
    processed_path = os.path.join("datasets", "processed", "qa_pairs.json")
    if os.path.exists(processed_path):
        with open(processed_path, "r", encoding="utf-8") as f:
            raw_pairs = json.load(f)
        df = pd.DataFrame(raw_pairs)
        df.rename(columns={"question": "text"}, inplace=True)
        return df
    return None


def load_dataset():
    """Load and prepare dataset from either processed corpora or legacy files."""
    processed_df = load_processed_dataset()
    if processed_df is not None and not processed_df.empty:
        print("Loaded processed dataset from datasets/processed/qa_pairs.json")
        answers = {"cat": []}
        for row in processed_df.itertuples(index=False):
            answers["cat"].append({
                "for": row.text,
                "text": row.answer,
                "topic": getattr(row, "topic", "general")
            })
        processed_df["main_question"] = processed_df["text"]
        return processed_df, answers

    # Legacy fallback for manual JSON files
    questions = []
    answers = {"cat": [], "robot": []}
    topics = ["general", "hobbies", "travelling", "weather"]

    for topic in topics:
        questions_file = f"chatbot_dataset/{topic}/questions.json"
        answers_file = f"chatbot_dataset/{topic}/answers.json"

        if os.path.exists(questions_file):
            with open(questions_file, "r", encoding="utf-8") as f:
                try:
                    topic_questions = json.load(f)

                    if topic == "general":
                        for q in topic_questions:
                            questions.append({"text": q, "topic": topic})
                    else:
                        for q in topic_questions:
                            if "text" in q:
                                main_question = q["text"]
                                questions.append({"text": main_question, "topic": topic})
                                if "variations" in q:
                                    for variation in q["variations"]:
                                        questions.append({
                                            "text": variation,
                                            "topic": topic,
                                            "main_question": main_question
                                        })
                except json.JSONDecodeError as e:
                    print(f"Error loading {questions_file}: {e}")
        else:
            print(f"Warning: {questions_file} not found")

        if os.path.exists(answers_file):
            with open(answers_file, "r", encoding="utf-8") as f:
                try:
                    topic_answers = json.load(f)
                    for a in topic_answers:
                        if "for" in a and "responses" in a:
                            for resp in a["responses"]:
                                answers["cat"].append({
                                    "for": a["for"],
                                    "text": resp,
                                    "topic": topic
                                })
                        elif "for" in a and "cat_responses" in a:
                            for cat_resp in a["cat_responses"]:
                                answers["cat"].append({
                                    "for": a["for"],
                                    "text": cat_resp,
                                    "topic": topic
                                })
                        if "for" in a and "robot_responses" in a:
                            for robot_resp in a["robot_responses"]:
                                answers.setdefault("robot", []).append({
                                    "for": a["for"],
                                    "text": robot_resp,
                                    "topic": topic
                                })
                except json.JSONDecodeError as e:
                    print(f"Error loading {answers_file}: {e}")
        else:
            print(f"Warning: {answers_file} not found")

    print(f"Loaded {len(questions)} questions and {len(answers['cat'])} cat responses")
    questions_df = pd.DataFrame(questions)
    return questions_df, answers

def preprocess_text(text):
    """Preprocess text by tokenizing, lemmatizing and removing stopwords"""
    tokens = nltk.word_tokenize(text.lower())
    tokens = [lemmatizer.lemmatize(token) for token in tokens if token.isalpha()]
    tokens = [token for token in tokens if token not in stop_words]
    return " ".join(tokens)

print("Loading dataset...")
questions_df, answers = load_dataset()

if not isinstance(questions_df, pd.DataFrame):
    questions_df = pd.DataFrame(questions_df)

if "topic" not in questions_df.columns:
    questions_df["topic"] = "general"

questions_df["processed_text"] = questions_df["text"].apply(preprocess_text)

print("Creating embedding model...")
EMBEDDING_MODEL_NAME = os.getenv("CHATBOT_EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
question_embeddings = embedding_model.encode(
    questions_df["processed_text"].tolist(),
    convert_to_numpy=True,
    show_progress_bar=False,
    normalize_embeddings=True,
)

def get_best_response(input_text, character="cat", preferred_topic=None):
    processed_input = preprocess_text(input_text)
    input_embedding = embedding_model.encode(
        [processed_input], convert_to_numpy=True, normalize_embeddings=True, show_progress_bar=False
    )

    similarity_scores = cosine_similarity(input_embedding, question_embeddings)[0]

    top_indices = np.argsort(similarity_scores)[-5:][::-1]
    top_scores = [similarity_scores[i] for i in top_indices]

    best_match_idx = top_indices[0]
    best_match_score = top_scores[0]
    best_match_question = questions_df.iloc[best_match_idx]["text"]
    best_match_topic = questions_df.iloc[best_match_idx]["topic"]

    if preferred_topic:
        for i, idx in enumerate(top_indices):
            if questions_df.iloc[idx]["topic"] == preferred_topic and top_scores[i] > 0.25:
                best_match_idx = idx
                best_match_score = top_scores[i]
                best_match_question = questions_df.iloc[best_match_idx]["text"]
                best_match_topic = preferred_topic
                break

    if best_match_score < 0.3:
        return {
            "text": "I'm not sure I understand. Could you rephrase that?",
            "topic": "general",
            "confidence": float(best_match_score)
        }

    if "main_question" in questions_df.columns and not pd.isna(questions_df.iloc[best_match_idx]["main_question"]):
        best_match_question = questions_df.iloc[best_match_idx]["main_question"]

    character_answers = answers.get(character, answers.get("cat", []))

    possible_responses = [
        r for r in character_answers
        if r["for"] == best_match_question and r.get("topic", best_match_topic) == best_match_topic
    ]

    if possible_responses:
        response = np.random.choice(possible_responses)
        return {
            "text": response["text"],
            "topic": best_match_topic,
            "confidence": float(best_match_score)
        }

    topic_responses = [r for r in character_answers if r.get("topic", best_match_topic) == best_match_topic]
    if topic_responses:
        response = np.random.choice(topic_responses)
        return {
            "text": response["text"],
            "topic": best_match_topic,
            "confidence": float(best_match_score * 0.8)
        }

    return {
        "text": "I'm not sure how to respond to that.",
        "topic": "general",
        "confidence": float(best_match_score * 0.5)
    }

# Save the trained model components
print("Saving model...")
model_data = {
    "embedding_model_name": EMBEDDING_MODEL_NAME,
    "question_embeddings": question_embeddings,
    "questions_df": questions_df,
    "answers": answers
}

with open("chatbot_model.pkl", "wb") as f:
    pickle.dump(model_data, f)

print("Model training complete and saved to chatbot_model.pkl")

# Test the model with some sample questions
print("\nTesting the model with sample questions:")
test_questions = [
    "What's the weather like?",
    "I like to play soccer",
    "Where should I travel next?",
    "Is it going to rain tomorrow?",
    "What hobbies are good for kids?"
]

for q in test_questions:
    response = get_best_response(q, "cat")
    print(f"Q: {q}")
    print(f"A: {response['text']}")
    print(f"Topic: {response['topic']}, Confidence: {response['confidence']:.2f}\n")
