from typing import List, Dict

# Known high-risk allergy-drug pairs
# In production this would be a full AMT/MIMS database
ALLERGY_DRUG_MAP = {
    "penicillin":     ["amoxicillin", "ampicillin", "flucloxacillin", "piperacillin"],
    "aspirin":        ["aspirin", "acetylsalicylic acid"],
    "sulfonamides":   ["trimethoprim-sulfamethoxazole", "sulfamethoxazole"],
    "codeine":        ["codeine", "codeine phosphate"],
    "warfarin":       ["warfarin", "warfarin sodium"],
    "penicillin":     ["amoxicillin", "amoxicillin-clavulanate"],
    "nsaids":         ["ibuprofen", "naproxen", "diclofenac", "celecoxib"],
    "contrast media": ["iodine contrast", "omnipaque"],
}

def check_allergy_conflicts(
    allergies: List[str],
    medications: List[Dict]
) -> List[Dict]:
    """
    Check if any prescribed medications conflict with known patient allergies.
    Returns list of conflict alerts.
    Mirrors logic used in UpToDate Lexicomp allergy checking module.
    """
    conflicts = []

    for allergy in allergies:
        allergy_lower = allergy.lower()
        # Direct name match
        for med in medications:
            med_name_lower = med.get("name", "").lower()
            if allergy_lower in med_name_lower or med_name_lower in allergy_lower:
                conflicts.append({
                    "severity":   "critical",
                    "type":       "allergy_conflict",
                    "message":    f"ALLERGY CONFLICT: {med.get('name')} — documented allergy to {allergy} on record",
                    "medication": med.get("name"),
                    "allergy":    allergy,
                })
            # Cross-reactive match
            cross_reactives = ALLERGY_DRUG_MAP.get(allergy_lower, [])
            for cross in cross_reactives:
                if cross in med_name_lower:
                    conflicts.append({
                        "severity":   "critical",
                        "type":       "allergy_conflict",
                        "message":    f"ALLERGY CONFLICT: {med.get('name')} — cross-reactive with documented allergy to {allergy}",
                        "medication": med.get("name"),
                        "allergy":    allergy,
                    })

    return conflicts