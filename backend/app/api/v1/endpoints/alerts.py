from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.alert import Alert
from app.models.patient import Patient
from app.models.medication import Medication, Allergy
from app.services.medication_checker import check_drug_interactions
from app.services.allergy_checker import check_allergy_conflicts
import uuid

router = APIRouter()

@router.get("/{patient_id}/alerts", response_model=List[dict])
def get_alerts(patient_id: str, db: Session = Depends(get_db)):
    """Get all active alerts for a patient."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    alerts = db.query(Alert).filter(
        Alert.patient_id  == patient_id,
        Alert.acknowledged == False
    ).all()

    return [
        {"id": a.id, "severity": a.severity, "msg": a.message, "type": a.alert_type}
        for a in alerts
    ]

@router.post("/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str, clinician: str = "Unknown", db: Session = Depends(get_db)):
    """Clinician acknowledges and dismisses an alert."""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.acknowledged    = True
    alert.acknowledged_by = clinician
    db.commit()

    return {"message": "Alert acknowledged", "alert_id": alert_id}

@router.post("/{patient_id}/alerts/regenerate", response_model=List[dict])
def regenerate_alerts(patient_id: str, db: Session = Depends(get_db)):
    """
    Re-run CDS engine for a patient — regenerates all alerts.
    Mirrors Alcidion Miya Logic real-time CDS rule execution.
    """
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Clear old unacknowledged alerts
    db.query(Alert).filter(Alert.patient_id == patient_id, Alert.acknowledged == False).delete()

    medications = [{"name": m.name} for m in patient.medications]
    allergies   = [a.substance for a in patient.allergies]

    new_alerts  = check_drug_interactions(medications) + check_allergy_conflicts(allergies, medications)

    saved = []
    for alert_data in new_alerts:
        alert = Alert(
            id         = str(uuid.uuid4()),
            patient_id = patient_id,
            severity   = alert_data["severity"],
            message    = alert_data["message"],
            alert_type = alert_data["type"],
        )
        db.add(alert)
        saved.append(alert_data)

    db.commit()
    return saved