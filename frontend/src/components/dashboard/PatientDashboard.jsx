import React, { useState } from 'react';
import PatientList from '../patients/PatientList';
import PatientRecord from '../patients/PatientRecord';
import { usePatients } from '../../hooks/useFHIR';
import CaduceusImg from '../../assets/Caduceus.svg';

const NAV_ITEMS = [
  { label: 'Ward Overview'  },
  { label: 'Alerts'         },
  { label: 'Medications'    },
  { label: 'Analytics'      },
  { label: 'FHIR Resources' },
];

const CaduceusLogo = () => (
  <div style={{
    width: 36, height: 36, borderRadius: 8,
    background: '#FFFFFF',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 4, flexShrink: 0,
  }}>
    <img
      src={CaduceusImg}
      alt="CDSS Caduceus Logo"
      style={{ width: 26, height: 26, objectFit: 'contain' }}
    />
  </div>
);

// ── Alerts View ──────────────────────────────────────────────────────────────
const AlertsView = ({ patients }) => {
  const allAlerts = patients.flatMap(p =>
    p.alerts.map(a => ({ ...a, patientName: p.name, patientId: p.id, ward: p.ward, bed: p.bed }))
  );
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...allAlerts].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const cfgMap = {
    critical: { color: '#FF4C4C', bg: 'rgba(255,76,76,0.08)',   border: 'rgba(255,76,76,0.3)'   },
    high:     { color: '#FFB020', bg: 'rgba(255,176,32,0.08)',  border: 'rgba(255,176,32,0.3)'  },
    medium:   { color: '#00BFFF', bg: 'rgba(0,191,255,0.08)',   border: 'rgba(0,191,255,0.3)'   },
    low:      { color: '#00E5A0', bg: 'rgba(0,229,160,0.08)',   border: 'rgba(0,229,160,0.3)'   },
  };

  const countBy = (sev) => allAlerts.filter(a => a.severity === sev).length;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>Active Alerts</h2>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>
        {allAlerts.length} alerts across {patients.filter(p => p.alerts.length > 0).length} patients
      </div>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        {['critical','high','medium'].map(sev => {
          const cfg = cfgMap[sev];
          return (
            <div key={sev} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 10, padding: '10px 18px', minWidth: 90 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: cfg.color }}>{countBy(sev)}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 2 }}>{sev}</div>
            </div>
          );
        })}
      </div>

      {/* Alert rows */}
      {sorted.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 60, fontSize: 13 }}>✓ No active alerts</div>
      )}
      {sorted.map((alert, i) => {
        const cfg = cfgMap[alert.severity];
        return (
          <div key={i} style={{
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            borderLeft: `3px solid ${cfg.color}`,
            borderRadius: 10, padding: '14px 18px', marginBottom: 10,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.5 }}>{alert.msg}</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-cyan)' }}>{alert.patientId}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{alert.patientName}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {alert.ward} · Bed {alert.bed}</span>
              </div>
            </div>
            <span style={{
              color: cfg.color, fontSize: 9, fontWeight: 800, letterSpacing: '1.5px',
              background: cfg.bg, border: `1px solid ${cfg.border}`,
              borderRadius: 4, padding: '3px 8px', flexShrink: 0, marginTop: 2,
            }}>
              {alert.severity.toUpperCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ── Medications View ─────────────────────────────────────────────────────────
const MedicationsView = ({ patients }) => {
  const [search, setSearch] = useState('');

  const filtered = patients.map(p => ({
    ...p,
    medications: p.medications.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(p => p.medications.length > 0);

  const totalMeds   = patients.reduce((s, p) => s + p.medications.length, 0);
  const flaggedMeds = patients.reduce((s, p) => s + p.medications.filter(m => m.alert).length, 0);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>Medications</h2>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>
        {totalMeds} medications · {flaggedMeds} flagged
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Medications', value: totalMeds,   color: 'var(--accent-cyan)'     },
          { label: 'Flagged',           value: flaggedMeds, color: 'var(--status-critical)' },
          { label: 'Patients on Meds',  value: patients.filter(p => p.medications.length > 0).length, color: 'var(--status-stable)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 20px', flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search medications..."
          style={{
            width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '9px 12px 9px 34px',
            color: 'var(--text-primary)', fontSize: 13, outline: 'none',
          }}
        />
        <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', opacity: 0.3, fontSize: 14 }}>🔍</span>
      </div>

      {/* Medication tables per patient */}
      {filtered.map(p => (
        <div key={p.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.status === 'critical' ? 'var(--status-critical)' : p.status === 'at-risk' ? 'var(--status-risk)' : 'var(--status-stable)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)' }}>{p.id}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {p.ward} · Bed {p.bed}</span>
          </div>

          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
            {['Medication', 'Route', 'Freq', 'Status'].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</div>
            ))}
          </div>

          {p.medications.map((med, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px', gap: 8,
              padding: '9px 0',
              borderBottom: i < p.medications.length - 1 ? '1px solid var(--border)' : 'none',
              alignItems: 'center',
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: med.alert ? (med.alert === 'critical' ? '#FF7070' : '#FFB020') : 'var(--text-primary)' }}>{med.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{med.route}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{med.freq}</div>
              <div>
                {med.alert ? (
                  <span style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: '1px',
                    color: med.alert === 'critical' ? '#FF4C4C' : '#FFB020',
                    background: med.alert === 'critical' ? 'rgba(255,76,76,0.1)' : 'rgba(255,176,32,0.1)',
                    border: `1px solid ${med.alert === 'critical' ? 'rgba(255,76,76,0.3)' : 'rgba(255,176,32,0.3)'}`,
                    borderRadius: 4, padding: '2px 7px',
                  }}>
                    {med.alert.toUpperCase()}
                  </span>
                ) : (
                  <span style={{ fontSize: 11, color: 'var(--status-stable)' }}>✓ Clear</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// ── Analytics View ───────────────────────────────────────────────────────────
const AnalyticsView = ({ patients }) => {
  const alertCount  = patients.reduce((s, p) => s + p.alerts.length, 0);
  const critCount   = patients.filter(p => p.status === 'critical').length;
  const riskCount   = patients.filter(p => p.status === 'at-risk').length;
  const stableCount = patients.filter(p => p.status === 'stable').length;
  const avgNEWS2    = (patients.reduce((s, p) => s + p.newsScore, 0) / patients.length).toFixed(1);
  const avgAge      = Math.round(patients.reduce((s, p) => s + p.age, 0) / patients.length);

  const wardCounts = patients.reduce((acc, p) => {
    acc[p.ward] = (acc[p.ward] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>Analytics</h2>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>Ward-level clinical metrics overview</div>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Patients',    value: patients.length, color: 'var(--accent-cyan)'     },
          { label: 'Active Alerts',     value: alertCount,      color: 'var(--status-critical)' },
          { label: 'Critical',          value: critCount,       color: 'var(--status-critical)' },
          { label: 'At Risk',           value: riskCount,       color: 'var(--status-risk)'     },
          { label: 'Stable',            value: stableCount,     color: 'var(--status-stable)'   },
          { label: 'Avg NEWS2',         value: avgNEWS2,        color: 'var(--accent-cyan)'     },
          { label: 'Avg Patient Age',   value: avgAge,          color: 'var(--text-secondary)'  },
          { label: 'Wards Active',      value: Object.keys(wardCounts).length, color: 'var(--accent-cyan)' },
          { label: 'Flagged Meds',      value: patients.reduce((s,p) => s + p.medications.filter(m=>m.alert).length, 0), color: 'var(--status-risk)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* NEWS2 bar chart */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 18 }}>
          NEWS2 Score — All Patients
        </div>
        {[...patients].sort((a, b) => b.newsScore - a.newsScore).map(p => {
          const color = p.newsScore >= 7 ? 'var(--status-critical)' : p.newsScore >= 3 ? 'var(--status-risk)' : 'var(--status-stable)';
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 130, fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0 }}>{p.name}</div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 4, height: 10, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(p.newsScore / 12) * 100}%`, background: color, borderRadius: 4, transition: 'width 0.5s ease' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color, width: 24, textAlign: 'right', flexShrink: 0 }}>{p.newsScore}</div>
            </div>
          );
        })}
      </div>

      {/* Ward breakdown */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16 }}>
          Patients by Ward
        </div>
        {Object.entries(wardCounts).map(([ward, count]) => (
          <div key={ward} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 130, fontSize: 12, color: 'var(--text-secondary)', flexShrink: 0 }}>{ward}</div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 4, height: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(count / patients.length) * 100}%`, background: 'var(--accent-cyan)', borderRadius: 4, transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--accent-cyan)', width: 24, textAlign: 'right', flexShrink: 0 }}>{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── FHIR Resources View ──────────────────────────────────────────────────────
const FHIRView = () => {
  const resources = [
    {
      resource: 'Patient',
      desc: 'Demographics, identifiers, contact details, GP links',
      endpoint: '/api/v1/patients',
      methods: ['GET', 'POST'],
      fields: ['id', 'name', 'birthDate', 'gender', 'address', 'identifier'],
    },
    {
      resource: 'Observation',
      desc: 'Vitals, lab results, clinical measurements (NEWS2 inputs)',
      endpoint: '/api/v1/patients/:id/observations',
      methods: ['GET'],
      fields: ['code (LOINC)', 'valueQuantity', 'effectiveDateTime', 'status'],
    },
    {
      resource: 'MedicationRequest',
      desc: 'Prescriptions, dosage instructions, administration routes',
      endpoint: '/api/v1/patients/:id/medications',
      methods: ['GET', 'POST'],
      fields: ['medicationCodeableConcept (AMT)', 'dosageInstruction', 'status', 'authoredOn'],
    },
    {
      resource: 'AllergyIntolerance',
      desc: 'Documented allergies, adverse reactions, criticality',
      endpoint: '/api/v1/patients/:id/allergies',
      methods: ['GET'],
      fields: ['code (SNOMED CT-AU)', 'criticality', 'clinicalStatus', 'reaction'],
    },
    {
      resource: 'DetectedIssue',
      desc: 'Drug-drug interactions, allergy conflicts, clinical alerts',
      endpoint: '/api/v1/patients/:id/alerts',
      methods: ['GET'],
      fields: ['severity', 'code', 'detail', 'implicated', 'status'],
    },
    {
      resource: 'RiskAssessment',
      desc: 'NEWS2 score, sepsis prediction, deterioration risk with SHAP',
      endpoint: '/api/v1/patients/:id/risk-score',
      methods: ['GET'],
      fields: ['prediction.probability', 'prediction.outcome', 'basis', 'method'],
    },
  ];

  const methodColors = { GET: { color: '#00E5A0', bg: 'rgba(0,229,160,0.08)' }, POST: { color: '#00BFFF', bg: 'rgba(0,191,255,0.08)' } };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>FHIR R4 Resources</h2>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
        Aligned with the FHIR AU Implementation Guide & My Health Record ecosystem
      </div>

      {/* Compliance badges */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {['FHIR R4', 'FHIR AU', 'SNOMED CT-AU', 'AMT', 'LOINC', 'My Health Record'].map(badge => (
          <span key={badge} style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent-green)', background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: 20, padding: '3px 10px' }}>
            {badge}
          </span>
        ))}
      </div>

      {/* Resource cards */}
      {resources.map(({ resource, desc, endpoint, methods, fields }) => (
        <div key={resource} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 22px', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', marginTop: 1 }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{resource}</span>
              <span style={{ fontSize: 10, background: 'rgba(0,229,160,0.08)', color: 'var(--accent-green)', border: '1px solid rgba(0,229,160,0.2)', borderRadius: 4, padding: '1px 7px' }}>R4</span>
              {methods.map(m => (
                <span key={m} style={{ fontSize: 10, fontWeight: 700, color: methodColors[m].color, background: methodColors[m].bg, borderRadius: 4, padding: '1px 7px' }}>{m}</span>
              ))}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)', background: 'rgba(0,191,255,0.06)', border: '1px solid rgba(0,191,255,0.15)', borderRadius: 6, padding: '5px 12px', flexShrink: 0, marginLeft: 16 }}>
              {endpoint}
            </div>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{desc}</div>

          {/* Fields */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {fields.map(f => (
              <span key={f} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 8px' }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Main Dashboard ───────────────────────────────────────────────────────────
const PatientDashboard = () => {
  const [selectedId, setSelectedId]   = useState(null);
  const [activeNav, setActiveNav]     = useState('Ward Overview');
  const { patients, loading }         = usePatients();

  const selectedPatient = patients.find(p => p.id === selectedId) || null;

  const critCount   = patients.filter(p => p.status === 'critical').length;
  const riskCount   = patients.filter(p => p.status === 'at-risk').length;
  const stableCount = patients.filter(p => p.status === 'stable').length;
  const alertCount  = patients.reduce((s, p) => s + p.alerts.length, 0);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)', overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <div style={{ width: 240, flexShrink: 0, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>

        {/* Logo */}
        <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CaduceusLogo />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.3px' }}>CDSS</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Clinical Decision</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '10px 8px', flex: 1 }}>
          {NAV_ITEMS.map(({ label }) => {
            const isActive = activeNav === label;
            return (
              <div key={label} onClick={() => { setActiveNav(label); setSelectedId(null); }} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 12px', borderRadius: 8, marginBottom: 2, cursor: 'pointer',
                background:  isActive ? 'rgba(0,191,255,0.08)' : 'transparent',
                borderLeft:  `2px solid ${isActive ? 'var(--accent-cyan)' : 'transparent'}`,
                transition:  'all 0.15s',
              }}>
                <span style={{ fontSize: 13, color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: isActive ? 600 : 400 }}>
                  {label}
                </span>
                {label === 'Alerts' && alertCount > 0 && (
                  <span style={{ background: 'var(--status-critical)', color: 'white', borderRadius: 10, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>
                    {alertCount}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Ward Status */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 10, paddingLeft: 4 }}>
            Ward Status
          </div>
          {[
            { label: 'Critical', count: critCount,   color: 'var(--status-critical)' },
            { label: 'At Risk',  count: riskCount,   color: 'var(--status-risk)'     },
            { label: 'Stable',   count: stableCount, color: 'var(--status-stable)'   },
          ].map(({ label, count, color }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color }}>{count}</span>
            </div>
          ))}
        </div>

        {/* User */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #1A4060, #0D2535)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--accent-cyan)', fontWeight: 700 }}>
            IL
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Ishrak Latif</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Health Informatics</div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Ward Overview */}
        {activeNav === 'Ward Overview' && (
          <>
            <div style={{ width: selectedPatient ? 320 : '100%', flexShrink: 0, borderRight: selectedPatient ? '1px solid var(--border)' : 'none', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'width 0.25s ease' }}>
              {loading
                ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Loading patients...</div>
                : <PatientList patients={patients} selectedId={selectedId} onSelect={setSelectedId} />
              }
            </div>
            {selectedPatient && <PatientRecord patient={selectedPatient} onClose={() => setSelectedId(null)} />}
          </>
        )}

        {activeNav === 'Alerts'         && <AlertsView      patients={patients} />}
        {activeNav === 'Medications'    && <MedicationsView  patients={patients} />}
        {activeNav === 'Analytics'      && <AnalyticsView    patients={patients} />}
        {activeNav === 'FHIR Resources' && <FHIRView />}

      </div>
    </div>
  );
};

export default PatientDashboard;