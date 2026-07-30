# Semantic AI Ticket Intelligence Platform

Production-oriented expansion of research presented at IEEE ICIRCA 2026.

This project builds on my semantic IT ticket routing research and expands it into an end-to-end AI engineering system. The original research focused on semantic routing using SBERT embeddings and FAISS vector search. The current ongoing implementation extends that idea with PyTorch multi-task learning, FastAPI inference, data balancing, model evaluation, and MLOps-oriented tracking.

## Status

Ongoing development.

The goal is to move from research validation to a practical AI system that can classify support tickets, route them to the right team, estimate priority, and predict resolution effort from raw ticket text.

## Problem

Traditional IT support routing often depends on keyword rules and manual triage. That fails when users describe the same issue in different language.

Example:

```text
"my screen went black"
```

A keyword-based rule looking for "monitor broken" may miss the intent. A semantic system should understand that both tickets may refer to a display or hardware issue.

## Solution overview

The system uses transformer-based semantic representations to understand ticket intent and combines them with a multi-task ML architecture.

```text
Raw IT Ticket
     |
     v
SBERT / Hugging Face Embeddings
     |
     +--> FAISS Semantic Retrieval
     |
     v
PyTorch Shared Trunk
     |
     +--> Category Head
     +--> Team Routing Head
     +--> Priority Head
     +--> ETA Regression Head
     |
     v
FastAPI Inference Service
```

## Research phase

The research phase explored semantic ticket routing using:

- Sentence-BERT embeddings
- FAISS vector indexing
- confidence-based routing logic
- enterprise-style incident logs
- semantic similarity instead of keyword matching

Research status: presented at IEEE ICIRCA 2026.

## Current engineering expansion

The current system extends the research into a more production-oriented architecture:

- Multi-task PyTorch model for Category, Team, Priority, and ETA prediction.
- Hugging Face / SBERT embedding backbone for semantic ticket representation.
- FAISS retrieval for nearest-neighbor incident lookup and contextual action hints.
- FastAPI endpoint for model inference from JSON ticket payloads.
- Weights & Biases tracking for training experiments and overfitting checks.
- Data engineering pipeline for cleaning, balancing, and augmenting ticket data.

## Data engineering

The project includes dataset preparation work for model robustness:

- Started from a 48K-ticket base dataset.
- Engineered missing team labels using NLP feature rules and semantic context.
- Used NLTK WordNet synonym augmentation to create additional context-preserving ticket variants.
- Applied statistical resampling to reduce priority-class imbalance.
- Prepared a 108,819-row dataset for PyTorch dataloaders.

## Model design

The model uses a shared representation with multiple prediction heads:

| Output | Type | Purpose |
|---|---|---|
| Category | Classification | Identify the ticket category |
| Team | Classification | Route the issue to the responsible team |
| Priority | Classification | Estimate urgency level |
| ETA | Regression | Predict expected resolution time |

This avoids training four separate models and gives the system a single shared semantic backbone.

## Tech stack

- Python 3.11
- PyTorch and torch.nn
- Hugging Face Transformers
- Sentence-BERT / all-MiniLM-L6-v2
- FAISS vector search
- FastAPI, Uvicorn, Pydantic
- Weights & Biases
- Pandas, NLTK, Scikit-learn
- Jupyter Notebook

## Reproduce locally

```bash
git clone https://github.com/srinath2934/An-End-to-End-Semantic-AI-System-for-Automated-Support-Ticket-Handling.git
cd An-End-to-End-Semantic-AI-System-for-Automated-Support-Ticket-Handling
pip install -r requirements.txt
```

For notebook-based training:

```bash
cd "New Data Analysis"
jupyter notebook
```

Run the multi-task training notebook and configure your Weights & Biases key if experiment tracking is enabled.

## Portfolio relevance

This project demonstrates the full AI/ML lifecycle:

- problem framing
- data preprocessing and augmentation
- semantic NLP
- vector search
- PyTorch model training
- model evaluation
- FastAPI inference design
- MLOps tracking
- research-to-engineering iteration

## Author

Srinath S  
B.Tech Artificial Intelligence & Data Science, Anna University  
GitHub: https://github.com/srinath2934  
LinkedIn: https://www.linkedin.com/in/srinath29
