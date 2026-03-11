from pydantic import BaseModel
from typing import Optional

class MedicationCreate(BaseModel):
    id:          str
    patient_id:  str
    name:        str
    snomed_code: Optional[str] = None
    route:       Optional[str] = None
    freq:        Optional[str] = None
    dose:        Optional[str] = None
    status:      Optional[str] = "active"
    alert:       Optional[str] = None
    authored_on: Optional[str] = None

class AllergyCreate(BaseModel):
    id:          str
    patient_id:  str
    substance:   str
    snomed_code: Optional[str] = None
    criticality: Optional[str] = "high"
    status:      Optional[str] = "active"

class MedicationResponse(MedicationCreate):
    class Config:
        from_attributes = True

class AllergyResponse(AllergyCreate):
    class Config:
        from_attributes = True