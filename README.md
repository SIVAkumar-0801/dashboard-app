# 🚀 Custom Dashboard App

A modern, interactive personal dashboard for tracking routines, habits, work/tasks, and analyzing performance statistics — with real-time updates.

![Dashboard Preview](docs/preview.png)

## ✨ Features

- 📋 **Routine Management** — Schedule and track daily routines by time of day
- 💪 **Habit Tracking** — Streaks, completion rates, and history
- ✅ **Task Management** — Kanban-style board with priorities and deadlines
- 📊 **Analytics Dashboard** — Interactive charts, heatmaps, and trend analysis
- ⚡ **Real-time Updates** — Live sync across devices using WebSockets + Supabase
- 🌙 **Dark/Light Mode** — Beautiful dark-first design with toggle
- 📱 **Responsive** — Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

| Layer      | Technology            | Deployment          |
|------------|-----------------------|---------------------|
| Frontend   | Next.js 14 + Tailwind | Vercel              |
| Backend    | FastAPI (Python)      | Render / Railway    |
| Database   | Supabase (PostgreSQL) | Supabase Cloud      |
| Charts     | Recharts              | —                   |
| Real-time  | WebSockets + Supabase | —                   |

## 📁 Project Structure

```
dashboard-app/
├── frontend/          # Next.js 14 application
│   ├── app/           # App Router pages (dashboard, habits, tasks, routines, analytics)
│   ├── components/    # React components (charts, habits, tasks, ui)
│   ├── lib/           # Supabase client, API client, hooks, utils
│   └── types/         # TypeScript interfaces
│
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── models/    # SQLAlchemy ORM models
│   │   ├── schemas/   # Pydantic v2 schemas
│   │   ├── routes/    # API route handlers
│   │   ├── services/  # Business logic (streaks, analytics)
│   │   └── main.py    # App entry point with WebSocket support
│   └── tests/         # Pytest test suite
│
├── docs/              # Documentation
│   ├── API.md         # API reference
│   ├── DATABASE_SCHEMA.md  # SQL schema with RLS
│   ├── SETUP.md       # Setup guide
│   └── FEATURES.md    # Features documentation
│
└── .github/workflows/ # CI/CD (GitHub Actions)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, Python 3.11+, Docker (optional)
- [Supabase](https://app.supabase.com) account

### 1. Clone & Setup Database
```bash
git clone https://github.com/SIVAkumar-0801/dashboard-app.git
cd dashboard-app
```
Run the SQL from `docs/DATABASE_SCHEMA.md` in your Supabase SQL editor.

### 2. Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Edit with your values
uvicorn app.main:app --reload
```
API available at: http://localhost:8000 | Swagger: http://localhost:8000/docs

### 3. Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local  # Edit with your values
npm run dev
```
App available at: http://localhost:3000

### 4. Docker (Backend alternative)
```bash
cd backend
docker-compose up --build
```

## 📊 Dashboard Pages

| Page       | URL                       | Description                              |
|------------|---------------------------|------------------------------------------|
| Overview   | `/dashboard`              | Stats cards, quick actions, recent activity |
| Habits     | `/dashboard/habits`       | Habit list with streaks and check-ins   |
| Tasks      | `/dashboard/tasks`        | Kanban board with priority tracking     |
| Routines   | `/dashboard/routines`     | Daily routines by time of day           |
| Analytics  | `/dashboard/analytics`    | Charts, heatmap, trends                 |

## 🔌 API Endpoints

See [docs/API.md](docs/API.md) for complete API reference.

Key endpoint groups:
- `GET/POST /api/habits` — Habit CRUD + check-in + stats
- `GET/POST /api/tasks` — Task CRUD + status updates
- `GET/POST /api/routines` — Routine CRUD + check-in
- `GET /api/analytics/*` — Dashboard stats, heatmap, trends

## 🗄️ Database

See [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for complete schema.

Tables: `habits`, `habit_logs`, `routines`, `routine_logs`, `tasks`, `task_logs`, `analytics_snapshots`, `users`

## 🚢 Deployment

### Frontend → Vercel
1. Import repo in [Vercel](https://vercel.com), set root to `frontend`
2. Add env vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Backend → Render
1. Connect GitHub repo in [Render](https://render.com), set root to `backend`
2. Build: `pip install -r requirements.txt`
3. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

See [docs/SETUP.md](docs/SETUP.md) for full deployment guide.

## 🧪 Testing

```bash
cd backend
pytest tests/ -v
```

## 📖 Documentation

- [Setup Guide](docs/SETUP.md)
- [API Reference](docs/API.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Features Guide](docs/FEATURES.md)

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
