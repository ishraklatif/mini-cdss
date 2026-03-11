from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.patient import Patient
from app.models.observation import Observation
from app.services.medication_checker import calculate_news2

router = APIRouter()

@router.get("/{patient_id}/risk-score", response_model=dict)
def get_risk_score(patient_id: str, db: Session = Depends(get_db)):
    """
    Calculate and return NEWS2-based risk score for a patient.
    This endpoint will later be replaced by the ML model predictions.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Get latest vitals from observations
    observations = db.query(Observation).filter(
        Observation.patient_id == patient_id
    ).order_by(Observation.created_at.desc()).all()

    obs_map = {}
    for obs in observations:
        if obs.display and obs.display not in obs_map:
            obs_map[obs.display] = obs.value or 0

    vitals = {
        "hr":   obs_map.get("Heart rate",             patient.news_score),
        "spo2": obs_map.get("Oxygen saturation",      98),
        "temp": obs_map.get("Body temperature",       37.0),
        "rr":   obs_map.get("Respiratory rate",       16),
        "gcs":  obs_map.get("Glasgow coma score total", 15),
    }

    news2 = calculate_news2(vitals)

    if news2 == 0:    risk_level = "low";        response = "Routine monitoring"
    elif news2 <= 4:  risk_level = "low-medium"; response = "Increase frequency of monitoring"
    elif news2 <= 6:  risk_level = "medium";     response = "Urgent review by ward clinician"
    else:             risk_level = "high";       response = "Emergency assessment — consider ICU"

    return {
        "patient_id":     patient_id,
        "news2_score":    news2,
        "risk_level":     risk_level,
        "clinical_response": response,
        "vitals_used":    vitals,
        "fhir_resource":  "RiskAssessment",
        "note":           "ML model integration coming in Phase 4",
    }