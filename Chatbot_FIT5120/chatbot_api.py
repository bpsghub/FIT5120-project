# chatbot_api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import nltk
import numpy as np
from nltk.stem import WordNetLemmatizer
from sklearn.metrics.pairwise import cosine_similarity
import random
import os
import pickle
import pandas as pd
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
CORS(app, origins="*", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
     allow_headers=["Content-Type", "Authorization"])  # Enable CORS for Vue frontend

# Download necessary NLTK resources
nltk.download('punkt', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('stopwords', quiet=True)

# Initialize lemmatizer and stopwords
lemmatizer = WordNetLemmatizer()
stop_words = set(nltk.corpus.stopwords.words('english'))

def load_processed_dataset() -> pd.DataFrame:
    processed_path = os.path.join("datasets", "processed", "qa_pairs.json")
    if os.path.exists(processed_path):
        with open(processed_path, "r", encoding="utf-8") as f:
            raw_pairs = json.load(f)
        return pd.DataFrame(raw_pairs)
    return pd.DataFrame()


def load_dataset():
    """Load dataset either from the processed corpus or legacy JSON files."""
    processed_df = load_processed_dataset()
    answers_data = {"cat": []}

    if not processed_df.empty:
        for row in processed_df.itertuples(index=False):
            answers_data.setdefault("cat", []).append({
                "for": row.question,
                "text": row.answer,
                "topic": getattr(row, "topic", "general")
            })
        processed_df.rename(columns={"question": "text"}, inplace=True)
        processed_df["main_question"] = processed_df["text"]
        return processed_df, answers_data

    questions_data = []
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
                            questions_data.append({"text": q, "topic": topic})
                    else:
                        for q in topic_questions:
                            if "text" in q:
                                main_question = q["text"]
                                questions_data.append({"text": main_question, "topic": topic})
                                if "variations" in q:
                                    for variation in q["variations"]:
                                        questions_data.append({
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
                                answers_data["cat"].append({
                                    "for": a["for"],
                                    "text": resp,
                                    "topic": topic
                                })
                        elif "for" in a and "cat_responses" in a:
                            for cat_resp in a["cat_responses"]:
                                answers_data["cat"].append({
                                    "for": a["for"],
                                    "text": cat_resp,
                                    "topic": topic
                                })
                except json.JSONDecodeError as e:
                    print(f"Error loading {answers_file}: {e}")
        else:
            print(f"Warning: {answers_file} not found")

    print(f"Loaded {len(questions_data)} questions and {len(answers_data['cat'])} cat responses")
    df = pd.DataFrame(questions_data)
    df["main_question"] = df.get("main_question", df.get("text"))
    return df, answers_data

# Preprocess text
def preprocess_text(text):
    """Preprocess text by tokenizing, lemmatizing and removing stopwords"""
    tokens = nltk.word_tokenize(text.lower())
    tokens = [lemmatizer.lemmatize(token) for token in tokens if token.isalpha()]
    tokens = [token for token in tokens if token not in stop_words]
    return " ".join(tokens)

# Load and preprocess dataset
print("Loading dataset...")
questions_data, answers_data = load_dataset()

# Load emotions data
emotions_data = {}
emotions_file = "chatbot_dataset/general/emotions.json"
if os.path.exists(emotions_file):
    with open(emotions_file, "r", encoding="utf-8") as f:
        try:
            emotions_data = json.load(f)
            print(f"Loaded emotions data with {len(emotions_data)} categories")
        except json.JSONDecodeError as e:
            print(f"Error loading emotions: {e}")
else:
    print(f"Warning: {emotions_file} not found")

if isinstance(questions_data, pd.DataFrame):
    questions_df = questions_data.copy()
else:
    questions_df = pd.DataFrame(questions_data)

if "text" not in questions_df.columns:
    raise RuntimeError("Questions dataset must include a 'text' column")

if "topic" not in questions_df.columns:
    questions_df["topic"] = "general"

questions_df["processed_text"] = questions_df["text"].apply(preprocess_text)
main_questions = questions_df.get("main_question", questions_df["text"]).tolist()
topics = questions_df["topic"].tolist()

print(
    f"Prepared {len(questions_df)} questions across {questions_df['topic'].nunique()} topics"
)

print("Initializing embedding-based retrieval system...")

MODEL_PATH = os.path.join(os.path.dirname(__file__), "chatbot_model.pkl")
embedding_model = None
question_embeddings = None
EMBEDDING_MODEL_NAME = os.getenv("CHATBOT_EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

if os.path.exists(MODEL_PATH):
    try:
        with open(MODEL_PATH, "rb") as f:
            saved_model = pickle.load(f)
        saved_name = saved_model.get("embedding_model_name", EMBEDDING_MODEL_NAME)
        embedding_model = SentenceTransformer(saved_name)
        question_embeddings = np.array(saved_model.get("question_embeddings", []))
        saved_questions_df = pd.DataFrame(saved_model.get("questions_df", questions_df))
        if not saved_questions_df.empty:
            questions_df = saved_questions_df
            if "processed_text" not in questions_df.columns:
                questions_df["processed_text"] = questions_df["text"].apply(preprocess_text)
            main_questions = questions_df.get("main_question", questions_df["text"]).tolist()
            topics = questions_df["topic"].tolist()
        if "answers" in saved_model:
            answers_data = saved_model["answers"]
        print(
            f"Loaded embeddings from chatbot_model.pkl using '{saved_name}'"
        )
    except Exception as exc:
        print(f"Warning: failed to load chatbot_model.pkl ({exc}). Rebuilding embeddings.")

if embedding_model is None:
    print(f"Loading SentenceTransformer model '{EMBEDDING_MODEL_NAME}'...")
    embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)

if question_embeddings is None or len(question_embeddings) != len(questions_df):
    print("Encoding question bank to embeddings...")
    question_embeddings = embedding_model.encode(
        questions_df["processed_text"].tolist(),
        convert_to_numpy=True,
        show_progress_bar=False,
        normalize_embeddings=True,
    )

# Function to add emotional touches to responses
def add_emotion_to_response(response_text, topic, confidence):
    """Add emotional expressions to make responses more human-like"""
    if not emotions_data:
        return response_text
    
    # Add different emotions based on context and confidence
    enhanced_response = response_text
    
    # High confidence - add excitement or positive reactions
    if confidence > 0.7:
        if random.random() < 0.4:  # 40% chance to add emotion
            if topic == "general":
                emotion_type = random.choice(["casual_greetings", "happiness", "positive_reactions"])
            else:
                emotion_type = random.choice(["excitement", "positive_reactions", "interest"])
            
            if emotion_type in emotions_data:
                emotion = random.choice(emotions_data[emotion_type])
                # Add at the beginning or end randomly
                if random.random() < 0.5:
                    enhanced_response = f"{emotion} {response_text}"
                else:
                    enhanced_response = f"{response_text} {emotion}"
    
    # Medium confidence - add thinking/casual expressions
    elif confidence > 0.4:
        if random.random() < 0.3:  # 30% chance to add emotion
            emotion_type = random.choice(["thinking", "casual_fillers"])
            if emotion_type in emotions_data:
                emotion = random.choice(emotions_data[emotion_type])
                enhanced_response = f"{emotion} {response_text}"
    
    # Add understanding/agreement expressions for questions
    if "?" in response_text and random.random() < 0.25:
        if "understanding" in emotions_data:
            emotion = random.choice(emotions_data["understanding"])
            enhanced_response = f"{emotion} {enhanced_response}"
    
    return enhanced_response

# Function to find best matching response
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
    best_match_question = main_questions[best_match_idx]
    best_match_topic = topics[best_match_idx]

    if preferred_topic:
        for i, idx in enumerate(top_indices):
            if topics[idx] == preferred_topic and top_scores[i] > 0.2:
                best_match_idx = idx
                best_match_score = top_scores[i]
                best_match_question = main_questions[best_match_idx]
                best_match_topic = preferred_topic
                break

    if best_match_score < 0.25:
        fallback_responses = [
            "I'm not sure I understand. Could you rephrase that?",
            "Meow? I don't quite get what you mean. Can you say it differently?",
            "I'm still learning English! Could you ask that in a simpler way?"
        ]
        return {
            "text": random.choice(fallback_responses),
            "topic": "general",
            "confidence": float(best_match_score)
        }
    
    # Find response for the matched question
    character_answers = answers_data.get(character, answers_data.get("cat", []))

    possible_responses = [
        r for r in character_answers
        if r["for"] == best_match_question and r.get("topic", best_match_topic) == best_match_topic
    ]
    
    if possible_responses:
        # Choose a random response from matching ones
        response = random.choice(possible_responses)
        response_text = add_emotion_to_response(response["text"], best_match_topic, best_match_score)
        return {
            "text": response_text,
            "topic": best_match_topic,
            "confidence": float(best_match_score)
        }
    topic_responses = [r for r in character_answers if r.get("topic", best_match_topic) == best_match_topic]
    if topic_responses:
        response = random.choice(topic_responses)
        response_text = add_emotion_to_response(response["text"], best_match_topic, best_match_score * 0.8)
        return {
            "text": response_text,
            "topic": best_match_topic,
            "confidence": float(best_match_score * 0.8)
        }

    return {
        "text": "I'm not sure how to respond to that, but I'd love to learn more!",
        "topic": "general",
        "confidence": float(best_match_score * 0.5)
    }

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        user_message = data.get('message', '')
        if not user_message.strip():
            return jsonify({'error': 'Empty message'}), 400
            
        character = data.get('character', 'cat')  # Default to cat
        preferred_topic = data.get('topic')  # Optional preferred topic
        
        # Process input
        response = get_best_response(user_message, character, preferred_topic)
        
        return jsonify({
            'response': response['text'],
            'topic': response['topic'],
            'confidence': float(response['confidence'])
        })
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'Chatbot API is running',
        'topics': list(set(topics)),
        'questions_count': len(questions_df),
        'answers_count': len(answers_data['cat'])
    })

@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'status': 'Chatbot API is running',
        'endpoints': {
            'chat': '/api/chat',
            'health': '/api/health'
        }
    })

if __name__ == '__main__':
    debug_mode = os.getenv("CHATBOT_DEBUG", "true").lower() in {"1", "true", "yes", "on"}
    port = int(os.getenv("CHATBOT_PORT", "5002"))
    reload_mode = os.getenv("CHATBOT_RELOAD", "auto").lower()
    use_reloader = reload_mode not in {"0", "false", "off"} and debug_mode

    print(
        "Starting Chatbot API server...\n"
        f"  - debug={'on' if debug_mode else 'off'}\n"
        f"  - port={port}\n"
        f"  - reloader={'enabled' if use_reloader else 'disabled'}"
    )
    app.run(debug=debug_mode, host='0.0.0.0', port=port, use_reloader=use_reloader)
