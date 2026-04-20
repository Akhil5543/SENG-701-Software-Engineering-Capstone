"""
Export router — R9 Beta feature
Supports CSV and JSON export of design methods, architectures, tools, and evaluations
"""
import csv
import json
import io
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse, JSONResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import DesignMethod, Architecture, Tool, Evaluation

router = APIRouter(prefix="/export", tags=["Export"])


# ─── JSON Exports ───────────────────────────────────────

@router.get("/methods/json", summary="Export all design methods as JSON")
def export_methods_json(db: Session = Depends(get_db)):
    methods = db.query(DesignMethod).all()
    data = [
        {
            "id": m.id,
            "name": m.name,
            "slug": m.slug,
            "category": m.category,
            "description": m.description,
            "tags": m.tags or [],
            "academic_standard": m.academic_standard,
            "use_cases": m.use_cases,
            "case_study": m.case_study,
            "diagram_example": m.diagram_example,
            "created_at": str(m.created_at),
        }
        for m in methods
    ]
    return JSONResponse(content={"count": len(data), "data": data})


@router.get("/architectures/json", summary="Export all architectures as JSON")
def export_architectures_json(db: Session = Depends(get_db)):
    archs = db.query(Architecture).all()
    data = [
        {
            "id": a.id,
            "name": a.name,
            "slug": a.slug,
            "style": a.style,
            "description": a.description,
            "strengths": a.strengths or [],
            "weaknesses": a.weaknesses or [],
            "scalability_score": a.scalability_score,
            "maintainability_score": a.maintainability_score,
            "complexity_score": a.complexity_score,
            "use_cases": a.use_cases,
            "diagram_example": a.diagram_example,
            "created_at": str(a.created_at),
        }
        for a in archs
    ]
    return JSONResponse(content={"count": len(data), "data": data})


@router.get("/tools/json", summary="Export all tools as JSON")
def export_tools_json(db: Session = Depends(get_db)):
    tools = db.query(Tool).all()
    data = [
        {
            "id": t.id,
            "name": t.name,
            "slug": t.slug,
            "vendor": t.vendor,
            "description": t.description,
            "license_type": t.license_type,
            "cost_info": t.cost_info,
            "platforms": t.platforms or [],
            "supported_methods": t.supported_methods or [],
            "supported_notations": t.supported_notations or [],
            "created_at": str(t.created_at),
        }
        for t in tools
    ]
    return JSONResponse(content={"count": len(data), "data": data})


@router.get("/evaluations/json", summary="Export all evaluations as JSON")
def export_evaluations_json(db: Session = Depends(get_db)):
    evals = db.query(Evaluation).all()
    data = [
        {
            "id": e.id,
            "reviewer_name": e.reviewer_name,
            "reviewer_role": e.reviewer_role,
            "design_method_id": e.design_method_id,
            "architecture_id": e.architecture_id,
            "tool_id": e.tool_id,
            "usability": e.usability,
            "scalability": e.scalability,
            "cost_value": e.cost_value,
            "interoperability": e.interoperability,
            "documentation": e.documentation,
            "overall": e.overall,
            "comment": e.comment,
            "created_at": str(e.created_at),
        }
        for e in evals
    ]
    return JSONResponse(content={"count": len(data), "data": data})


# ─── CSV Exports ───────────────────────────────────────

@router.get("/methods/csv", summary="Export all design methods as CSV")
def export_methods_csv(db: Session = Depends(get_db)):
    methods = db.query(DesignMethod).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "name", "slug", "category", "description", "tags", "academic_standard", "use_cases"])
    for m in methods:
        writer.writerow([m.id, m.name, m.slug, m.category, m.description,
                         "|".join(m.tags or []), m.academic_standard, m.use_cases])
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=design_methods.csv"}
    )


@router.get("/architectures/csv", summary="Export all architectures as CSV")
def export_architectures_csv(db: Session = Depends(get_db)):
    archs = db.query(Architecture).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "name", "slug", "style", "description", "scalability_score",
                     "maintainability_score", "complexity_score", "strengths", "weaknesses", "use_cases"])
    for a in archs:
        writer.writerow([a.id, a.name, a.slug, a.style, a.description,
                         a.scalability_score, a.maintainability_score, a.complexity_score,
                         "|".join(a.strengths or []), "|".join(a.weaknesses or []), a.use_cases])
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=architectures.csv"}
    )


@router.get("/tools/csv", summary="Export all tools as CSV")
def export_tools_csv(db: Session = Depends(get_db)):
    tools = db.query(Tool).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "name", "slug", "vendor", "license_type", "cost_info", "platforms", "supported_methods"])
    for t in tools:
        writer.writerow([t.id, t.name, t.slug, t.vendor, t.license_type, t.cost_info,
                         "|".join(t.platforms or []), "|".join(t.supported_methods or [])])
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=tools.csv"}
    )


@router.get("/evaluations/csv", summary="Export all evaluations as CSV")
def export_evaluations_csv(db: Session = Depends(get_db)):
    evals = db.query(Evaluation).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "reviewer_name", "reviewer_role", "design_method_id", "architecture_id",
                     "tool_id", "usability", "scalability", "cost_value", "interoperability",
                     "documentation", "overall", "comment", "created_at"])
    for e in evals:
        writer.writerow([e.id, e.reviewer_name, e.reviewer_role, e.design_method_id,
                         e.architecture_id, e.tool_id, e.usability, e.scalability,
                         e.cost_value, e.interoperability, e.documentation, e.overall,
                         e.comment, e.created_at])
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=evaluations.csv"}
    )


