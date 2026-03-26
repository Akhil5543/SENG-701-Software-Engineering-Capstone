<<<<<<< HEAD
# Software Design Tool — SENG 701 Capstone

A repository, demonstration, and evaluation platform for software design and architecture methods and tools.

**Stack:** React + FastAPI + PostgreSQL + Docker

---

## Prerequisites (Windows)

Install these first:
1. **Docker Desktop** → https://www.docker.com/products/docker-desktop/
2. **Git** → https://git-scm.com/download/win
3. **VS Code** (recommended) → https://code.visualstudio.com/

---

## Quick Start (3 commands)

```bash
# 1. Clone your repo (after pushing to GitHub)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# 2. Start everything (DB + backend + frontend)
docker-compose up --build

# 3. Open the app
# Frontend: http://localhost:5173
# API docs:  http://localhost:8000/docs
```

The database is automatically seeded with design methods, architectures, and tools on first run.

---

## Project Structure

```
swdesign/
├── backend/
│   ├── app/
│   │   ├── api/           # FastAPI route handlers
│   │   │   ├── methods.py
│   │   │   ├── architectures.py
│   │   │   ├── tools.py
│   │   │   └── evaluations.py
│   │   ├── core/          # Config, DB session
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── main.py        # App entry point
│   │   └── seed.py        # Initial data seeding
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-level pages
│   │   └── utils/         # API client
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/methods/` | List design methods (supports `?search=&category=`) |
| GET | `/api/v1/methods/{slug}` | Get method detail + avg rating |
| POST | `/api/v1/methods/` | Create new method |
| GET | `/api/v1/architectures/` | List architectures |
| GET | `/api/v1/architectures/compare?ids=1,2,3` | Compare architectures |
| GET | `/api/v1/tools/` | List tools (supports `?license_type=`) |
| POST | `/api/v1/evaluations/` | Submit evaluation/review |
| GET | `/api/v1/stats` | Platform stats |

Full interactive docs at **http://localhost:8000/docs**

---

## Development Workflow

```bash
# Start services
docker-compose up

# Stop services
docker-compose down

# Reset database (re-seeds automatically)
docker-compose down -v
docker-compose up --build

# View backend logs
docker logs swdesign_backend -f

# Run backend directly (outside Docker, needs local Python + PostgreSQL)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with stats and recent entries |
| `/methods` | Browse & search design methods |
| `/methods/:slug` | Method detail with Mermaid diagram demo + reviews |
| `/architectures` | Browse architecture styles with score bars |
| `/architectures/:slug` | Architecture detail with strengths/weaknesses |
| `/tools` | Browse tools with license/platform info |
| `/tools/:slug` | Tool detail with evaluation form |
| `/compare` | Side-by-side radar chart comparison |

---

## Alpha Checkpoint Targets (Week 3)

- [x] Repository — Design Methods (R1)
- [x] Repository — Architecture Styles (R2)  
- [x] Repository — Tools Catalog (R3)
- [x] Search & Filter Dashboard (R4)
- [x] Interactive Diagram Demonstrations (R5)
- [x] Rating & Review System (R7)
- [x] Aggregate Evaluation Scores (R8)
- [ ] Side-by-Side Diagram Compare (R6) — Beta
- [ ] Export PDF/CSV/JSON (R10) — Beta
- [ ] Admin Data Entry Form (R11) — Beta
- [ ] Collaborative Annotations (R12) — Final

---

## Git Commit Convention

```
feat: add evaluation form to method detail page
fix: correct mermaid diagram rendering on Safari
docs: update README with deployment instructions
chore: add seed data for microservices architecture
```

Commit frequently — at least once per working session.
=======

# SENG 701 – Software Engineering Capstone

This repository contains work for the SENG 701 Software Engineering Capstone course.

## Project Status
The capstone project proposal is currently under review. The final project scope and sponsor will be confirmed upon proposal approval.

## Planned Focus
The project will involve the design and development of a software-based system that demonstrates core software engineering principles, including requirements analysis, system design, implementation, and evaluation.

## Capstone Phases
- Proposal
- Alpha
- Beta
- Final

This repository will be updated throughout the capstone lifecycle as the project evolves.
>>>>>>> 4c724c0abae7b446b6bd6a07dc53493e0657a1a7
