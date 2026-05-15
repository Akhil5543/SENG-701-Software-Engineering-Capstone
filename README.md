# Software Design Tool Platform — SENG 701 Capstone

A web-based platform for surveying, demonstrating, and evaluating software design methods, architecture styles, and modeling tools.

**Student:** Akhil Reddy Gangula | **Course:** SENG 701 – Software Engineering Capstone | **UMBC Spring 2026**

**Live Application:** https://swdesign-frontend.onrender.com  
**API Documentation:** https://swdesign-backend.onrender.com/docs

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React.js 18, Vite 5, Tailwind CSS 3, Mermaid.js, Recharts |
| Backend | Python 3.11, FastAPI 0.111, SQLAlchemy 2.0, Pydantic v2, PyJWT |
| Database | PostgreSQL 15 |
| Deployment | Docker Compose (local), Render.com (production) |

---

## Quick Start (Local Development)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/download/win)

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/Akhil5543/SENG-701-Software-Engineering-Capstone.git
cd SENG-701-Software-Engineering-Capstone

# 2. Create frontend environment file
echo VITE_API_URL=http://localhost:8000 > frontend/.env

# 3. Build and start all 3 services
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

The database is automatically seeded with 35 base catalog entries on first run.

---

## Project Structure

```
swdesign/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── methods.py          # Design methods CRUD
│   │   │   ├── architectures.py    # Architectures CRUD
│   │   │   ├── tools.py            # Tools CRUD
│   │   │   ├── evaluations.py      # Community evaluations
│   │   │   ├── annotations.py      # Community annotations (Final)
│   │   │   └── auth.py             # JWT authentication (Final)
│   │   ├── core/
│   │   │   ├── database.py         # SQLAlchemy engine + session
│   │   │   └── config.py           # Pydantic settings
│   │   ├── models/
│   │   │   └── models.py           # 5 SQLAlchemy ORM models
│   │   ├── schemas/
│   │   │   └── schemas.py          # 14 Pydantic v2 schemas
│   │   ├── main.py                 # FastAPI app + routers + startup
│   │   └── seed.py                 # 35 base catalog entries
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MethodsPage.jsx / MethodDetail.jsx
│   │   │   ├── ArchitecturesPage.jsx
│   │   │   ├── ToolsPage.jsx
│   │   │   ├── ComparePage.jsx
│   │   │   ├── ToolComparePage.jsx
│   │   │   ├── ExportPage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   └── AdminLoginPage.jsx  # (Final)
│   │   ├── components/
│   │   │   ├── layout/Layout.jsx
│   │   │   ├── MermaidDiagram.jsx
│   │   │   ├── EvaluationForm.jsx
│   │   │   ├── AnnotationSection.jsx  # (Final)
│   │   │   └── ProtectedRoute.jsx     # (Final)
│   │   └── utils/
│   │       ├── api.js              # Axios API client
│   │       └── pdfExport.js        # jsPDF export
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml
```

---

## API Endpoints (21 Total)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/methods/` | List methods — supports `?search=` and `?category=` |
| GET | `/api/v1/methods/{slug}` | Method detail with avg rating |
| POST | `/api/v1/methods/` | Create method |
| PUT | `/api/v1/methods/{slug}` | Update method |
| DELETE | `/api/v1/methods/{slug}` | Delete method |
| GET | `/api/v1/architectures/` | List architectures — supports `?search=` and `?style=` |
| GET | `/api/v1/architectures/{slug}` | Architecture detail with avg rating |
| POST | `/api/v1/architectures/` | Create architecture |
| PUT | `/api/v1/architectures/{slug}` | Update architecture |
| DELETE | `/api/v1/architectures/{slug}` | Delete architecture |
| GET | `/api/v1/tools/` | List tools — supports `?search=` and `?license_type=` |
| GET | `/api/v1/tools/{slug}` | Tool detail with avg rating |
| POST | `/api/v1/tools/` | Create tool |
| PUT | `/api/v1/tools/{slug}` | Update tool |
| DELETE | `/api/v1/tools/{slug}` | Delete tool |
| POST | `/api/v1/evaluations/` | Submit evaluation (6 criteria) |
| GET | `/api/v1/evaluations/` | List evaluations — filter by entity ID |
| POST | `/api/v1/annotations/` | Submit annotation comment |
| GET | `/api/v1/annotations/{type}/{id}` | Get annotations for entity |
| POST | `/api/v1/auth/login` | Admin JWT login |
| GET | `/api/v1/stats` | Platform statistics |

---

## Pages

| Route | Description |
|---|---|
| `/` | Dashboard — statistics and navigation |
| `/methods` | Browse and search design methods |
| `/methods/:slug` | Method detail — diagram, use cases, evaluations, annotations |
| `/architectures` | Browse architecture styles with score bars |
| `/architectures/:slug` | Architecture detail |
| `/compare` | Radar chart comparison of up to 4 architectures |
| `/tools` | Browse tools catalog |
| `/tools/:slug` | Tool detail — evaluations, annotations |
| `/tool-compare` | Side-by-side tool diagram comparison |
| `/export` | Export catalog data as JSON, CSV, or PDF |
| `/admin-login` | JWT authentication for admin access |
| `/admin` | Protected admin panel — add catalog entries |

---

## Catalog (42 Entries)

| Section | Count |
|---|---|
| Design Methods | 12 |
| Architecture Styles | 13 |
| Modeling Tools | 17 |
| **Total** | **42** |

---

## Useful Commands

```bash
# Start services
docker-compose up

# Stop services
docker-compose down

# Reset database (re-seeds automatically on restart)
docker-compose down -v && docker-compose up --build

# View backend logs
docker logs swdesign_backend -f

# View frontend logs
docker logs swdesign_frontend -f
```

---

## Code Statistics (Final Checkpoint)

| Metric | Value |
|---|---|
| Total LOC | 5,343 |
| Frontend LOC | 3,543 (21 files) |
| Backend LOC | 1,800 (19 files) |
| GitHub Commits | 22+ |
| API Endpoints | 21 |
| ORM Models | 5 |

---

## Checkpoint Status

- [x] **Alpha** — Core catalog (browse, search, filter, diagrams, compare, evaluate)
- [x] **Beta** — Export (JSON/CSV/PDF), Admin Panel, Tool Diagram Comparison
- [x] **Final** — JWT Authentication, Collaborative Annotations, Catalog expanded to 42 entries

---

## Admin Credentials

| Field | Value |
|---|---|
| URL (local) | http://localhost:5173/admin-login |
| URL (live) | https://swdesign-frontend.onrender.com/admin-login |
| Username | `admin` |
| Password | `admin123` |

> **Note:** These are prototype credentials. Replace with a secure authentication system before any production use beyond this academic deployment.
