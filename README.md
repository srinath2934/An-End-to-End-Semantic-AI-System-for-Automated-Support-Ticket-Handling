# Semantic AI Ticket Intelligence Platform

TL;DR
- Built an end-to-end semantic ticket intelligence system (research → production) that turns raw support tickets into: category, routing team, priority, and ETA predictions using transformer embeddings + FAISS retrieval + a PyTorch multi-task model. I (Srinath S) implemented the data pipeline, modeling experiments, inference service (FastAPI), and a React demo UI.

Why this matters (one line)
- Replaces brittle keyword routing with semantic understanding, improving routing robustness and enabling faster, more accurate triage in enterprise helpdesks.

Quick facts
- Dataset: started from a 48k-ticket base, processed into a 108,819-row training set.
- Main components: Embedding (SBERT / HF), FAISS retrieval, PyTorch multi-task model, FastAPI inference, React + Vite demo.
- Stack: Python 3.11, PyTorch, Hugging Face, FAISS, FastAPI, React (Vite)

Contents / quick map
- notebooks/ — all EDA and modeling experiments (01_data_preparation.ipynb, 02_ticket_classification.ipynb, etc.)
- ml_engine/ — inference and model utilities (inference.py)
- backend/ — FastAPI app (main.py), analytics, and DB glue
- frontend/ — React + Vite demo UI
- models/ — trained models, indices, and artifacts (not always checked in; see README notes)
- data/ — processed datasets and examples
- reports/ — experimental writeups

What I implemented (high level)
- Data engineering: cleaning, label engineering, WordNet-based augmentation, class balancing and resampling.
- Semantic retrieval: SBERT/Hugging Face embeddings + FAISS for nearest-neighbor retrieval and action hinting.
- Modeling: PyTorch shared trunk (multi-task) with separate heads for Category, Team, Priority (classification) and ETA (regression).
- Inference: FastAPI endpoints that serve prediction + retrieval results; minimal React demo to post tickets and show routing recommendations.
- MLOps: experiment tracking using Weights & Biases (W&B) in notebooks and training scripts.

Key results (replace placeholders with numbers from your final run)
| Metric | Score |
|---|---|
| Category accuracy | 0.XX (replace with your best model result) |
| Team routing accuracy | 0.XX |
| Priority F1 (macro) | 0.XX |
| ETA RMSE (hours) | X.XX |

Notes: I intentionally left metric placeholders so you can paste in final numbers from your best experiment notebook (notebooks/models.ipynb or final_hybrid_system.ipynb).

Demo — run locally (shortest path)
1) Install dependencies
```bash
# from repo root
pip install -r requirements.txt
# or, for modern environments
python -m pip install -r requirements.txt
```

2) Start the backend (FastAPI)
```bash
# from repo root
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```
Environment variables (optional but recommended):
- MODEL_PATH — path to your saved PyTorch model
- FAISS_INDEX_PATH — path to FAISS index (.index)
- WANDB_API_KEY — if you use Weights & Biases for experiment tracking

3) Start the frontend (React)
```bash
cd frontend
npm ci
npm run dev
```
Open the URL printed by Vite (usually http://localhost:5173) and use the UI to post sample tickets.

Quick API example (curl)
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"subject": "My laptop screen turned black","description": "After the update my display is blank and only backlight is on."}'
```
Response (example)
```json
{
  "category": "display",
  "team": "desktop-hardware",
  "priority": "medium",
  "eta_hours": 12.5,
  "retrieval_hits": [
    {"ticket_id": 123, "similarity": 0.92, "short_action": "replace display cable"},
    {"ticket_id": 456, "similarity": 0.88, "short_action": "instruct user to check brightness/settings"}
  ]
}
```
(Fields above depend on model and retrieval outputs — actual shape may differ; see backend/main.py and ml_engine/inference.py.)

How to reproduce the modeling experiments
- Open the notebooks/ directory. Recommended order:
  1. notebooks/01_data_preparation.ipynb — dataset cleaning & augmentation
  2. notebooks/02_ticket_classification.ipynb — baseline classification
  3. notebooks/03_team_priority_prediction.ipynb — multi-task modeling experiments
  4. notebooks/final_hybrid_system.ipynb — final hybrid pipeline + retrieval

Where to look for the important code
- backend/main.py — API routes and request/response models
- ml_engine/inference.py — embedding, retrieval, and model inference logic
- notebooks/* — experiments, metrics, and evaluation

CI / tests
- A basic pytest configuration is present (pyproject.toml and tests/). Run:
```bash
pytest -q
```

What to add next (optional improvements to make this more recruiter-friendly)
- Add final numeric metrics into the "Key results" table (from notebooks/models.ipynb).
- Add a short 10–20s GIF of the UI under docs/ or in README header to showcase the demo quickly.
- Provide a small, pre-trained lightweight weights file in models/ (or link to a hosted artifact) so reviewers can run a clean demo without retraining.
- Add `.env.example` listing expected env vars and a scripts/run_demo.sh that starts backend, waits for it, then sends a sample request.

Author
Srinath S — B.Tech Artificial Intelligence & Data Science, Anna University
- GitHub: https://github.com/srinath2934
- LinkedIn: https://www.linkedin.com/in/srinath29

License
(If you'd like a license, add one — e.g., MIT. Currently no license file is included.)
