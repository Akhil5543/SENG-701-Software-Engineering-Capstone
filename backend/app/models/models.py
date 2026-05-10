from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class CategoryEnum(str, enum.Enum):
    design_method = "design_method"
    architecture = "architecture"
    tool = "tool"


class DesignMethod(Base):
    __tablename__ = "design_methods"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    slug = Column(String(200), unique=True, nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text)
    use_cases = Column(Text)
    diagram_type = Column(String(100))
    diagram_example = Column(Text)
    case_study = Column(Text)
    tags = Column(JSON, default=list)
    academic_standard = Column(Boolean, default=False)
    industry_standard = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    evaluations = relationship("Evaluation", back_populates="design_method", cascade="all, delete")
    annotations = relationship("Annotation", back_populates="design_method", cascade="all, delete")


class Architecture(Base):
    __tablename__ = "architectures"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    slug = Column(String(200), unique=True, nullable=False)
    style = Column(String(100), nullable=False)
    description = Column(Text)
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    use_cases = Column(JSON, default=list)
    diagram_example = Column(Text)
    case_study = Column(Text)
    scalability_score = Column(Float, default=0.0)
    maintainability_score = Column(Float, default=0.0)
    complexity_score = Column(Float, default=0.0)
    tags = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    evaluations = relationship("Evaluation", back_populates="architecture", cascade="all, delete")
    annotations = relationship("Annotation", back_populates="architecture", cascade="all, delete")


class Tool(Base):
    __tablename__ = "tools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    slug = Column(String(200), unique=True, nullable=False)
    vendor = Column(String(200))
    category = Column(String(100))
    description = Column(Text)
    website_url = Column(String(500))
    license_type = Column(String(100))
    cost_info = Column(String(300))
    platforms = Column(JSON, default=list)
    supported_methods = Column(JSON, default=list)
    supported_notations = Column(JSON, default=list)
    screenshot_url = Column(String(500))
    tags = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    evaluations = relationship("Evaluation", back_populates="tool", cascade="all, delete")
    annotations = relationship("Annotation", back_populates="tool", cascade="all, delete")


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    reviewer_name = Column(String(200), default="Anonymous")
    reviewer_role = Column(String(100))

    design_method_id = Column(Integer, ForeignKey("design_methods.id"), nullable=True)
    architecture_id = Column(Integer, ForeignKey("architectures.id"), nullable=True)
    tool_id = Column(Integer, ForeignKey("tools.id"), nullable=True)

    usability = Column(Float, nullable=False)
    scalability = Column(Float, nullable=False)
    cost_value = Column(Float, nullable=False)
    interoperability = Column(Float, nullable=False)
    documentation = Column(Float, nullable=False)
    overall = Column(Float, nullable=False)

    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    design_method = relationship("DesignMethod", back_populates="evaluations")
    architecture = relationship("Architecture", back_populates="evaluations")
    tool = relationship("Tool", back_populates="evaluations")


class Annotation(Base):
    __tablename__ = "annotations"

    id = Column(Integer, primary_key=True, index=True)
    author_name = Column(String(200), default="Anonymous")
    content = Column(Text, nullable=False)

    # Polymorphic FK — only one set per annotation
    design_method_id = Column(Integer, ForeignKey("design_methods.id"), nullable=True)
    architecture_id = Column(Integer, ForeignKey("architectures.id"), nullable=True)
    tool_id = Column(Integer, ForeignKey("tools.id"), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    design_method = relationship("DesignMethod", back_populates="annotations")
    architecture = relationship("Architecture", back_populates="annotations")
    tool = relationship("Tool", back_populates="annotations")
