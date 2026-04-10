# Setup Guide

Complete step-by-step setup instructions for the Dashboard App.

---

## Prerequisites

- **Node.js** v18+ and npm/yarn
- **Python** 3.11+
- **Docker** (optional, for containerized backend)
- **Supabase** account (free tier works)
- **Git**

---

## 1. Clone the Repository

```bash
git clone https://github.com/SIVAkumar-0801/dashboard-app.git
cd dashboard-app
```

---

## 2. Supabase Setup

### 2.1 Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **New Project**
3. Name it `dashboard-app`
4. Choose a region close to you
5. Set a strong database password

### 2.2 Run the Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Copy the entire SQL from `docs/DATABASE_SCHEMA.md`
3. Run each section (tables, indexes, RLS policies, triggers)

### 2.3 Get Your API Keys

From your Supabase project:
- Go to **Settings → API**
- Copy:
  - **Project URL** → `SUPABASE_URL`
  - **anon/public** key → `SUPABASE_KEY`

---

## 3. Backend Setup (FastAPI)

### Option A: Local Development

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your values
```

Edit `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_KEY=your-anon-key
SECRET_KEY=generate-a-random-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

```bash
# Run the server
uvicorn app.main:app --reload --port 8000
```

The API will be available at: http://localhost:8000

API docs (Swagger UI): http://localhost:8000/docs

### Option B: Docker

```bash
cd backend

# Copy and edit .env
cp .env.example .env

# Build and run
docker-compose up --build
```

---

## 4. Frontend Setup (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your values
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

```bash
# Run development server
npm run dev
```

The app will be at: http://localhost:3000

---

## 5. Verify Setup

1. Open http://localhost:3000 — you should see the dashboard
2. Open http://localhost:8000/docs — you should see the FastAPI Swagger UI
3. Try creating a habit from the UI
4. Check the Supabase table editor to confirm data is being saved

---

## 6. Production Deployment

### Frontend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your `dashboard-app` repository
4. Set **Root Directory** to `frontend`
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = your backend URL
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Deploy!

### Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables (same as `.env`)
7. Deploy!

### Backend → Railway

1. Go to [railway.app](https://railway.app) → **New Project**
2. Deploy from GitHub repo
3. Set root directory to `backend`
4. Add environment variables
5. Railway auto-detects the Dockerfile

---

## 7. CI/CD (GitHub Actions)

The repository includes two GitHub Actions workflows:

- `.github/workflows/frontend-deploy.yml` — Deploys frontend to Vercel on push to `main`
- `.github/workflows/backend-deploy.yml` — Tests and deploys backend on push to `main`

### Required GitHub Secrets

Add these in **Settings → Secrets and variables → Actions**:

| Secret Name             | Description                    |
|-------------------------|--------------------------------|
| `VERCEL_TOKEN`          | Vercel API token               |
| `VERCEL_ORG_ID`         | Vercel organization ID         |
| `VERCEL_PROJECT_ID`     | Vercel project ID              |
| `RENDER_API_KEY`        | Render API key (for backend)   |
| `RENDER_SERVICE_ID`     | Render service ID              |

---

## Troubleshooting

### "CORS error" from frontend to backend

- Make sure your backend URL is correctly set in `NEXT_PUBLIC_API_URL`
- The backend allows all origins in development; in production, update the CORS settings in `backend/app/main.py`

### Database connection errors

- Verify your `DATABASE_URL` is correct
- Make sure your Supabase project is running (free tier may pause after inactivity)

### "Failed to fetch" on the dashboard

- The frontend will fall back to mock data if the backend is unavailable
- This is expected behavior during local development without a running backend

### Tests failing

```bash
cd backend
pytest tests/ -v
```
