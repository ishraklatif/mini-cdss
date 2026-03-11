import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine, Base
from app.models.patient import Patient
from app.models.medication import Medication, Allergy
from app.models.observation import Observation
from app.models.alert import Alert
import uuid

# Create all tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ── Clear existing data ──────────────────────────────────────────────────────
print("Clearing existing data...")
db.query(Alert).delete()
db.query(Observation).delete()
db.query(Medication).delete()
db.query(Allergy).delete()
db.query(Patient).delete()
db.commit()

# ── Patients ─────────────────────────────────────────────────────────────────
patients = [
    Patient(id="PT-00142", first_name="Margaret", last_name="Chen",    age=67, gender="female", ward="Cardiology",       bed="4B", status="critical", news_score=7,  admitted_date="2024-01-08", diagnosis="Acute MI",               consultant="Dr. Patel"),
    Patient(id="PT-00198", first_name="James",    last_name="Okafor",  age=54, gender="male",   ward="General Medicine", bed="2A", status="at-risk",  news_score=4,  admitted_date="2024-01-09", diagnosis="Hypertensive crisis",     consultant="Dr. Singh"),
    Patient(id="PT-00231", first_name="Susan",    last_name="Tremblay",age=43, gender="female", ward="Surgical",         bed="7C", status="stable",   news_score=1,  admitted_date="2024-01-10", diagnosis="Post-op appendectomy",    consultant="Dr. Williams"),
    Patient(id="PT-00267", first_name="David",    last_name="Ramirez", age=71, gender="male",   ward="Respiratory",      bed="3D", status="at-risk",  news_score=5,  admitted_date="2024-01-07", diagnosis="COPD exacerbation",       consultant="Dr. Nguyen"),
    Patient(id="PT-00304", first_name="Aisha",    last_name="Mohammed",age=29, gender="female", ward="Maternity",        bed="1A", status="stable",   news_score=0,  admitted_date="2024-01-11", diagnosis="Gestational hypertension", consultant="Dr. Thompson"),
    Patient(id="PT-00318", first_name="Thomas",   last_name="Brennan", age=82, gender="male",   ward="Neurology",        bed="5F", status="at-risk",  news_score=3,  admitted_date="2024-01-06", diagnosis="TIA",                     consultant="Dr. Kim"),
]

print("Seeding patients...")
for p in patients:
    db.add(p)
db.commit()

# ── Allergies ─────────────────────────────────────────────────────────────────
allergies = [
    Allergy(id=str(uuid.uuid4()), patient_id="PT-00142", substance="Penicillin",   criticality="high"),
    Allergy(id=str(uuid.uuid4()), patient_id="PT-00142", substance="Aspirin",      criticality="high"),
    Allergy(id=str(uuid.uuid4()), patient_id="PT-00198", substance="Sulfonamides", criticality="high"),
    Allergy(id=str(uuid.uuid4()), patient_id="PT-00267", substance="NSAIDs",       criticality="moderate"),
    Allergy(id=str(uuid.uuid4()), patient_id="PT-00318", substance="Codeine",      criticality="high"),
]

print("Seeding allergies...")
for a in allergies:
    db.add(a)
db.commit()

# ── Medications ───────────────────────────────────────────────────────────────
medications = [
    # PT-00142 Margaret Chen — Acute MI (has aspirin allergy → will trigger alert)
    Medication(id=str(uuid.uuid4()), patient_id="PT-00142", name="Metoprolol 25mg",   route="Oral", freq="BD",  dose="25mg",   status="active"),
    Medication(id=str(uuid.uuid4()), patient_id="PT-00142", name="Heparin 5000 units",route="IV",   freq="TDS", dose="5000u",  status="active"),
    Medication(id=str(uuid.uuid4()), patient_id="PT-00142", name="Aspirin 100mg",     route="Oral", freq="Daily",dose="100mg", status="active", alert="critical"),
    Medication(id=str(uuid.uuid4()), patient_id="PT-00142", name="Atorvastatin 40mg", route="Oral", freq="Nocte",dose="40mg",  status="active"),

    # PT-00198 James Okafor — Hypertensive crisis
    Medication(id=str(uuid.uuid4()), patient_id="PT-00198", name="Perindopril 5mg",    route="Oral", freq="Daily", dose="5mg",  status="active"),
    Medication(id=str(uuid.uuid4()), patient_id="PT-00198", name="Spironolactone 25mg",route="Oral", freq="Daily", dose="25mg", status="active"),
    Medication(id=str(uuid.uuid4()), patient_id="PT-00198", name="Amlodipine 10mg",    route="Oral", freq="Daily", dose="10mg", status="active"),

    # PT-00231 Susan Tremblay — Post-op
    Medication(id=str(uuid.uuid4()), patient_id="PT-00231", name="Paracetamol 1g",  route="Oral", freq="QID",  dose="1g",   status="active"),
    Medication(id=str(uuid.uuid4()), patient_id="PT-00231", name="Oxycodone 5mg",   route="Oral", freq="PRN",  dose="5mg",  status="active"),

    # PT-00267 David Ramirez — COPD
    Medication(id=str(uuid.uuid4()), patient_id="PT-00267", name="Prednisolone 25mg",  route="Oral", freq="Daily", dose="25mg", status="active"),
    Medication(id=str(uuid.uuid4()), patient_id="PT-00267", name="Salbutamol inhaler", route="Inhaled", freq="PRN", dose="2 puffs", status="active"),
    Medication(id=str(uuid.uuid4()), patient_id="PT-00267", name="Tiotropium inhaler", route="Inhaled", freq="Daily", dose="1 puff", status="active"),

    # PT-00304 Aisha Mohammed — Maternity
    Medication(id=str(uuid.uuid4()), patient_id="PT-00304", name="Labetalol 100mg",  route="Oral", freq="TDS",   dose="100mg", status="active"),
    Medication(id=str(uuid.uuid4()), patient_id="PT-00304", name="Folic acid 5mg",   route="Oral", freq="Daily", dose="5mg",   status="active"),

    # PT-00318 Thomas Brennan — TIA (has codeine allergy)
    Medication(id=str(uuid.uuid4()), patient_id="PT-00318", name="Clopidogrel 75mg",  route="Oral", freq="Daily", dose="75mg", status="active"),
    Medication(id=str(uuid.uuid4()), patient_id="PT-00318", name="Atorvastatin 40mg", route="Oral", freq="Nocte", dose="40mg", status="active"),
    Medication(id=str(uuid.uuid4()), patient_id="PT-00318", name="Perindopril 5mg",   route="Oral", freq="Daily", dose="5mg",  status="active"),
]

print("Seeding medications...")
for m in medications:
    db.add(m)
db.commit()

# ── Observations (vitals) ─────────────────────────────────────────────────────
from datetime import datetime
now = datetime.utcnow().isoformat()

observations = [
    # PT-00142 Margaret Chen — critical vitals
    Observation(id=str(uuid.uuid4()), patient_id="PT-00142", loinc_code="8867-4",  display="Heart rate",             value=118,  unit="/min",  effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00142", loinc_code="59408-5", display="Oxygen saturation",       value=91,   unit="%",     effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00142", loinc_code="9279-1",  display="Respiratory rate",        value=26,   unit="/min",  effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00142", loinc_code="8310-5",  display="Body temperature",        value=38.9, unit="Cel",   effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00142", loinc_code="9269-2",  display="Glasgow coma score total",value=14,   unit="{score}",effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00142", loinc_code="55284-4", display="Blood pressure systolic", value=None, value_string="162/95", unit="mmHg", effective_datetime=now),

    # PT-00198 James Okafor — at-risk vitals
    Observation(id=str(uuid.uuid4()), patient_id="PT-00198", loinc_code="8867-4",  display="Heart rate",             value=102,  unit="/min",  effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00198", loinc_code="59408-5", display="Oxygen saturation",       value=95,   unit="%",     effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00198", loinc_code="9279-1",  display="Respiratory rate",        value=22,   unit="/min",  effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00198", loinc_code="8310-5",  display="Body temperature",        value=37.8, unit="Cel",   effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00198", loinc_code="9269-2",  display="Glasgow coma score total",value=15,   unit="{score}",effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00198", loinc_code="55284-4", display="Blood pressure systolic", value=None, value_string="188/110", unit="mmHg", effective_datetime=now),

    # PT-00231 Susan Tremblay — stable vitals
    Observation(id=str(uuid.uuid4()), patient_id="PT-00231", loinc_code="8867-4",  display="Heart rate",             value=72,   unit="/min",  effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00231", loinc_code="59408-5", display="Oxygen saturation",       value=99,   unit="%",     effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00231", loinc_code="9279-1",  display="Respiratory rate",        value=14,   unit="/min",  effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00231", loinc_code="8310-5",  display="Body temperature",        value=36.8, unit="Cel",   effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00231", loinc_code="9269-2",  display="Glasgow coma score total",value=15,   unit="{score}",effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00231", loinc_code="55284-4", display="Blood pressure systolic", value=None, value_string="118/76", unit="mmHg", effective_datetime=now),

    # PT-00267 David Ramirez — at-risk vitals
    Observation(id=str(uuid.uuid4()), patient_id="PT-00267", loinc_code="8867-4",  display="Heart rate",             value=96,   unit="/min",  effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00267", loinc_code="59408-5", display="Oxygen saturation",       value=93,   unit="%",     effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00267", loinc_code="9279-1",  display="Respiratory rate",        value=23,   unit="/min",  effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00267", loinc_code="8310-5",  display="Body temperature",        value=37.4, unit="Cel",   effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00267", loinc_code="9269-2",  display="Glasgow coma score total",value=15,   unit="{score}",effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00267", loinc_code="55284-4", display="Blood pressure systolic", value=None, value_string="144/88", unit="mmHg", effective_datetime=now),

    # PT-00304 Aisha Mohammed — stable vitals
    Observation(id=str(uuid.uuid4()), patient_id="PT-00304", loinc_code="8867-4",  display="Heart rate",             value=78,   unit="/min",  effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00304", loinc_code="59408-5", display="Oxygen saturation",       value=99,   unit="%",     effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00304", loinc_code="9279-1",  display="Respiratory rate",        value=16,   unit="/min",  effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00304", loinc_code="8310-5",  display="Body temperature",        value=36.9, unit="Cel",   effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00304", loinc_code="9269-2",  display="Glasgow coma score total",value=15,   unit="{score}",effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00304", loinc_code="55284-4", display="Blood pressure systolic", value=None, value_string="138/90", unit="mmHg", effective_datetime=now),

    # PT-00318 Thomas Brennan — at-risk vitals
    Observation(id=str(uuid.uuid4()), patient_id="PT-00318", loinc_code="8867-4",  display="Heart rate",             value=88,   unit="/min",  effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00318", loinc_code="59408-5", display="Oxygen saturation",       value=96,   unit="%",     effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00318", loinc_code="9279-1",  display="Respiratory rate",        value=18,   unit="/min",  effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00318", loinc_code="8310-5",  display="Body temperature",        value=36.6, unit="Cel",   effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00318", loinc_code="9269-2",  display="Glasgow coma score total",value=14,   unit="{score}",effective_datetime=now),
    Observation(id=str(uuid.uuid4()), patient_id="PT-00318", loinc_code="55284-4", display="Blood pressure systolic", value=None, value_string="152/92", unit="mmHg", effective_datetime=now),
]

print("Seeding observations...")
for o in observations:
    db.add(o)
db.commit()

# ── Alerts ────────────────────────────────────────────────────────────────────
alerts = [
    # PT-00142 — critical: allergy conflict + drug interaction + high NEWS2
    Alert(id=str(uuid.uuid4()), patient_id="PT-00142", severity="critical", alert_type="allergy_conflict",  message="ALLERGY CONFLICT: Aspirin 100mg — documented allergy to Aspirin on record"),
    Alert(id=str(uuid.uuid4()), patient_id="PT-00142", severity="high",     alert_type="drug_interaction",  message="Drug interaction: Metoprolol + Heparin — increased bleeding risk, monitor closely"),
    Alert(id=str(uuid.uuid4()), patient_id="PT-00142", severity="high",     alert_type="news2",             message="NEWS2 score 7 — Emergency assessment required, consider ICU escalation"),

    # PT-00198 — medium: drug interaction
    Alert(id=str(uuid.uuid4()), patient_id="PT-00198", severity="medium",   alert_type="drug_interaction",  message="Drug interaction: Perindopril + Spironolactone — risk of hyperkalaemia, monitor electrolytes"),

    # PT-00267 — medium: NEWS2 at-risk
    Alert(id=str(uuid.uuid4()), patient_id="PT-00267", severity="medium",   alert_type="news2",             message="NEWS2 score 5 — Urgent review by ward clinician required"),

    # PT-00318 — medium: NEWS2 at-risk
    Alert(id=str(uuid.uuid4()), patient_id="PT-00318", severity="medium",   alert_type="news2",             message="NEWS2 score 3 — Increase frequency of monitoring"),
]

print("Seeding alerts...")
for a in alerts:
    db.add(a)
db.commit()

db.close()
print("\n✅ Database seeded successfully!")
print("   6 patients | allergies | medications | observations | alerts")