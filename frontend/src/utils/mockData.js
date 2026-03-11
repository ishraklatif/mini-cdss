export const MOCK_PATIENTS = [
    {
      id: 'PT-00142', name: 'Margaret Chen', age: 67,
      ward: 'Cardiology', bed: '4B', status: 'critical', newsScore: 7,
      admittedDate: '08 Mar 2026', diagnosis: 'Acute Myocardial Infarction',
      consultant: 'Dr. A. Patel', allergies: ['Penicillin', 'Aspirin'],
      vitals: { hr: 112, bp: '88/54', spo2: 91, temp: 38.9, rr: 24, gcs: 14 },
      vitalsHistory: [
        { time: '06:00', hr: 98,  spo2: 94, rr: 20 },
        { time: '08:00', hr: 104, spo2: 93, rr: 21 },
        { time: '10:00', hr: 109, spo2: 92, rr: 22 },
        { time: '12:00', hr: 112, spo2: 91, rr: 24 },
      ],
      medications: [
        { name: 'Metoprolol 50mg',  route: 'PO', freq: 'BD',    alert: 'high' },
        { name: 'Heparin 5000U',    route: 'IV', freq: 'TDS',   alert: null },
        { name: 'Aspirin 100mg',    route: 'PO', freq: 'Daily', alert: 'critical' },
      ],
      alerts: [
        { id: 'AL-001', severity: 'critical', msg: 'ALLERGY CONFLICT: Aspirin — documented allergy on record' },
        { id: 'AL-002', severity: 'high',     msg: 'Drug interaction: Metoprolol + Heparin — increased bleeding risk' },
      ],
    },
    {
      id: 'PT-00198', name: 'James Okafor', age: 54,
      ward: 'General Medicine', bed: '7A', status: 'at-risk', newsScore: 4,
      admittedDate: '09 Mar 2026', diagnosis: 'Community Acquired Pneumonia',
      consultant: 'Dr. S. Nguyen', allergies: ['Sulfonamides'],
      vitals: { hr: 96, bp: '118/74', spo2: 94, temp: 38.2, rr: 20, gcs: 15 },
      vitalsHistory: [
        { time: '06:00', hr: 88, spo2: 96, rr: 17 },
        { time: '08:00', hr: 91, spo2: 95, rr: 18 },
        { time: '10:00', hr: 94, spo2: 95, rr: 19 },
        { time: '12:00', hr: 96, spo2: 94, rr: 20 },
      ],
      medications: [
        { name: 'Amoxicillin 875mg', route: 'PO',  freq: 'BD',  alert: null },
        { name: 'Salbutamol 2.5mg',  route: 'NEB', freq: 'PRN', alert: null },
        { name: 'Paracetamol 1g',    route: 'PO',  freq: 'QID', alert: null },
      ],
      alerts: [
        { id: 'AL-003', severity: 'medium', msg: 'SpO2 trending down — review oxygen therapy' },
      ],
    },
    {
      id: 'PT-00231', name: 'Susan Tremblay', age: 43,
      ward: 'Surgical', bed: '2C', status: 'stable', newsScore: 1,
      admittedDate: '07 Mar 2026', diagnosis: 'Post-op Laparoscopic Cholecystectomy',
      consultant: 'Dr. R. Williams', allergies: [],
      vitals: { hr: 74, bp: '126/82', spo2: 98, temp: 36.8, rr: 14, gcs: 15 },
      vitalsHistory: [
        { time: '06:00', hr: 76, spo2: 99, rr: 14 },
        { time: '08:00', hr: 75, spo2: 99, rr: 14 },
        { time: '10:00', hr: 73, spo2: 98, rr: 14 },
        { time: '12:00', hr: 74, spo2: 98, rr: 14 },
      ],
      medications: [
        { name: 'Oxycodone 5mg',   route: 'PO', freq: 'PRN', alert: null },
        { name: 'Ondansetron 4mg', route: 'IV', freq: 'PRN', alert: null },
      ],
      alerts: [],
    },
    {
      id: 'PT-00267', name: 'David Ramirez', age: 71,
      ward: 'Respiratory', bed: '5D', status: 'at-risk', newsScore: 5,
      admittedDate: '06 Mar 2026', diagnosis: 'COPD Exacerbation',
      consultant: 'Dr. K. Singh', allergies: ['Codeine'],
      vitals: { hr: 102, bp: '138/88', spo2: 89, temp: 37.4, rr: 26, gcs: 15 },
      vitalsHistory: [
        { time: '06:00', hr: 95,  spo2: 92, rr: 22 },
        { time: '08:00', hr: 98,  spo2: 91, rr: 23 },
        { time: '10:00', hr: 100, spo2: 90, rr: 25 },
        { time: '12:00', hr: 102, spo2: 89, rr: 26 },
      ],
      medications: [
        { name: 'Prednisolone 50mg', route: 'PO',  freq: 'Daily', alert: null },
        { name: 'Tiotropium 18mcg',  route: 'INH', freq: 'Daily', alert: null },
        { name: 'Doxycycline 100mg', route: 'PO',  freq: 'BD',    alert: null },
      ],
      alerts: [
        { id: 'AL-004', severity: 'high', msg: 'SpO2 critically low at 89% — target 88–92% for COPD' },
      ],
    },
    {
      id: 'PT-00304', name: 'Aisha Mohammed', age: 29,
      ward: 'Maternity', bed: '1A', status: 'stable', newsScore: 0,
      admittedDate: '10 Mar 2026', diagnosis: 'Induction of Labour — 40+3 weeks',
      consultant: 'Dr. L. Torres', allergies: [],
      vitals: { hr: 82, bp: '116/70', spo2: 99, temp: 36.6, rr: 16, gcs: 15 },
      vitalsHistory: [
        { time: '06:00', hr: 80, spo2: 99, rr: 15 },
        { time: '08:00', hr: 81, spo2: 99, rr: 16 },
        { time: '10:00', hr: 82, spo2: 99, rr: 16 },
        { time: '12:00', hr: 82, spo2: 99, rr: 16 },
      ],
      medications: [
        { name: 'Oxytocin 10U', route: 'IV', freq: 'Infusion', alert: null },
      ],
      alerts: [],
    },
    {
      id: 'PT-00318', name: 'Thomas Brennan', age: 58,
      ward: 'Neurology', bed: '6B', status: 'at-risk', newsScore: 3,
      admittedDate: '05 Mar 2026', diagnosis: 'TIA — Transient Ischaemic Attack',
      consultant: 'Dr. M. Hassan', allergies: ['Warfarin'],
      vitals: { hr: 88, bp: '154/96', spo2: 96, temp: 37.0, rr: 17, gcs: 15 },
      vitalsHistory: [
        { time: '06:00', hr: 85, spo2: 97, rr: 16 },
        { time: '08:00', hr: 86, spo2: 97, rr: 16 },
        { time: '10:00', hr: 87, spo2: 96, rr: 17 },
        { time: '12:00', hr: 88, spo2: 96, rr: 17 },
      ],
      medications: [
        { name: 'Clopidogrel 75mg', route: 'PO', freq: 'Daily', alert: null },
        { name: 'Atorvastatin 40mg', route: 'PO', freq: 'Nocte', alert: null },
        { name: 'Perindopril 5mg',   route: 'PO', freq: 'Daily', alert: null },
      ],
      alerts: [
        { id: 'AL-005', severity: 'medium', msg: 'BP 154/96 — hypertension target not achieved' },
      ],
    },
  ];