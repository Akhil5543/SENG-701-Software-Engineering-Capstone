from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api import methods, architectures, tools, evaluations
from app.api.auth import router as auth_router
from app.seed import seed

app = FastAPI(
    title="SW Design Tool Platform API",
    description="UMBC SENG 701 Capstone — Software Design Tool Platform",
    version="2.0.0-beta",
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
app.include_router(methods.router)
app.include_router(architectures.router)
app.include_router(tools.router)
app.include_router(evaluations.router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    seed()


@app.get("/")
def root():
    return {"message": "SW Design Tool Platform API", "version": "2.0.0-beta", "docs": "/docs"}
