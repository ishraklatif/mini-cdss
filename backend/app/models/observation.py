from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Observation(Base):
    __tablename__ = "observations"

    id                  = Column(String,  primary_key=True, index=True)
    patient_id          = Column(String,  ForeignKey("patients.id"), nullable=False)
    loinc_code          = Column(String(20),  nullable=True)
    display             = Column(String(100), nullable=True)
    value               = Column(Float,       nullable=True)
    value_string        = Column(String(50),  nullable=True)
    unit                = Column(String(30),  nullable=True)
    unit_code           = Column(String(30),  nullable=True)
    effective_datetime  = Column(String(50),  nullable=True)
    status              = Column(String(20),  default="final")
    created_at          = Column(DateTime,    server_default=func.now())

    patient = relationship("Patient", back_populates="observations")