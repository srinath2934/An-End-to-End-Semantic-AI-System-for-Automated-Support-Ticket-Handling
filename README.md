# Ticket Classification System Using Semantic AI

## 🚀 Overview
An end-to-end AI system that automates customer support ticket handling. It uses **Sentence-BERT (SBERT)** for semantic understanding and **Multi-Task Learning** to predict:
- Ticket Category (Billing, Technical, etc.)
- Priority Level (High, Medium, Low)
- Team Assignment
- Estimated Resolution Time

The system includes a **FastAPI backend** and a **React frontend** dashboard.


## 🏗️ Architecture

- **Frontend:** React 18, Recharts (Modern Dashboard)
- **Backend:** FastAPI, Uvicorn
- **ML Engine:** Sentence-Transformers (all-MiniLM-L6-v2), Scikit-learn, FAISS
- **Database:** SQLite (Ticket storage), FAISS (Vector DB for Action Retrieval)

---

## ⚡ Key Features

1. **Semantic Understanding:** Uses SBERT embeddings to understand context, handling typos and slang better than keyword-based systems.
2. **Multi-Task Prediction:** Single model pipeline predicts semantic category, priority, and routing simultaneously.
3. **Action Recommendations:** Retrieves similar past resolutions using vector similarity search.
4. **Real-time Dashboard:** Live visualization of ticket stats and AI confidence scores.
5. **High Performance:** ~120ms inference latency on standard hardware.

---

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/srinath2934/ticket-ml-project.git
cd ticket-ml-project
```

### 2. Backward Setup (FastAPI)
```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Server
uvicorn backend.main:app --reload
```

### 3. Frontend Setup (React)
```bash
cd frontend
npm install
npm start
```

---

## 📊 Project Structure

```
├── backend/            # FastAPI Application
├── frontend/           # React Dashboard
├── docs/               # Project Documentation & Reports
├── IEEE_Paper_Submission/ # Final Conference Paper Files
├── models/             # Trained ML Models
├── notebooks/          # Experiments & Training Notebooks
└── requirements.txt    # Python Dependencies
```

---

## 📈 Results
- **Accuracy:** 94.2% on 28k ticket dataset
- **Latency:** 120ms average response time
- **Business Impact:** Projected 65% reduction in manual triage costs

---
*Created for Final Year Project - JCT College of Engineering and Technology*
