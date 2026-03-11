from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id             = Column(String,  primary_key=True, index=True)
    patient_id     = Column(String,  ForeignKey("patients.id"), nullable=False)
    severity       = Column(String(20),  nullable=False)
    message        = Column(Text,        nullable=False)
    code           = Column(String(50),  nullable=True)
    alert_type     = Column(String(50),  nullable=True)
    acknowledged   = Column(Boolean,     default=False)
    acknowledged_by = Column(String(100), nullable=True)
    created_at     = Column(DateTime,    server_default=func.now())
    updated_at     = Column(DateTime,    server_default=func.now(), onupdate=func.now())

    patient = relationship("Patient", back_populates="alerts")