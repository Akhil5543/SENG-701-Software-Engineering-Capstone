from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


# ─── Design Method Schemas ───────────────────────────────────────────────────

class DesignMethodBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    use_cases: Optional[str] = None
    diagram_type: Optional[str] = None
    diagram_example: Optional[str] = None
    case_study: Optional[str] = None
    tags: Optional[List[str]] = []
    academic_standard: Optional[bool] = False
    industry_standard: Optional[bool] = True


class DesignMethodCreate(DesignMethodBase):
    slug: str


class DesignMethodOut(DesignMethodBase):
    id: int
    slug: str
    created_at: datetime
    avg_overall: Optional[float] = None
    review_count: Optional[int] = 0

    class Config:
        from_attributes = True


# ─── Architecture Schemas ─────────────────────────────────────────────────────

class ArchitectureBase(BaseModel):
    name: str
    style: str
    description: Optional[str] = None
    strengths: Optional[List[str]] = []
    weaknesses: Optional[List[str]] = []
    use_cases: Optional[List[str]] = []
    diagram_example: Optional[str] = None
    case_study: Optional[str] = None
    scalability_score: Optional[float] = 0.0
    maintainability_score: Optional[float] = 0.0
    complexity_score: Optional[float] = 0.0
    tags: Optional[List[str]] = []


class ArchitectureCreate(ArchitectureBase):
    slug: str


class ArchitectureOut(ArchitectureBase):
    id: int
    slug: str
    created_at: datetime
    avg_overall: Optional[float] = None
    review_count: Optional[int] = 0

    class Config:
        from_attributes = True


# ─── Tool Schemas ─────────────────────────────────────────────────────────────

class ToolBase(BaseModel):
    name: str
    vendor: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    website_url: Optional[str] = None
    license_type: Optional[str] = None
    cost_info: Optional[str] = None
    platforms: Optional[List[str]] = []
    supported_methods: Optional[List[str]] = []
    supported_notations: Optional[List[str]] = []
    screenshot_url: Optional[str] = None
    tags: Optional[List[str]] = []


class ToolCreate(ToolBase):
    slug: str


class ToolOut(ToolBase):
    id: int
    slug: str
    created_at: datetime
    avg_overall: Optional[float] = None
    review_count: Optional[int] = 0

    class Config:
        from_attributes = True


# ─── Evaluation Schemas ───────────────────────────────────────────────────────

class EvaluationBase(BaseModel):
    reviewer_name: Optional[str] = "Anonymous"
    reviewer_role: Optional[str] = None
    usability: float = Field(..., ge=1, le=5)
    scalability: float = Field(..., ge=1, le=5)
    cost_value: float = Field(..., ge=1, le=5)
    interoperability: float = Field(..., ge=1, le=5)
    documentation: float = Field(..., ge=1, le=5)
    overall: float = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class EvaluationCreate(EvaluationBase):
    design_method_id: Optional[int] = None
    architecture_id: Optional[int] = None
    tool_id: Optional[int] = None


class EvaluationOut(EvaluationBase):
    id: int
    design_method_id: Optional[int]
    architecture_id: Optional[int]
    tool_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Search / Filter Schemas ──────────────────────────────────────────────────

class SearchParams(BaseModel):
    query: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = []
    license_type: Optional[str] = None
    min_rating: Optional[float] = None


class CompareRequest(BaseModel):
    architecture_ids: List[int] = Field(..., min_length=2, max_length=4)
    criteria: Optional[List[str]] = ["scalability_score", "maintainability_score", "complexity_score"]


class StatsOut(BaseModel):
    total_methods: int
    total_architectures: int
    total_tools: int
    total_evaluations: int
