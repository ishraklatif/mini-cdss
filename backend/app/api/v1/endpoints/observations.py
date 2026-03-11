from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.observation import Observation
from app.models.patient import Patient
from app.schemas.observation import ObservationCreate, ObservationResponse
import uuid

router = APIRouter()

@router.get("/{patient_id}/observations", response_model=List[dict])
def get_observations(patient_id: str, db: Session = Depends(get_db)):
    """Get all observations for a patient."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    observations = db.query(Observation).filter(Observation.patient_id == patient_id).all()
    return [
        {
            "id":                 o.id,
            "loinc_code":         o.loinc_code,
            "display":            o.display,
            "value":              o.value,
            "value_string":       o.value_string,
            "unit":               o.unit,
            "effective_datetime": o.effective_datetime,
            "status":             o.status,
        }
        for o in observations
    ]

@router.get("/{patient_id}/observations/latest", response_model=dict)
def get_latest_observations(patient_id: str, db: Session = Depends(get_db)):
    """Get the latest value for each vital type."""
    observations = db.query(Observation).filter(
        Observation.patient_id == patient_id
    ).order_by(Observation.created_at.desc()).all()

    latest = {}
    for obs in observations:
        if obs.display and obs.display not in latest:
            latest[obs.display] = {
                "loinc_code":  obs.loinc_code,
                "display":     obs.display,
                "value":       obs.value,
                "value_string":obs.value_string,
                "unit":        obs.unit,
                "datetime":    obs.effective_datetime,
            }
    return latest

@router.post("/{patient_id}/observations", status_code=201)
def create_observation(patient_id: str, data: ObservationCreate, db: Session = Depends(get_db)):
    """Record a new observation for a patient."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    obs = Observation(
        id         = data.id or str(uuid.uuid4()),
        patient_id = patient_id,
        **{k: v for k, v in data.model_dump().items() if k not in ["id", "patient_id"]}
    )
    db.add(obs)
    db.commit()
    return {"message": "Observation recorded", "id": obs.id}