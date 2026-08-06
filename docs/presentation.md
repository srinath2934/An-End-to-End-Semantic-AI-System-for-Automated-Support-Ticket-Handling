# Project Presentation — Semantic AI Ticket Intelligence Platform

This presentation-style document summarizes the project for reviewers, recruiters, and stakeholders. It is meant to be a concise, shareable overview that you can use as the basis for slide decks or a GitHub Pages presentation.

---
Slide 1 — Title

Semantic AI Ticket Intelligence Platform

From research (SBERT + FAISS) to production-ready inference service

Author: Srinath S — GitHub: https://github.com/srinath2934

---
Slide 2 — One-line pitch

Replace brittle, keyword-based ticket routing with a semantic, retrieval-augmented multi-task system that predicts category, routing team, priority, and ETA from raw ticket text.

---
Slide 3 — Problem

- Enterprise ticket routing often relies on fragile keyword rules and manual triage.
- Tickets with the same intent are written in many ways, causing misrouting and delays.
- Goal: Improve routing accuracy and reduce mean time to triage with an explainable, semantic approach.

---
Slide 4 — Solution overview

- Use SBERT/Hugging Face to embed ticket text.
- Use FAISS to retrieve similar historical tickets and action hints.
- Use a PyTorch multi-task model with a shared trunk and heads for Category, Team, Priority and ETA.
- Serve predictions via a FastAPI inference service and a React demo UI.

---
Slide 5 — Architecture (visual)

See docs/architecture.md for embedded images and the Mermaid diagram.
Key assets (already present in repo):
- reports/figures/fig1.png — high-level architecture
- reports/figures/fig2.png — model & retrieval flow
- reports/figures/fig3.png — deployment sketch

---
Slide 6 — Data & scale

- Base raw dataset: 48,000 tickets (public or internal depending on source)
- Processed training set: 108,819 rows after augmentation and resampling
- Augmentation: WordNet synonym augmentation and semantic paraphrasing
- Class balancing: resampling to reduce priority-class imbalance

---
Slide 7 — Modeling & approach

- Embeddings: all-MiniLM-L6-v2 (Sentence-BERT) or comparable Hugging Face models
- Retrieval: FAISS (flat / IVF indexes depending on scale)
- Model: PyTorch shared trunk + separate heads for each output
- Loss: Multi-task loss (classification heads: cross-entropy; regression head: MSE)
- Training tracked with Weights & Biases

---
Slide 8 — How to demo locally

1) Install dependencies
```bash
pip install -r requirements.txt
```
2) Start backend
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```
3) Start frontend
```bash
cd frontend
npm ci
npm run dev
```
4) Or use the quick curl example in README.md to POST a ticket to /predict

---
Slide 9 — Results (placeholders)

- Category accuracy: 0.XX
- Team routing accuracy: 0.XX
- Priority macro F1: 0.XX
- ETA RMSE (hours): X.XX

(Replace placeholders with numbers from the notebooks/final_hybrid_system.ipynb.)

---
Slide 10 — Repro & artifacts

- Notebooks contain full experiments: notebooks/01_data_preparation.ipynb → notebooks/final_hybrid_system.ipynb
- Production code: backend/ (FastAPI), ml_engine/ (inference)
- Artifacts: models/ (model weights and FAISS indices)

---
Slide 11 — Literature & references

A concise literature review is available at docs/literature_review.md (will include Transformers, SBERT, FAISS, RAG, and multi-task learning references).

---
Slide 12 — Next steps / Work requested from owner

1. Provide final metric numbers to fill the Results slide.
2. Optionally provide a lightweight pretrained weights file or a hosted download link so reviewers can run the demo without retraining.
3. Optionally add a short UI GIF under reports/figures for README and this presentation.
4. Confirm whether the dataset is public or private and add a data license note if applicable.

---
Slide 13 — Contact

Srinath S
- GitHub: https://github.com/srinath2934
- LinkedIn: https://www.linkedin.com/in/srinath29

---
Notes
- This file is committed to `docs/presentation.md` on the `main` branch. Use it as a basis for slide generation or GitHub Pages content. If you want a PDF or PPTX generated automatically from this, I can add a script to convert Markdown to slides (using Pandoc / reveal.js) and commit it as well.
