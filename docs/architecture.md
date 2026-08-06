# Architecture

This document describes the system architecture for the Semantic AI Ticket Intelligence Platform. The repo already includes architecture images in `reports/figures/` — they are embedded below and described. Use this file as the canonical architecture reference for reviewers and operators.

Images (from reports/figures)

![High-level architecture](reports/figures/fig1.png)
*Figure 1 — High-level system architecture: ingestion → embedding → retrieval + model inference → response, storage & monitoring.*


![Model & retrieval flow](reports/figures/fig2.png)
*Figure 2 — Model + retrieval flow: SBERT/Hugging Face embeddings → FAISS search → PyTorch multi-task model (shared trunk + heads) → merged output.*


![Deployment sketch](reports/figures/fig3.png)
*Figure 3 — Deployment sketch: containers, storage, and monitoring.*

Mermaid (text) diagram

You can paste this Mermaid markup in README or docs that support Mermaid to get a rendered flowchart.

```mermaid
flowchart TD
  A[User / Ingest] -->|POST /tickets| B[Frontend (React) / Ingest Worker]
  B --> C[FastAPI Inference Service]

  subgraph Inference
    C --> D[Embedding Layer\n(SBERT / Hugging Face)]
    D --> E[FAISS Vector Index\n(nearest neighbors)]
    D --> F[PyTorch Multi-task Model\n(shared trunk + heads)]
    E --> G[Retrieval Results / Hits]
    F --> H[Predictions: category, team, priority, ETA]
    G --> I[Merge predictions + retrieval hints]
    I --> C
  end

  C --> J[Client / UI Response]
  C --> K[DB / Audit Log]
  C --> L[Analytics & Monitoring]
  C --> M[W&B / Experiment Tracking]

  subgraph Storage
    N[Models & Indices] --- O[Artifact Store (S3/GCS/NFS)]
  end

  subgraph Training
    P[Notebooks & Training Scripts] --> Q[Train -> produce artifacts]
    Q --> N
  end

  subgraph Ops
    R[Container Platform (Docker / Kubernetes)] --> C
    R --> E
  end
```

Component responsibilities

- Frontend (React/Vite): ticket entry and visualization of predictions and retrieval hits. Simple client that posts JSON to the FastAPI endpoints.
- FastAPI Inference Service (backend/main.py): request validation, orchestration of embedding + retrieval + model inference, merging of retrieval context with model outputs, persisting results to DB or logs, and returning structured responses.
- Embedding Layer: Hugging Face / SBERT provides dense sentence vectors from ticket subject+description. These vectors are inputs to both the model and FAISS retrieval.
- FAISS Vector Index: nearest-neighbor search for historical tickets; returns similar ticket IDs and short action hints to help produce contextual responses.
- PyTorch Multi-task Model (ml_engine): shared trunk producing a semantic representation with multiple heads for Category, Team, Priority (classification) and ETA (regression). Model weights and tokenizer live in `models/`.
- Persistence & Analytics (backend/database.py, backend/analytics.py): store incoming requests, prediction results, user feedback; compute analytics and retention for retraining.
- MLOps / Experiment Tracking: Weights & Biases or equivalent tracks training runs and hyperparameters in notebooks.
- Storage: use object storage for large artifacts (S3/GCS) and mount or download to inference nodes on startup.

Data flow summary

1. The user (or an ingestion worker) POSTs a ticket payload (subject + description) to the FastAPI endpoint.
2. FastAPI calls the embedding function to compute SBERT/HF vectors.
3. The service queries the FAISS index with the embedding to retrieve K most similar historical tickets and action hints.
4. The embeddings (and optional retrieval features) are fed to the PyTorch multi-task model to produce category, team, priority, and ETA predictions.
5. The inference service merges predictions with retrieval hits into a single response, stores the result in the audit DB, and returns it to the client.
6. Logged data and feedback are later used to retrain models using the notebooks and training scripts; new artifacts are stored in the artifact store.

Deployment & operational suggestions

- Containerize the inference service. Load the model and FAISS index once on container start to avoid per-request initialization latency.
- For scaling, host FAISS on local SSDs or serve FAISS via a dedicated vector service (Milvus, Weaviate) if you need horizontal scaling.
- Store model artifacts and indices in S3/GCS; use a small bootstrap step to download artifacts to pods on start.
- Use GPU-enabled nodes for lower latency model inference; ensure CPU fallback for cost-sensitive staging environments.
- Add liveness/readiness endpoints; use warmup to pre-load model and index in Kubernetes rolling deployments.
- Monitor request latency, retrieval hit rates, prediction confidence distribution, and data drift.

Files referenced

- `backend/main.py` — API routes and orchestration
- `ml_engine/inference.py` — embedding, retrieval, and inference logic
- `reports/figures/fig1.png`, `fig2.png`, `fig3.png` — architecture images (embedded above)

Next step

If you'd like, I will commit this file into `docs/architecture.md` and add `docs/literature_review.md` next. I can also add a quick `docs/images/` copy if you prefer the docs to reference `docs/images/*` instead of `reports/figures/*`. Do you want me to commit these files to `main` or create a branch and open a PR?