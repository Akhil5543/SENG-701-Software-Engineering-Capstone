from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.core.database import get_db
from app.models.models import Annotation, DesignMethod, Architecture, Tool

router = APIRouter(prefix="/annotations", tags=["annotations"])


# ── Schemas ───────────────────────────────────────────────────────────────────
class AnnotationCreate(BaseModel):
    author_name: Optional[str] = "Anonymous"
    content: str
    design_method_id: Optional[int] = None
    architecture_id: Optional[int] = None
    tool_id: Optional[int] = None


class AnnotationOut(BaseModel):
    id: int
    author_name: str
    content: str
    design_method_id: Optional[int] = None
    architecture_id: Optional[int] = None
    tool_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("/", response_model=AnnotationOut, status_code=201)
def create_annotation(payload: AnnotationCreate, db: Session = Depends(get_db)):
    # Validate at least one FK is set
    if not any([payload.design_method_id, payload.architecture_id, payload.tool_id]):
        raise HTTPException(status_code=400, detail="Must provide design_method_id, architecture_id, or tool_id")

    if not payload.content or not payload.content.strip():
        raise HTTPException(status_code=400, detail="Annotation content cannot be empty")

    annotation = Annotation(
        author_name=payload.author_name or "Anonymous",
        content=payload.content.strip(),
        design_method_id=payload.design_method_id,
        architecture_id=payload.architecture_id,
        tool_id=payload.tool_id,
    )
    db.add(annotation)
    db.commit()
    db.refresh(annotation)
    return annotation


@router.get("/method/{method_id}", response_model=List[AnnotationOut])
def get_method_annotations(method_id: int, db: Session = Depends(get_db)):
    return db.query(Annotation).filter(
        Annotation.design_method_id == method_id
    ).order_by(Annotation.created_at.desc()).all()


@router.get("/architecture/{arch_id}", response_model=List[AnnotationOut])
def get_architecture_annotations(arch_id: int, db: Session = Depends(get_db)):
    return db.query(Annotation).filter(
        Annotation.architecture_id == arch_id
    ).order_by(Annotation.created_at.desc()).all()


@router.get("/tool/{tool_id}", response_model=List[AnnotationOut])
def get_tool_annotations(tool_id: int, db: Session = Depends(get_db)):
    return db.query(Annotation).filter(
        Annotation.tool_id == tool_id
    ).order_by(Annotation.created_at.desc()).all()


@router.delete("/{annotation_id}", status_code=204)
def delete_annotation(annotation_id: int, db: Session = Depends(get_db)):
    annotation = db.query(Annotation).filter(Annotation.id == annotation_id).first()
    if not annotation:
        raise HTTPException(status_code=404, detail="Annotation not found")
    db.delete(annotation)
    db.commit()
