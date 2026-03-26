from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.core.database import get_db
from app.models.models import Tool, Evaluation
from app.schemas.schemas import ToolCreate, ToolOut

router = APIRouter(prefix="/tools", tags=["Tools"])


def enrich(tool: Tool, db: Session) -> dict:
    evals = db.query(Evaluation).filter(Evaluation.tool_id == tool.id).all()
    avg = round(sum(e.overall for e in evals) / len(evals), 2) if evals else None
    d = {c.name: getattr(tool, c.name) for c in tool.__table__.columns}
    d["avg_overall"] = avg
    d["review_count"] = len(evals)
    return d


@router.get("/", response_model=List[ToolOut])
def list_tools(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    license_type: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
):
    q = db.query(Tool)
    if search:
        q = q.filter(or_(
            Tool.name.ilike(f"%{search}%"),
            Tool.description.ilike(f"%{search}%"),
            Tool.vendor.ilike(f"%{search}%"),
        ))
    if category:
        q = q.filter(Tool.category.ilike(f"%{category}%"))
    if license_type:
        q = q.filter(Tool.license_type.ilike(f"%{license_type}%"))
    tools = q.offset(skip).limit(limit).all()
    return [enrich(t, db) for t in tools]


@router.get("/{slug}", response_model=ToolOut)
def get_tool(slug: str, db: Session = Depends(get_db)):
    tool = db.query(Tool).filter(Tool.slug == slug).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    return enrich(tool, db)


@router.post("/", response_model=ToolOut, status_code=201)
def create_tool(payload: ToolCreate, db: Session = Depends(get_db)):
    existing = db.query(Tool).filter(Tool.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    tool = Tool(**payload.model_dump())
    db.add(tool)
    db.commit()
    db.refresh(tool)
    return enrich(tool, db)


@router.put("/{slug}", response_model=ToolOut)
def update_tool(slug: str, payload: ToolCreate, db: Session = Depends(get_db)):
    tool = db.query(Tool).filter(Tool.slug == slug).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    for k, v in payload.model_dump().items():
        setattr(tool, k, v)
    db.commit()
    db.refresh(tool)
    return enrich(tool, db)


@router.delete("/{slug}", status_code=204)
def delete_tool(slug: str, db: Session = Depends(get_db)):
    tool = db.query(Tool).filter(Tool.slug == slug).first()
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    db.delete(tool)
    db.commit()
