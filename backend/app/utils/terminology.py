# LOINC codes for vital signs
# Aligned with FHIR AU and My Health Record terminology requirements
LOINC_CODES = {
    "heart_rate":      {"code": "8867-4",  "display": "Heart rate",             "unit": "/min",  "unit_code": "/min"  },
    "spo2":            {"code": "59408-5", "display": "Oxygen saturation",       "unit": "%",     "unit_code": "%"     },
    "respiratory_rate":{"code": "9279-1",  "display": "Respiratory rate",        "unit": "/min",  "unit_code": "/min"  },
    "body_temp":       {"code": "8310-5",  "display": "Body temperature",         "unit": "Cel",   "unit_code": "Cel"   },
    "blood_pressure":  {"code": "55284-4", "display": "Blood pressure systolic",  "unit": "mmHg",  "unit_code": "mm[Hg]"},
    "gcs":             {"code": "9269-2",  "display": "Glasgow coma score total", "unit": "{score}","unit_code": "{score}"},
    "news2":           {"code": "1104051000000101", "display": "NEWS2 total score","unit": "{score}","unit_code": "{score}"},
}

# SNOMED CT-AU codes for common diagnoses
SNOMED_DIAGNOSES = {
    "ami":    {"code": "57054005",  "display": "Acute myocardial infarction"   },
    "copd":   {"code": "13645005",  "display": "Chronic obstructive pulmonary disease"},
    "cap":    {"code": "233604007", "display": "Community-acquired pneumonia"  },
    "tia":    {"code": "266257000", "display": "Transient ischaemic attack"    },
    "sepsis": {"code": "11612004",  "display": "Septicaemia"                   },
}

# AMT (Australian Medicines Terminology) common drug codes
AMT_MEDICATIONS = {
    "metoprolol":    {"code": "28691000168107", "display": "Metoprolol tartrate"},
    "aspirin":       {"code": "79217011000036102","display": "Aspirin"           },
    "heparin":       {"code": "32061000036104",  "display": "Heparin sodium"     },
    "amoxicillin":   {"code": "23790011000036103","display": "Amoxicillin"        },
    "paracetamol":   {"code": "32604011000036101","display": "Paracetamol"        },
    "prednisolone":  {"code": "28601000168106",  "display": "Prednisolone"       },
    "clopidogrel":   {"code": "39689011000036101","display": "Clopidogrel"        },
    "atorvastatin":  {"code": "30443011000036102","display": "Atorvastatin"       },
}

def get_loinc(vital_name: str) -> dict:
    return LOINC_CODES.get(vital_name.lower(), {"code": "", "display": vital_name, "unit": "", "unit_code": ""})

def get_snomed_diagnosis(key: str) -> dict:
    return SNOMED_DIAGNOSES.get(key.lower(), {"code": "", "display": key})

def get_amt_code(drug_name: str) -> dict:
    key = drug_name.lower().split()[0]
    return AMT_MEDICATIONS.get(key, {"code": "", "display": drug_name})