from typing import List, Dict

# Drug-drug interaction pairs
# severity: critical / high / medium / low
# In production: integrate with MIMS Australia or NPS MedicineWise API
DRUG_INTERACTIONS = [
    {
        "drug_a":    "metoprolol",
        "drug_b":    "heparin",
        "severity":  "high",
        "message":   "Drug interaction: Metoprolol + Heparin — increased bleeding risk, monitor closely",
    },
    {
        "drug_a":    "warfarin",
        "drug_b":    "aspirin",
        "severity":  "critical",
        "message":   "CRITICAL interaction: Warfarin + Aspirin — major bleeding risk, avoid combination",
    },
    {
        "drug_a":    "clopidogrel",
        "drug_b":    "aspirin",
        "severity":  "high",
        "message":   "Drug interaction: Clopidogrel + Aspirin — increased GI bleeding risk",
    },
    {
        "drug_a":    "metoprolol",
        "drug_b":    "diltiazem",
        "severity":  "high",
        "message":   "Drug interaction: Metoprolol + Diltiazem — risk of bradycardia and heart block",
    },
    {
        "drug_a":    "prednisolone",
        "drug_b":    "ibuprofen",
        "severity":  "medium",
        "message":   "Drug interaction: Prednisolone + Ibuprofen — increased risk of GI ulceration",
    },
    {
        "drug_a":    "atorvastatin",
        "drug_b":    "clarithromycin",
        "severity":  "high",
        "message":   "Drug interaction: Atorvastatin + Clarithromycin — increased risk of myopathy",
    },
    {
        "drug_a":    "perindopril",
        "drug_b":    "spironolactone",
        "severity":  "medium",
        "message":   "Drug interaction: Perindopril + Spironolactone — risk of hyperkalaemia",
    },
    {
        "drug_a":    "oxycodone",
        "drug_b":    "diazepam",
        "severity":  "critical",
        "message":   "CRITICAL interaction: Oxycodone + Benzodiazepine — respiratory depression risk",
    },
]

def check_drug_interactions(medications: List[Dict]) -> List[Dict]:
    """
    Check for drug-drug interactions across a patient's medication list.
    Returns list of interaction alerts.
    Mirrors logic used in Wolters Kluwer Lexicomp drug interaction module.
    """
    interactions = []
    med_names    = [m.get("name", "").lower() for m in medications]

    for interaction in DRUG_INTERACTIONS:
        drug_a = interaction["drug_a"].lower()
        drug_b = interaction["drug_b"].lower()

        a_present = any(drug_a in name for name in med_names)
        b_present = any(drug_b in name for name in med_names)

        if a_present and b_present:
            interactions.append({
                "severity": interaction["severity"],
                "type":     "drug_interaction",
                "message":  interaction["message"],
                "drug_a":   interaction["drug_a"],
                "drug_b":   interaction["drug_b"],
            })

    return interactions

def calculate_news2(vitals: Dict) -> int:
    """
    Calculate NEWS2 score from patient vitals.
    Based on Royal College of Physicians NEWS2 scoring system.
    """
    score = 0

    # Respiration rate
    rr = vitals.get("rr", 16)
    if rr <= 8:           score += 3
    elif rr <= 11:        score += 1
    elif rr <= 20:        score += 0
    elif rr <= 24:        score += 2
    else:                 score += 3

    # SpO2
    spo2 = vitals.get("spo2", 98)
    if spo2 <= 91:        score += 3
    elif spo2 <= 93:      score += 2
    elif spo2 <= 95:      score += 1

    # Temperature
    temp = vitals.get("temp", 37.0)
    if temp <= 35.0:      score += 3
    elif temp <= 36.0:    score += 1
    elif temp <= 38.0:    score += 0
    elif temp <= 39.0:    score += 1
    else:                 score += 2

    # Heart rate
    hr = vitals.get("hr", 70)
    if hr <= 40:          score += 3
    elif hr <= 50:        score += 1
    elif hr <= 90:        score += 0
    elif hr <= 110:       score += 1
    elif hr <= 130:       score += 2
    else:                 score += 3

    # GCS
    gcs = vitals.get("gcs", 15)
    if gcs < 15:          score += 3

    return score