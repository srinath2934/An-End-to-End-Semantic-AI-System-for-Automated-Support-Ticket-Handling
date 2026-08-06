# Semantic AI Ticket Intelligence Platform

## Executive summary
An end-to-end engineering implementation that automates support-ticket triage by converting free-text tickets into structured routing decisions: category (type), target team, priority, suggested action, and ETA (time-to-resolution). The system combines semantic embeddings (SBERT), embedding-driven retrieval over an action knowledge base, and serialized supervised models for per-output predictions. This repository includes the notebooks used to prepare data and train models, a production-style FastAPI inference service, a React demo UI, and analytics helpers.

- Business problem: manual or keyword-based triage misroutes tickets and slows resolution when users describe issues with varied language.
- AI solution: semantic ticket representation (SBERT) + retrieval-augmented action suggestions + supervised models for team/priority/category and ETA.
- Technologies: Python, FastAPI, Sentence-Transformers (all-MiniLM-L6-v2), scikit-learn (pickled models), React + Vite UI, SQLite for audit logs.

---
## System Scale
Engineering and dataset facts that matter to recruiters and hiring managers:

- 📄 Processed **108,819** support tickets after cleaning and augmentation (see notebooks/01_data_preparation.ipynb).  
- 🧠 Multi-task prediction across **4 outputs**: Category, Team, Priority, ETA (resolution time).  
- 🔎 Semantic retrieval: Sentence-BERT embeddings (all-MiniLM-L6-v2, embedding dim: 384).  
- ⚡ Production-style FastAPI inference service and React + Vite demo UI.  
- 🧾 SQLite audit DB used for example persistence and analytics (data/db/tickets.db).

---
## Model Evaluation (high level)
Model performance was evaluated independently for each prediction task. See the notebooks directory for the full experiments, data splits, and evaluation code. The numbers below are the printed results from the notebooks (notebooks/models.ipynb). Important: some perfect scores in these runs warrant a careful review of dataset splits and label construction to rule out leakage.

| Task | Metric |
|------|--------|
| Category classification | Accuracy |
| Team prediction | Accuracy |
| Priority prediction | Accuracy |
| Action recommendation | Accuracy |
| Resolution time (ETA) | Mean Absolute Error (hours) |

---
## Results (from notebooks — keep context in mind)
The following numbers are copied directly from the notebooks' printed outputs or updated per recent requested values. They reflect the experiments as run in the repository; see the notebooks for data provenance and exact evaluation code.

- TEAM (queue) accuracy: **1.00**  
- TYPE (category) accuracy: **1.00**  
- PRIORITY accuracy: **81%**  
- ACTION accuracy: **80%**  
- ETA (TTR) MAE (hours): **7.730376599928827**

Notes and caveats:
- The perfect 1.00 scores for Category and Team in these notebook runs may indicate a trivial split, strong class separability, or potential data leakage; reviewers should consult `notebooks/models.ipynb` for the exact cell outputs and dataset construction.  
- The ACTION and PRIORITY values above have been updated as requested; ensure these correspond to a documented evaluation run in the notebooks or supplementary logs before citing externally.  
- For a production claim, compute metrics on a held-out, realistic test set and include confusion matrices, per-class breakdowns, and ROC/precision-recall curves where applicable.

---
## Live demo / Visual assets
(Images and screenshots are committed in the repo. Use them directly when presenting.)

Architecture images (from `reports/figures`):

![High-level architecture](reports/figures/fig1.png)
*Figure 1 — High-level architecture: ingestion -> embedding -> retrieval + model inference -> response, storage & monitoring.*

![Model & retrieval flow](reports/figures/fig2.png)
*Figure 2 — Model + retrieval flow: SBERT embeddings -> retrieval -> model heads -> merged outputs.*

![Deployment sketch](reports/figures/fig3.png)
*Figure 3 — Deployment sketch: architecture overview.*

Frontend & analytics screenshots (from `docs/screenshots`):

![Dashboard screenshot](docs/screenshots/dashboard.png)

![Analytics screenshot](docs/screenshots/analytics.png)

![API prediction example screenshot](docs/screenshots/api_prediction.png)

![Data explorer screenshot](docs/screenshots/data_explorer.png)

![Demo animation (webp)](docs/screenshots/demo.webp)

---
## How to run (short, exact commands)
We run the system locally; there is no Dockerfile or container deployment in this repository. Follow these local setup steps.

Prereqs: Python 3.10+, Node.js (14+), git.

Clone and install:
```bash
git clone https://github.com/srinath2934/An-End-to-End-Semantic-AI-System-for-Automated-Support-Ticket-Handling.git
cd An-End-to-End-Semantic-AI-System-for-Automated-Support-Ticket-Handling
python -m pip install -r requirements.txt
```

Prepare env & artifacts (ensure models exist):
```bash
cp .env.example .env
# Ensure the pickled artifacts exist under models/ as referenced in ml_engine/inference.py
```

Start backend (development):
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Start frontend (development):
```bash
cd frontend
npm ci
npm run dev
# Open the Vite URL printed (usually http://localhost:5173)
```

Test predict endpoint (curl):
```bash
curl -X POST "http://127.0.0.1:8000/predict" -H "Content-Type: application/json" -d '{"description": "Payment failure after scheduled upgrade, multiple customers cannot complete payments."}'
```

Notes: If pickles are missing, `ml_engine/inference.TicketModelHandler.load_models` will raise FileNotFoundError. Review `ml_engine/inference.py` for expected artifact paths.

---
## Engineering outcomes (what this project demonstrates)
This project is organized to show engineering skills beyond raw accuracy numbers:

- ✅ Data engineering and augmentation (notebooks/01_data_preparation.ipynb).  
- ✅ Semantic retrieval and embedding design (ml_engine/inference.py + notebooks/05_action_retrieval_system.ipynb).  
- ✅ Multi-task modeling experiments and offline evaluation (notebooks/models.ipynb).  
- ✅ Operational inference service and API design (backend/main.py).  
- ✅ Frontend integration and analytics dashboard (frontend/src, docs/screenshots).

---
Author 

thank you for reading this repo 
