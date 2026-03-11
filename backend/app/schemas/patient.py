from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class VitalsSchema(BaseModel):
    hr:   int
    bp:   str
    spo2: int
    temp: float
    rr:   int
    gcs:  int

class VitalsHistorySchema(BaseModel):
    time: str
    hr:   int
    spo2: int
    rr:   int

class MedicationSchema(BaseModel):
    id:    Optional[str] = None
    name:  str
    route: str
    freq:  str
    dose:  Optional[str] = None
    alert: Optional[str] = None

    class Config:
        from_attributes = True

class AllergySchema(BaseModel):
    id:          Optional[str] = None
    substance:   str
    criticality: Optional[str] = "high"
    status:      Optional[str] = "active"

    class Config:
        from_attributes = True

class AlertSchema(BaseModel):
    id:           Optional[str] = None
    severity:     str
    msg:          Optional[str] = None
    message:      Optional[str] = None
    acknowledged: Optional[bool] = False

    class Config:
        from_attributes = True

class PatientBase(BaseModel):
    id:            str
    first_name:    str
    last_name:     str
    age:           int
    ward:          str
    bed:           str
    status:        str
    news_score:    int
    admitted_date: Optional[str] = None
    diagnosis:     Optional[str] = None
    consultant:    Optional[str] = None

class PatientResponse(BaseModel):
    """Frontend-friendly patient response matching mock data shape."""
    id:             str
    name:           str
    age:            int
    ward:           str
    bed:            str
    status:         str
    newsScore:      int
    admittedDate:   Optional[str]   = None
    diagnosis:      Optional[str]   = None
    consultant:     Optional[str]   = None
    allergies:      List[str]       = []
    vitals:         Optional[dict]  = None
    vitalsHistory:  List[dict]      = []
    medications:    List[dict]      = []
    alerts:         List[dict]      = []

    class Config:
        from_attributes = True

class PatientCreate(BaseModel):
    id:            str
    first_name:    str
    last_name:     str
    age:           int
    gender:        Optional[str] = "unknown"
    birth_date:    Optional[str] = None
    ward:          str
    bed:           str
    status:        Optional[str] = "stable"
    news_score:    Optional[int] = 0
    admitted_date: Optional[str] = None
    diagnosis:     Optional[str] = None
    consultant:    Optional[str] = None