from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.patient import Patient
from app.models.medication import Medication, Allergy
from app.models.observation import Observation
from app.models.alert import Alert
from app.schemas.patient import PatientCreate, PatientResponse
from app.services.fhir_service import sync_patient_to_fhir
import uuid

router = APIRouter()

def format_patient(patient: Patient) -> dict:
    """Format a DB patient into frontend-compatible shape."""
    allergies    = [a.substance for a in patient.allergies]
    medications  = [{"id": m.id, "name": m.name, "route": m.route or "", "freq": m.freq or "", "alert": m.alert} for m in patient.medications]
    alerts       = [{"id": a.id, "severity": a.severity, "msg": a.message} for a in patient.alerts if not a.acknowledged]

    # Get latest vitals from observations
    obs_map = {}
    for obs in sorted(patient.observations, key=lambda x: x.created_at or "", reverse=True):
        if obs.display and obs.display not in obs_map:
            obs_map[obs.display] = obs

    vitals = {
        "hr":   int(obs_map["Heart rate"].value)            if "Heart rate"             in obs_map else 72,
        "bp":   obs_map["Blood pressure systolic"].value_string if "Blood pressure systolic" in obs_map else "120/80",
        "spo2": int(obs_map["Oxygen saturation"].value)     if "Oxygen saturation"      in obs_map else 98,
        "temp": obs_map["Body temperature"].value           if "Body temperature"        in obs_map else 37.0,
        "rr":   int(obs_map["Respiratory rate"].value)      if "Respiratory rate"        in obs_map else 16,
        "gcs":  int(obs_map["Glasgow coma score total"].value) if "Glasgow coma score total" in obs_map else 15,
    }

    return {
        "id":            patient.id,
        "name":          f"{patient.first_name} {patient.last_name}",
        "age":           patient.age,
        "ward":          patient.ward,
        "bed":           patient.bed,
        "status":        patient.status,
        "newsScore":     patient.news_score,
        "admittedDate":  patient.admitted_date,
        "diagnosis":     patient.diagnosis,
        "consultant":    patient.consultant,
        "allergies":     allergies,
        "vitals":        vitals,
        "vitalsHistory": [],
        "medications":   medications,
        "alerts":        alerts,
    }

@router.get("/", response_model=List[dict])
def get_all_patients(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    ward:   Optional[str] = Query(None),
    db:     Session       = Depends(get_db),
):
    """Get all patients with optional filters."""
    query = db.query(Patient)

    if search:
        query = query.filter(
            Patient.first_name.ilike(f"%{search}%") |
            Patient.last_name.ilike(f"%{search}%")  |
            Patient.id.ilike(f"%{search}%")         |
            Patient.ward.ilike(f"%{search}%")
        )
    if status:
        query = query.filter(Patient.status == status)
    if ward:
        query = query.filter(Patient.ward == ward)

    patients = query.all()
    return [format_patient(p) for p in patients]

@router.get("/{patient_id}", response_model=dict)
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    """Get a single patient by ID."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient {patient_id} not found")
    return format_patient(patient)

@router.post("/", response_model=dict, status_code=201)
def create_patient(data: PatientCreate, db: Session = Depends(get_db)):
    """Register a new patient."""
    existing = db.query(Patient).filter(Patient.id == data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Patient {data.id} already exists")

    patient = Patient(**data.model_dump())
    db.add(patient)
    db.commit()
    db.refresh(patient)

    # Sync to FHIR server asynchronously
    fhir_id = sync_patient_to_fhir(data.model_dump())
    if fhir_id:
        patient.fhir_id = fhir_id
        db.commit()

    return format_patient(patient)

@router.delete("/{patient_id}", status_code=204)
def delete_patient(patient_id: str, db: Session = Depends(get_db)):
    """Discharge / remove a patient."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()