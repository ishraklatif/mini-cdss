from pydantic import BaseModel
from typing import Optional

class ObservationCreate(BaseModel):
    id:                 str
    patient_id:         str
    loinc_code:         Optional[str]   = None
    display:            Optional[str]   = None
    value:              Optional[float] = None
    value_string:       Optional[str]   = None
    unit:               Optional[str]   = None
    unit_code:          Optional[str]   = None
    effective_datetime: Optional[str]   = None
    status:             Optional[str]   = "final"

class ObservationResponse(ObservationCreate):
    class Config:
        from_attributes = True