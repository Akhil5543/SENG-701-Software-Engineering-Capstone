from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine
from app.models.models import Base
from app.api import methods, architectures, tools, evaluations, export
from app.schemas.schemas import StatsOut
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.models import DesignMethod, Architecture, Tool, Evaluation

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Software Design Tool API",
    description="Repository and evaluation platform for software design and architecture methods and tools. Beta v2.0",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(methods.router, prefix="/api/v1")
app.include_router(architectures.router, prefix="/api/v1")
app.include_router(tools.router, prefix="/api/v1")
app.include_router(evaluations.router, prefix="/api/v1")
app.include_router(export.router, prefix="/api/v1")


@app.get("/", tags=["Health"])
def root():
    return {
        "message": "Software Design Tool API",
        "version": "2.0.0",
        "docs": "/docs",
        "phase": "Beta"
    }


@app.get("/api/v1/stats", response_model=StatsOut, tags=["Stats"])
def get_stats():
    db: Session = SessionLocal()
    try:
        return StatsOut(
            total_methods=db.query(DesignMethod).count(),
            total_architectures=db.query(Architecture).count(),
            total_tools=db.query(Tool).count(),
            total_evaluations=db.query(Evaluation).count(),
        )
    finally:
        db.close()


@app.on_event("startup")
async def on_startup():
    try:
        Base.metadata.create_all(bind=engine)
        from app.seed import seed
        seed()
    except Exception as e:
        print(f"Startup warning: {e}")
