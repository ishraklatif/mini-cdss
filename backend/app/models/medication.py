from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Medication(Base):
    __tablename__ = "medications"

    id           = Column(String,      primary_key=True, index=True)
    patient_id   = Column(String,      ForeignKey("patients.id"), nullable=False)
    name         = Column(String(200), nullable=False)
    snomed_code  = Column(String(50),  nullable=True)
    route        = Column(String(50),  nullable=True)
    freq         = Column(String(50),  nullable=True)
    dose         = Column(String(100), nullable=True)
    status       = Column(String(20),  default="active")
    alert        = Column(String(20),  nullable=True)
    authored_on  = Column(String(50),  nullable=True)
    created_at   = Column(DateTime,    server_default=func.now())

    patient = relationship("Patient", back_populates="medications")

class Allergy(Base):
    __tablename__ = "allergies"

    id           = Column(String,      primary_key=True, index=True)
    patient_id   = Column(String,      ForeignKey("patients.id"), nullable=False)
    substance    = Column(String(200), nullable=False)
    snomed_code  = Column(String(50),  nullable=True)
    criticality  = Column(String(20),  default="high")
    status       = Column(String(20),  default="active")
    created_at   = Column(DateTime,    server_default=func.now())

    patient = relationship("Patient", back_populates="allergies")