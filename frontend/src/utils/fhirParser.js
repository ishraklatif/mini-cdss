/**
 * FHIR R4 Resource Parser
 * Transforms FHIR-compliant API responses into UI-ready patient objects
 * Aligned with FHIR AU Implementation Guide
 */

export const parseFHIRPatient = (fhirPatient) => ({
    id: fhirPatient.id,
    name: fhirPatient.name?.[0]
      ? `${fhirPatient.name[0].given?.join(' ')} ${fhirPatient.name[0].family}`
      : 'Unknown',
    age: fhirPatient.birthDate
      ? new Date().getFullYear() - new Date(fhirPatient.birthDate).getFullYear()
      : null,
    gender: fhirPatient.gender,
  });
  
  export const parseFHIRObservation = (obs) => ({
    id: obs.id,
    code: obs.code?.coding?.[0]?.code,
    display: obs.code?.coding?.[0]?.display,
    value: obs.valueQuantity?.value,
    unit: obs.valueQuantity?.unit,
    effectiveDateTime: obs.effectiveDateTime,
    status: obs.status,
  });
  
  export const parseFHIRMedication = (med) => ({
    id: med.id,
    name: med.medicationCodeableConcept?.coding?.[0]?.display || 'Unknown',
    status: med.status,
    dosage: med.dosageInstruction?.[0]?.text,
    route: med.dosageInstruction?.[0]?.route?.coding?.[0]?.display,
  });
  
  export const parseFHIRAllergy = (allergy) => ({
    id: allergy.id,
    substance: allergy.code?.coding?.[0]?.display,
    criticality: allergy.criticality,
    status: allergy.clinicalStatus?.coding?.[0]?.code,
  });
  
  export const FHIR_LOINC_CODES = {
    HEART_RATE:      '8867-4',
    SPO2:            '59408-5',
    RESP_RATE:       '9279-1',
    BODY_TEMP:       '8310-5',
    BLOOD_PRESSURE:  '55284-4',
    GCS:             '9269-2',
  };