from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
from app.core.database import get_db
from app.models.models import DesignMethod, Evaluation
from app.schemas.schemas import DesignMethodCreate, DesignMethodOut

router = APIRouter(prefix="/methods", tags=["Design Methods"])


def enrich(method: DesignMethod, db: Session) -> dict:
    evals = db.query(Evaluation).filter(Evaluation.design_method_id == method.id).all()
    avg = round(sum(e.overall for e in evals) / len(evals), 2) if evals else None
    d = {c.name: getattr(method, c.name) for c in method.__table__.columns}
    d["avg_overall"] = avg
    d["review_count"] = len(evals)
    return d


@router.get("/", response_model=List[DesignMethodOut])
def list_methods(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
):
    q = db.query(DesignMethod)
    if search:
        q = q.filter(or_(
            DesignMethod.name.ilike(f"%{search}%"),
            DesignMethod.description.ilike(f"%{search}%"),
            DesignMethod.category.ilike(f"%{search}%"),
        ))
    if category:
        q = q.filter(DesignMethod.category.ilike(f"%{category}%"))
    methods = q.offset(skip).limit(limit).all()
    return [enrich(m, db) for m in methods]


@router.get("/{slug}", response_model=DesignMethodOut)
def get_method(slug: str, db: Session = Depends(get_db)):
    method = db.query(DesignMethod).filter(DesignMethod.slug == slug).first()
    if not method:
        raise HTTPException(status_code=404, detail="Design method not found")
    return enrich(method, db)


@router.post("/", response_model=DesignMethodOut, status_code=201)
def create_method(payload: DesignMethodCreate, db: Session = Depends(get_db)):
    existing = db.query(DesignMethod).filter(DesignMethod.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    method = DesignMethod(**payload.model_dump())
    db.add(method)
    db.commit()
    db.refresh(method)
    return enrich(method, db)


@router.put("/{slug}", response_model=DesignMethodOut)
def update_method(slug: str, payload: DesignMethodCreate, db: Session = Depends(get_db)):
    method = db.query(DesignMethod).filter(DesignMethod.slug == slug).first()
    if not method:
        raise HTTPException(status_code=404, detail="Design method not found")
    for k, v in payload.model_dump().items():
        setattr(method, k, v)
    db.commit()
    db.refresh(method)
    return enrich(method, db)


@router.delete("/{slug}", status_code=204)
def delete_method(slug: str, db: Session = Depends(get_db)):
    method = db.query(DesignMethod).filter(DesignMethod.slug == slug).first()
    if not method:
        raise HTTPException(status_code=404, detail="Design method not found")
    db.delete(method)
    db.commit()
