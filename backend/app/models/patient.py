from sqlalchemy import Column, String, Integer, Date, DateTime, Float, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class PatientStatus(str, enum.Enum):
    critical = "critical"
    at_risk  = "at-risk"
    stable   = "stable"

class Patient(Base):
    __tablename__ = "patients"

    id             = Column(String,      primary_key=True, index=True)
    first_name     = Column(String(100), nullable=False)
    last_name      = Column(String(100), nullable=False)
    age            = Column(Integer,     nullable=False)
    gender         = Column(String(20),  nullable=True)
    birth_date     = Column(String(20),  nullable=True)
    ward           = Column(String(100), nullable=False)
    bed            = Column(String(20),  nullable=False)
    status         = Column(String(20),  nullable=False, default="stable")
    news_score     = Column(Integer,     nullable=False, default=0)
    admitted_date  = Column(String(50),  nullable=True)
    diagnosis      = Column(Text,        nullable=True)
    consultant     = Column(String(100), nullable=True)
    fhir_id        = Column(String(100), nullable=True)
    created_at     = Column(DateTime,    server_default=func.now())
    updated_at     = Column(DateTime,    server_default=func.now(), onupdate=func.now())

    # Relationships
    observations   = relationship("Observation",       back_populates="patient", cascade="all, delete-orphan")
    medications    = relationship("Medication",        back_populates="patient", cascade="all, delete-orphan")
    allergies      = relationship("Allergy",           back_populates="patient", cascade="all, delete-orphan")
    alerts         = relationship("Alert",             back_populates="patient", cascade="all, delete-orphan")