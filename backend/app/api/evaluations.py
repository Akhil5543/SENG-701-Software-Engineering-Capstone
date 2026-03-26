from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.models import Evaluation
from app.schemas.schemas import EvaluationCreate, EvaluationOut

router = APIRouter(prefix="/evaluations", tags=["Evaluations"])


@router.get("/", response_model=List[EvaluationOut])
def list_evaluations(
    db: Session = Depends(get_db),
    method_id: Optional[int] = Query(None),
    architecture_id: Optional[int] = Query(None),
    tool_id: Optional[int] = Query(None),
    skip: int = 0,
    limit: int = 50,
):
    q = db.query(Evaluation)
    if method_id:
        q = q.filter(Evaluation.design_method_id == method_id)
    if architecture_id:
        q = q.filter(Evaluation.architecture_id == architecture_id)
    if tool_id:
        q = q.filter(Evaluation.tool_id == tool_id)
    return q.order_by(Evaluation.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/", response_model=EvaluationOut, status_code=201)
def create_evaluation(payload: EvaluationCreate, db: Session = Depends(get_db)):
    # Validate exactly one target is set
    targets = [payload.design_method_id, payload.architecture_id, payload.tool_id]
    if sum(1 for t in targets if t is not None) != 1:
        raise HTTPException(status_code=400, detail="Evaluation must target exactly one of: design_method_id, architecture_id, tool_id")
    evaluation = Evaluation(**payload.model_dump())
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)
    return evaluation


@router.delete("/{evaluation_id}", status_code=204)
def delete_evaluation(evaluation_id: int, db: Session = Depends(get_db)):
    ev = db.query(Evaluation).filter(Evaluation.id == evaluation_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    db.delete(ev)
    db.commit()
