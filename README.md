# SpamShield – Spam Message Detection

Full-stack app: paste a message (or up to 50 at once), get a spam/not-spam verdict, a score, and the reasons.
Accounts (bcrypt + JWT), per-user history with filters and delete, and a dashboard with counts and a 14-day chart.

## How detection works
- **Trained model (recommended):** TF-IDF (1–2 grams) + logistic regression, trained with scikit-learn on the
  UCI SMS Spam Collection. Reasons shown are the words that pushed the score toward spam.
- **Fallback:** if no trained model file exists, rule-based signals (prize/urgency wording, links, phone numbers,
  money, account-bait, caps, punctuation) score the message. The UI states which engine produced each result.
No model is shipped in this repo. Metrics appear on the dashboard only after you train one.

## Run the backend
    cd backend
    python -m venv .venv && source .venv/bin/activate
    pip install -r requirements.txt
    cp .env.example .env              # set JWT_SECRET
    python -m app.ml.train            # downloads the dataset, trains, prints test metrics (needs internet)
    uvicorn app.main:app --reload --port 8000
Offline? Use `python -m app.ml.train --data sms.tsv` with a file of `spam|ham<TAB>text` lines.
Restart the API after training to load the model. API docs: http://localhost:8000/docs

## Run the frontend
    cd frontend && npm install && npm run dev      # http://localhost:5173

## API
POST /api/auth/register, /api/auth/login, GET /api/auth/me ·
POST /api/detect, /api/detect/batch · GET /api/history?label=spam|ham, DELETE /api/history/{id} ·
GET /api/stats, GET /api/model

## Tests
    cd backend && pytest

## Not included yet
Rate limiting, Docker, frontend tests, PostgreSQL migrations (tables are created on startup), email/SMS import.
A spam filter makes mistakes in both directions; treat the score as a signal, not a verdict.
