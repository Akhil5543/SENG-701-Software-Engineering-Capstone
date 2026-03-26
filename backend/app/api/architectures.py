from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.core.database import get_db
from app.models.models import Architecture, Evaluation
from app.schemas.schemas import ArchitectureCreate, ArchitectureOut, CompareRequest

router = APIRouter(prefix="/architectures", tags=["Architectures"])


def enrich(arch: Architecture, db: Session) -> dict:
    evals = db.query(Evaluation).filter(Evaluation.architecture_id == arch.id).all()
    avg = round(sum(e.overall for e in evals) / len(evals), 2) if evals else None
    d = {c.name: getattr(arch, c.name) for c in arch.__table__.columns}
    d["avg_overall"] = avg
    d["review_count"] = len(evals)
    return d


@router.get("/", response_model=List[ArchitectureOut])
def list_architectures(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None),
    style: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
):
    q = db.query(Architecture)
    if search:
        q = q.filter(or_(
            Architecture.name.ilike(f"%{search}%"),
            Architecture.description.ilike(f"%{search}%"),
            Architecture.style.ilike(f"%{search}%"),
        ))
    if style:
        q = q.filter(Architecture.style.ilike(f"%{style}%"))
    archs = q.offset(skip).limit(limit).all()
    return [enrich(a, db) for a in archs]


@router.get("/compare", tags=["Architectures"])
def compare_architectures(ids: str = Query(..., description="Comma-separated architecture IDs"), db: Session = Depends(get_db)):
    id_list = [int(i) for i in ids.split(",") if i.strip().isdigit()]
    if len(id_list) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 architecture IDs")
    archs = db.query(Architecture).filter(Architecture.id.in_(id_list)).all()
    result = []
    for a in archs:
        evals = db.query(Evaluation).filter(Evaluation.architecture_id == a.id).all()
        avg = round(sum(e.overall for e in evals) / len(evals), 2) if evals else None
        result.append({
            "id": a.id,
            "name": a.name,
            "style": a.style,
            "scalability_score": a.scalability_score,
            "maintainability_score": a.maintainability_score,
            "complexity_score": a.complexity_score,
            "avg_community_rating": avg,
            "review_count": len(evals),
            "strengths": a.strengths,
            "weaknesses": a.weaknesses,
        })
    return result


@router.get("/{slug}", response_model=ArchitectureOut)
def get_architecture(slug: str, db: Session = Depends(get_db)):
    arch = db.query(Architecture).filter(Architecture.slug == slug).first()
    if not arch:
        raise HTTPException(status_code=404, detail="Architecture not found")
    return enrich(arch, db)


@router.post("/", response_model=ArchitectureOut, status_code=201)
def create_architecture(payload: ArchitectureCreate, db: Session = Depends(get_db)):
    existing = db.query(Architecture).filter(Architecture.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    arch = Architecture(**payload.model_dump())
    db.add(arch)
    db.commit()
    db.refresh(arch)
    return enrich(arch, db)


@router.put("/{slug}", response_model=ArchitectureOut)
def update_architecture(slug: str, payload: ArchitectureCreate, db: Session = Depends(get_db)):
    arch = db.query(Architecture).filter(Architecture.slug == slug).first()
    if not arch:
        raise HTTPException(status_code=404, detail="Architecture not found")
    for k, v in payload.model_dump().items():
        setattr(arch, k, v)
    db.commit()
    db.refresh(arch)
    return enrich(arch, db)


@router.delete("/{slug}", status_code=204)
def delete_architecture(slug: str, db: Session = Depends(get_db)):
    arch = db.query(Architecture).filter(Architecture.slug == slug).first()
    if not arch:
        raise HTTPException(status_code=404, detail="Architecture not found")
    db.delete(arch)
    db.commit()
