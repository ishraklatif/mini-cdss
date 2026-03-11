from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.medication import Medication, Allergy
from app.models.patient import Patient
from app.schemas.medication import MedicationCreate, AllergyCreate
from app.services.medication_checker import check_drug_interactions
from app.services.allergy_checker import check_allergy_conflicts
import uuid

router = APIRouter()

@router.get("/{patient_id}/medications", response_model=List[dict])
def get_medications(patient_id: str, db: Session = Depends(get_db)):
    """Get all medications for a patient."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return [
        {"id": m.id, "name": m.name, "route": m.route, "freq": m.freq, "dose": m.dose, "status": m.status, "alert": m.alert}
        for m in patient.medications
    ]

@router.get("/{patient_id}/medications/alerts", response_model=List[dict])
def get_medication_alerts(patient_id: str, db: Session = Depends(get_db)):
    """
    Run drug interaction + allergy checks for a patient.
    Returns list of CDS alerts — mirrors UpToDate Lexicomp logic.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    medications = [{"name": m.name} for m in patient.medications]
    allergies   = [a.substance for a in patient.allergies]

    drug_alerts    = check_drug_interactions(medications)
    allergy_alerts = check_allergy_conflicts(allergies, medications)

    return drug_alerts + allergy_alerts

@router.post("/{patient_id}/medications", status_code=201)
def prescribe_medication(patient_id: str, data: MedicationCreate, db: Session = Depends(get_db)):
    """Prescribe a new medication to a patient."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Run safety checks before saving
    existing_meds  = [{"name": m.name} for m in patient.medications]
    new_med        = [{"name": data.name}]
    allergies      = [a.substance for a in patient.allergies]

    drug_alerts    = check_drug_interactions(existing_meds + new_med)
    allergy_alerts = check_allergy_conflicts(allergies, new_med)
    all_alerts     = drug_alerts + allergy_alerts

    med = Medication(
        id         = data.id or str(uuid.uuid4()),
        patient_id = patient_id,
        name       = data.name,
        route      = data.route,
        freq       = data.freq,
        dose       = data.dose,
        alert      = all_alerts[0]["severity"] if all_alerts else None,
    )
    db.add(med)
    db.commit()

    return {
        "message": "Medication prescribed",
        "id":      med.id,
        "alerts":  all_alerts,
    }