from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.database import engine, Base, get_db
from app.api import methods, architectures, tools, evaluations
from app.api.auth import router as auth_router
from app.api.annotations import router as annotations_router
from app.models.models import DesignMethod, Architecture, Tool, Evaluation
from app.seed import seed

app = FastAPI(
    title="SW Design Tool Platform API",
    description="UMBC SENG 701 Capstone — Software Design Tool Platform",
    version="2.0.0-final",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(methods.router, prefix="/api/v1")
app.include_router(architectures.router, prefix="/api/v1")
app.include_router(tools.router, prefix="/api/v1")
app.include_router(evaluations.router, prefix="/api/v1")
app.include_router(annotations_router, prefix="/api/v1")


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    seed()


@app.get("/")
def root():
    return {"message": "SW Design Tool Platform API", "version": "2.0.0-final", "docs": "/docs"}


@app.get("/api/v1/stats")
def get_stats(db: Session = Depends(get_db)):
    return {
        "total_methods": db.query(DesignMethod).count(),
        "total_architectures": db.query(Architecture).count(),
        "total_tools": db.query(Tool).count(),
        "total_evaluations": db.query(Evaluation).count(),
    }
