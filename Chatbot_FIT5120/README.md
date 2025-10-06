# Chatbot with Voice Interaction

This chatbot helps users practice English conversation with a playful virtual cat or robot. The current iteration features significant improvements:

## Key Improvements

**Embedding-Based Retrieval**: Replaced TF-IDF with sentence-transformer embeddings for more intelligent semantic matching of user questions to appropriate responses.

**Consolidated Dataset Pipeline**: Created `data_pipeline/prepare_datasets.py` to normalize and consolidate conversation data from existing legacy JSON files into a unified training corpus.

**Enhanced Response Quality**: The chatbot now provides more contextually relevant answers with better topic classification (general, hobbies, weather) and improved confidence scoring.

**Configurable Runtime**: Environment variables for port, debug mode, reloader settings, and embedding model selection make deployment more flexible.

## Features

- A consolidated knowledge base covering general chit-chat, hobbies, travel, and weather
- Sentence-transformer embeddings for semantic search (default: `sentence-transformers/all-MiniLM-L6-v2`)
- Emotion-aware response seasoning so replies feel more natural
- REST API built with Flask for easy integration with the Vue frontend

## Backend quick start

All commands below assume you are inside the `Chatbot_FIT5120` folder.

```bash
cd /path/to/FIT5120-project/Chatbot_FIT5120
python3 -m venv .venv            # optional but recommended
source .venv/bin/activate        # macOS/Linux
pip install -r requirements.txt

# Download and normalize datasets with external sources integration
python3 enhanced_data_pipeline.py

# Build the embedding index and persist chatbot_model.pkl
python3 train_chatbot_model.py

# Start the API (defaults: port 5002, debug on)
python3 chatbot_api.py
```

### Runtime configuration

The API reads a few environment variables at startup:

| Variable                  | Default                                  | Description                                   |
| ------------------------- | ---------------------------------------- | --------------------------------------------- |
| `CHATBOT_PORT`            | `5002`                                   | HTTP port to bind                             |
| `CHATBOT_DEBUG`           | `true`                                   | Enables Flask debug logs and hot reloading    |
| `CHATBOT_RELOAD`          | `auto`                                   | Set to `off` to disable the watchdog reloader |
| `CHATBOT_EMBEDDING_MODEL` | `sentence-transformers/all-MiniLM-L6-v2` | Override the embedding backbone               |

Example (disable the auto reloader once the model is trained):

```bash
CHATBOT_DEBUG=false CHATBOT_RELOAD=off python3 chatbot_api.py
```

The API exposes two endpoints:

- `POST /api/chat` - body: `{ "message": "hi", "character": "cat", "topic": "weather" }`
- `GET /api/health` - returns status, topic coverage, and corpus sizes

## Datasets & training assets

Legacy handcrafted JSON files live under `chatbot_dataset/<topic>/`. The automated pipeline drops additional corpora into `datasets/raw/` and the normalized training pairs into `datasets/processed/qa_pairs.json`. See `datasets/README.md` for details.

`train_chatbot_model.py` will prefer the processed corpus if present, but still works with the legacy JSONs for backward compatibility.

## Testing & utilities

- `test_api.py` spins up a quick client-side sanity check for the Flask endpoints.
- `test_emotions.py` verifies the emotion-enhanced responses (requires the API to be running).
- `test_improved_responses.py` demonstrates the enhanced embedding-based retrieval with side-by-side comparisons.
- `python3 -m compileall chatbot_api.py train_chatbot_model.py data_pipeline/prepare_datasets.py` performs a fast syntax check.

### Quick test after setup

```bash
# Start the API in one terminal
CHATBOT_DEBUG=false CHATBOT_RELOAD=off python3 chatbot_api.py

# In another terminal, run the test suite
python3 test_improved_responses.py
```

## Frontend integration

The Vue frontend consumes the `/api/chat` endpoint and handles:

- UI composition (`src/views/ChatbotView.vue`)
- User text input and message history
- Speech recognition (Web Speech API)
- Text-to-speech playback
- Character selection and topic hints

Point the frontend environment variable `VITE_CHATBOT_API` (or equivalent) to `http://localhost:5002` when developing locally.

## Future improvements

- Expand the processed corpus with more travel/weather nuances
- Add streaming responses for smoother voice playback
- Fine-tune the emotion blending using sentiment analysis
- Expose analytics endpoints for monitoring real-world usage
