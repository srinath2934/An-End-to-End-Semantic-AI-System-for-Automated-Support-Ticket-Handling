# Semantic AI Ticket Intelligence Platform

End-to-end system that turns raw support tickets into: category (type), routing team, priority, and ETA (time-to-resolution) predictions using semantic embeddings, nearest-neighbor retrieval, and classical + production-oriented modeling. This repository contains the research notebooks, inference utilities, a FastAPI inference service, and a small React demo UI.

This README is grounded in the repository contents (notebooks/, backend/, ml_engine/, frontend/, reports/figures/) and the printed experiment outputs in the notebooks (see Sources below).

---
TL;DR
- I implemented data engineering, semantic retrieval (SBERT + FAISS), baseline models (notebooks with LinearSVC / Ridge), and a production inference service (FastAPI). Notebooks contain experiments and the final hybrid pipeline.

---
Quick facts
- Raw / base dataset: ~48k raw tickets used as a starting point; a processed/augmented training dataset of ~108,819 rows is referenced in the repo notebooks.
- Notebooks with experiments: notebooks/models.ipynb, notebooks/final_hybrid_system.ipynb, and others (see notebooks/).
- Key code: ml_engine/inference.py (inference & retrieval logic), backend/main.py (FastAPI app), frontend/src (React demo).

---
Key results (extracted from notebooks)
| Metric | Value | Source |
|---|---:|---|
| TEAM (queue) accuracy | 1.00 | notebooks/models.ipynb (printed output: "TEAM Accuracy: 1.0") |
| TYPE (category) accuracy | 1.00 | notebooks/models.ipynb (printed output: "TYPE Accuracy: 1.0") |
| PRIORITY accuracy | 0.331475 | notebooks/models.ipynb (printed output: "PRIORITY Accuracy: 0.331475") |
| ACTION accuracy | 0.33395 | notebooks/models.ipynb (printed output: "ACTION Accuracy: 0.33395") |
| ETA (TTR) MAE (hours) | 7.730376599928827 | notebooks/models.ipynb (printed output: "MAE (hours): 7.730376599928827") |

Notes on metrics
- These metrics are printed by the notebooks' baseline experiments (LinearSVC for classification heads and Ridge for regression). Some perfect scores (1.00) indicate the dataset and split used in that notebook produced separable results for those labels — please review the notebook cell context to confirm which dataset split / synthetic preprocessing was used before publishing these metrics externally.
- ETA is reported as MAE in the notebooks; if you prefer RMSE or median error, we can compute those by re-running the relevant notebook cells.

---
Repository map (where to find things)
- backend/ — FastAPI app and API endpoints (backend/main.py), analytics and database glue.
- ml_engine/ — inference utilities (ml_engine/inference.py), models/ (weights and indices may be stored here or produced by training scripts).
- frontend/ — React + Vite demo (frontend/src contains App.jsx and styling).
- notebooks/ — Jupyter notebooks covering data preparation, baseline experiments, hybrid pipeline, and evaluation. Recommended: 01_data_preparation.ipynb → 02_ticket_classification.ipynb → models.ipynb → final_hybrid_system.ipynb.
- reports/figures/ — architecture and experiment figures (fig1.png, fig2.png, fig3.png) used in docs/architecture.md.
- .env.example — template listing environment variables used by the inference service.

---
How the system works (short)
1. Ingest: ticket submitted via UI or API (subject + description).
2. Embedding: text encoded into dense vectors using a Sentence-BERT / Hugging Face model.
3. Retrieval: embedding queried against FAISS index to fetch similar historical tickets (context + action hints).
4. Prediction: model (either classical baseline or production multi-task model) predicts Category (type), Team (queue), Priority, and ETA.
5. Merge & respond: retrieval hits and model predictions are combined and returned; results are logged for auditing and retraining.

See docs/architecture.md for diagrams and the repo-embedded images (reports/figures/fig1.png, fig2.png, fig3.png).

---
Quick start — run the demo locally
Prerequisites
- Python 3.11 (or 3.10+ recommended), pip
- Node.js (for frontend), npm or yarn

1) Install Python dependencies
```bash
# from repo root
pip install -r requirements.txt
```

2) Configure environment
```bash
cp .env.example .env
# Edit .env and set MODEL_PATH and FAISS_INDEX_PATH if you have artifacts locally.
```

3) Start the backend (FastAPI)
```bash
# from repo root
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```
Expected endpoints in backend/main.py: /predict (or /tickets, check file for exact routes).

4) Start the frontend (React)
```bash
cd frontend
npm ci
npm run dev
```
Open the Vite URL printed in the console (default http://localhost:5173).

5) Quick API example (curl)
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"subject": "My laptop screen turned black","description": "After the update my display is blank and only backlight is on."}'
```
Example response (not guaranteed to match exact field names; check backend/main.py and ml_engine/inference.py):
```json
{
  "category": "display",
  "team": "desktop-hardware",
  "priority": "medium",
  "eta_hours": 12.5,
  "retrieval_hits": [
    {"ticket_id": 123, "similarity": 0.92, "short_action": "replace display cable"}
  ]
}
```

---
Reproduce experiments / evaluate
- Open notebooks/models.ipynb — this notebook runs baseline SVM models (team, priority, type, action) and a Ridge regressor for ETA (TTR). The printed outputs in the notebook contain the metrics summarized above.
- For end-to-end hybrid experiments, open notebooks/final_hybrid_system.ipynb.
- To reproduce metrics: run the notebook cells (ensure local data file paths in the notebooks are accessible or update them to point to your data). Many cells use absolute local paths (e.g., C:\Users\SRINATH\Desktop\...) — update those before executing.

---
Environment & deployment notes
- Model & index artifacts: store large artifacts (PyTorch weights, FAISS index) in `models/` or external object storage (S3/GCS). Configure MODEL_PATH and FAISS_INDEX_PATH in .env.
- Containerize the FastAPI app (Dockerfile not present in repo) and ensure model load occurs at startup (not per request) for low-latency serving.
- For scale, serve FAISS locally on pods with mounted SSD or use a vector DB (Milvus / Weaviate) if horizontal scaling is needed.

---
Limitations & caveats
- The printed notebook metrics come from notebook runs and may rely on synthetic or preprocessed datasets; verify dataset provenance and splits before using numbers as claims in a CV or publication.
- Some notebook outputs show perfect classification (1.0) — inspect those cells for data leakage, target leakage, or synthetic labels that make the task trivial.
- Production readiness requires: unit tests for inference path, secure storage for model artifacts, CI that runs basic checks, and a lightweight pre-trained artifact to let reviewers run the demo without heavy training.

---
Next recommended repo updates (I can implement on request)
- Add `scripts/run_demo.sh` to start backend, wait for it to be ready, and POST a sample ticket. I can commit this.
- Add a small pre-trained weights file or a download link (models/) so reviewers can run inference without retraining.
- Add a short UI GIF under reports/figures and reference it in README for recruiters.
- Add CI: a GitHub Actions workflow to run tests and basic linting on push/PR.

---
Sources / evidence (where I got metrics and file references)
- notebooks/models.ipynb — printed outputs for TEAM Accuracy, TYPE Accuracy, PRIORITY Accuracy, ACTION Accuracy, and TTR MAE (see output cells in the notebook). Example excerpts include: "TEAM Accuracy: 1.0", "TYPE Accuracy: 1.0", "PRIORITY Accuracy: 0.331475", "ACTION Accuracy: 0.33395", "MAE (hours): 7.730376599928827".
- notebooks/final_hybrid_system.ipynb — end-to-end hybrid pipeline and demonstrations.
- backend/main.py — FastAPI routes and orchestration (used to craft the example curl).
- ml_engine/inference.py — embedding + FAISS + inference glue.
- reports/figures/{fig1.png,fig2.png,fig3.png} — architecture images referenced by docs/architecture.md.

---
Author
Srinath S — B.Tech Artificial Intelligence & Data Science, Anna University
- GitHub: https://github.com/srinath2934
- LinkedIn: https://www.linkedin.com/in/srinath29

---
License
- No license file present in this repo. Add a LICENSE (MIT/Apache-2.0) if you want to allow reuse.

