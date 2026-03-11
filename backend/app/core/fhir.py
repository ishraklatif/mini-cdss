import requests
from typing import Optional, Dict, Any
from app.core.config import settings

FHIR_BASE = settings.FHIR_SERVER_URL

HEADERS = {
    "Content-Type": "application/fhir+json",
    "Accept":       "application/fhir+json",
}

def fhir_get(resource_type: str, resource_id: Optional[str] = None, params: Optional[Dict] = None) -> Dict[str, Any]:
    """GET a FHIR resource or search."""
    url = f"{FHIR_BASE}/{resource_type}"
    if resource_id:
        url += f"/{resource_id}"
    response = requests.get(url, headers=HEADERS, params=params or {})
    response.raise_for_status()
    return response.json()

def fhir_post(resource_type: str, resource: Dict[str, Any]) -> Dict[str, Any]:
    """POST (create) a FHIR resource."""
    url = f"{FHIR_BASE}/{resource_type}"
    response = requests.post(url, headers=HEADERS, json=resource)
    response.raise_for_status()
    return response.json()

def fhir_put(resource_type: str, resource_id: str, resource: Dict[str, Any]) -> Dict[str, Any]:
    """PUT (update) a FHIR resource."""
    url = f"{FHIR_BASE}/{resource_type}/{resource_id}"
    response = requests.put(url, headers=HEADERS, json=resource)
    response.raise_for_status()
    return response.json()

def fhir_delete(resource_type: str, resource_id: str) -> bool:
    """DELETE a FHIR resource."""
    url = f"{FHIR_BASE}/{resource_type}/{resource_id}"
    response = requests.delete(url, headers=HEADERS)
    return response.status_code in (200, 204)

def build_patient_resource(patient_data: Dict) -> Dict:
    """Build a FHIR R4 Patient resource from internal data."""
    return {
        "resourceType": "Patient",
        "id":           patient_data.get("id"),
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
        "address": [{
            "country": "AU",
            "state":   patient_data.get("state", ""),
        }],
    }

def build_observation_resource(obs_data: Dict) -> Dict:
    """Build a FHIR R4 Observation resource (vital sign)."""
    return {
        "resourceType": "Observation",
        "id":           obs_data.get("id"),
        "status":       "final",
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
                "code":    obs_data.get("loinc_code"),
                "display": obs_data.get("display"),
            }]
        },
        "subject":            {"reference": f"Patient/{obs_data.get('patient_id')}"},
        "effectiveDateTime":  obs_data.get("effective_datetime"),
        "valueQuantity": {
            "value":  obs_data.get("value"),
            "unit":   obs_data.get("unit"),
            "system": "http://unitsofmeasure.org",
            "code":   obs_data.get("unit_code"),
        },
    }

def build_medication_request_resource(med_data: Dict) -> Dict:
    """Build a FHIR R4 MedicationRequest resource."""
    return {
        "resourceType": "MedicationRequest",
        "id":           med_data.get("id"),
        "status":       "active",
        "intent":       "order",
        "medicationCodeableConcept": {
            "coding": [{
                "system":  "http://snomed.info/sct",
                "code":    med_data.get("snomed_code", ""),
                "display": med_data.get("name"),
            }],
            "text": med_data.get("name"),
        },
        "subject":    {"reference": f"Patient/{med_data.get('patient_id')}"},
        "authoredOn": med_data.get("authored_on"),
        "dosageInstruction": [{
            "text":   f"{med_data.get('dose')} {med_data.get('freq')}",
            "route": {
                "coding": [{
                    "system":  "http://snomed.info/sct",
                    "display": med_data.get("route"),
                }]
            },
            "timing": {
                "code": {
                    "text": med_data.get("freq"),
                }
            },
        }],
    }

def build_allergy_resource(allergy_data: Dict) -> Dict:
    """Build a FHIR R4 AllergyIntolerance resource."""
    return {
        "resourceType": "AllergyIntolerance",
        "id":           allergy_data.get("id"),
        "clinicalStatus": {
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
                "code":   "active",
            }]
        },
        "verificationStatus": {
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
                "code":   "confirmed",
            }]
        },
        "criticality": allergy_data.get("criticality", "high"),
        "code": {
            "coding": [{
                "system":  "http://snomed.info/sct",
                "display": allergy_data.get("substance"),
            }],
            "text": allergy_data.get("substance"),
        },
        "patient": {"reference": f"Patient/{allergy_data.get('patient_id')}"},
    }

def build_detected_issue_resource(alert_data: Dict) -> Dict:
    """Build a FHIR R4 DetectedIssue resource (CDS alert)."""
    return {
        "resourceType": "DetectedIssue",
        "id":           alert_data.get("id"),
        "status":       "final",
        "severity":     alert_data.get("severity", "moderate"),
        "code": {
            "coding": [{
                "system":  "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                "code":    alert_data.get("code", "DRG"),
                "display": alert_data.get("display", "Drug Interaction"),
            }]
        },
        "patient":  {"reference": f"Patient/{alert_data.get('patient_id')}"},
        "detail":   alert_data.get("message"),
        "severity": alert_data.get("severity"),
    }