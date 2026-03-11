from typing import List, Dict, Optional
from app.core.fhir import fhir_get, fhir_post
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

def sync_patient_to_fhir(patient_data: Dict) -> Optional[str]:
    """Push a patient record to the HAPI FHIR server. Returns FHIR ID."""
    try:
        resource = {
            "resourceType": "Patient",
            "identifier": [{
                "system": "http://cdss.health.au/patient-id",
                "value":  patient_data.get("id"),
            }],
            "name": [{
                "use":    "official",
                "family": patient_data.get("last_name", ""),
                "given":  [patient_data.get("first_name", "")],
            }],
            "gender":    patient_data.get("gender", "unknown"),
            "birthDate": patient_data.get("birth_date", ""),
        }
        result = fhir_post("Patient", resource)
        return result.get("id")
    except Exception as e:
        logger.warning(f"FHIR sync failed for patient {patient_data.get('id')}: {e}")
        return None

def get_fhir_patient(fhir_id: str) -> Optional[Dict]:
    """Fetch a patient from HAPI FHIR server."""
    try:
        return fhir_get("Patient", fhir_id)
    except Exception as e:
        logger.warning(f"FHIR fetch failed: {e}")
        return None

def push_observation_to_fhir(obs_data: Dict) -> Optional[str]:
    """Push an observation (vital sign) to HAPI FHIR."""
    try:
        resource = {
            "resourceType": "Observation",
            "status": "final",
            "category": [{
                "coding": [{
                    "system":  "http://terminology.hl7.org/CodeSystem/observation-category",
                    "code":    "vital-signs",
                    "display": "Vital Signs",
                }]
            }],
            "code": {
                "coding": [{
                    "system":  "http://loinc.org",
                    "code":    obs_data.get("loinc_code", ""),
                    "display": obs_data.get("display", ""),
                }]
            },
            "subject":           {"reference": f"Patient/{obs_data.get('fhir_patient_id')}"},
            "effectiveDateTime": obs_data.get("effective_datetime"),
            "valueQuantity": {
                "value":  obs_data.get("value"),
                "unit":   obs_data.get("unit"),
                "system": "http://unitsofmeasure.org",
            },
        }
        result = fhir_post("Observation", resource)
        return result.get("id")
    except Exception as e:
        logger.warning(f"FHIR observation push failed: {e}")
        return None