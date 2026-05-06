# 🚀 How to Run — Semantic AI Support Ticket System

## ⚙️ Prerequisites
Open terminal in the project folder:
```
c:\Users\SRINATH\Desktop\data science\machine learing\ml project
```

---

## Step 0 — Activate Virtual Environment
```bash
.venv\Scripts\activate
```
✅ You will see `(.venv)` appear at the start of your terminal prompt.

> **Note:** If you skip this step, use `.venv\Scripts\python.exe` directly in all commands below.

---

## Step 1 — Start the Backend (FastAPI)
Open **Terminal 1** and run:
```bash
.venv\Scripts\python.exe -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```
✅ Expected output:
```
🚀 Loading AI Models into memory...
✅ All Models Loaded Successfully.
INFO: Uvicorn running on http://0.0.0.0:8000
```

---

## Step 2 — Start the Frontend (React)
Open **Terminal 2** and run:
```bash
cd frontend
npm.cmd run dev -- --host 0.0.0.0 --port 5173
```
✅ Expected output:
```
ROLLDOWN-VITE ready in Xms
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

---

## Step 3 — Open the App
Open browser and go to:
```
http://localhost:5173/
```

---

## Step 4 — Test the API (Optional)
```
http://localhost:8000/docs
```

---

## 🛑 Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `ModuleNotFoundError` | Wrong Python used | Use `.venv\Scripts\python.exe` explicitly |
| `ERR_CONNECTION_REFUSED` | Server not started | Run Steps 1 & 2 first |
| `Port already in use` | Old process running | Kill port: `netstat -ano \| findstr :8000` then `Stop-Process -Id <PID> -Force` |
| `ERR_HTTP_RESPONSE_CODE_FAILURE` | Vite bound to IPv6 only | Always add `--host 0.0.0.0` to the npm command |
| `ttr_ohe.pkl not found` | Missing model file | Safe to ignore — ETA uses fallback |
| `FileNotFoundError` in notebook | Wrong working directory | Use `../models/` instead of `models/` |

---

## 📂 Project Structure
```
ml project/
├── backend/          → FastAPI server (main.py)
├── frontend/         → React UI  (npm run dev)
├── ml_engine/        → inference.py — core prediction logic
├── models/           → All trained .pkl model files
│   ├── category_classifier/
│   ├── team_priority_classifier/
│   ├── resolution_time_predictor/
│   └── action_generator/    → action_kb_index.pkl (5,000 KB entries)
├── notebooks/        → 14 training/research notebooks
├── scripts/          → Utility scripts
├── data/db/          → SQLite database (tickets.db — 28,587 tickets)
└── docs/             → Documentation & screenshots
```
