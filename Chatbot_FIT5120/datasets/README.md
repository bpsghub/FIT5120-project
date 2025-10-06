# External Conversation Datasets

This folder hosts third-party corpora that power the upgraded chatbot. To keep the repository lightweight, the raw files are not committed. Use the helper script `data_pipeline/prepare_datasets.py` to download them automatically or place the assets manually following the structure below:

```
datasets/
|-- raw/
|   |-- general/         # AI-Chatbot-Conversation-Dataset (data.txt)
|   |-- hobbies/         # Topical-Chat JSON dumps (train.json, valid.json, ...)
|   |-- travel/          # MultiWOZ data.json or Hugging Face cache
|   `-- weather/         # Optional MultiWOZ copy for keyword extraction
`-- processed/
    |-- general.json     # Generated question/answer pairs (do not edit manually)
    |-- hobbies.json
    |-- travel.json
    |-- weather.json
    `-- qa_pairs.json    # Consolidated file consumed by the training + API layers
```

## Quick start

```bash
pip install -r requirements.txt
python data_pipeline/prepare_datasets.py
python train_chatbot_model.py
python chatbot_api.py
```

The preparation script loads the datasets via the `datasets` Python package. If you prefer to work fully offline, download the repositories manually and drop their files into the `datasets/raw/<topic>` folders before running the script.
