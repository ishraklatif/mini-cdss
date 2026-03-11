import React from 'react';
import AlertPanel from '../alerts/AlertPanel';
import VitalsChart from '../vitals/VitalsChart';
import MedicationList from '../medications/MedicationList';
import { getVitalWarning, getNEWS2Risk } from '../../utils/newsScore';

const VitalBadge = ({ label, value, unit, warn }) => (
  <div style={{
    background: warn ? 'rgba(255,76,76,0.08)' : 'rgba(0,229,160,0.05)',
    border: `1px solid ${warn ? 'rgba(255,76,76,0.25)' : 'rgba(0,229,160,0.12)'}`,
    borderRadius: 8, padding: '10px 14px', minWidth: 90, flexShrink: 0,
  }}>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: warn ? '#FF7070' : 'var(--accent-green)', letterSpacing: '-0.5px' }}>
      {value}
    </div>
    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 2 }}>{label}</div>
    {unit && <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>{unit}</div>}
  </div>
);

const FHIR_RESOURCES = ['Patient', 'Observation', 'MedicationRequest', 'AllergyIntolerance', 'DetectedIssue'];

const PatientRecord = ({ patient, onClose }) => {
  if (!patient) return null;
  const risk = getNEWS2Risk(patient.newsScore);
  const { hr, bp, spo2, temp, rr, gcs } = patient.vitals;

  return (
    <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-primary)' }}>

      {/* Sticky Header */}
      <div style={{
        padding: '18px 28px', borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, rgba(0,229,160,0.04) 0%, transparent 100%)',
        position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{patient.name}</h2>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 4 }}>
                {patient.id}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {patient.age}y · {patient.ward} · Bed {patient.bed} · Admitted {patient.admittedDate} · {patient.consultant}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, fontStyle: 'italic' }}>{patient.diagnosis}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 700, color: risk.color, lineHeight: 1 }}>{patient.newsScore}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 3 }}>NEWS2</div>
              <div style={{ fontSize: 10, color: risk.color, marginTop: 2 }}>{risk.label}</div>
            </div>
            <button onClick={onClose} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', borderRadius: 8,
              padding: '8px 14px', fontSize: 12,
            }}>
              ✕ Close
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Alerts */}
        <AlertPanel alerts={patient.alerts} />

        {/* Current Vitals */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
            Current Vitals
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <VitalBadge label="Heart Rate"    value={hr}       unit="bpm"          warn={getVitalWarning('hr',   hr)}   />
            <VitalBadge label="Blood Pressure" value={bp}      unit="mmHg"         warn={false}                         />
            <VitalBadge label="SpO₂"           value={`${spo2}%`} unit="oxygen sat" warn={getVitalWarning('spo2', spo2)} />
            <VitalBadge label="Temperature"    value={`${temp}°C`} unit="celsius"  warn={getVitalWarning('temp', temp)} />
            <VitalBadge label="Resp Rate"      value={rr}       unit="breaths/min" warn={getVitalWarning('rr',   rr)}   />
            <VitalBadge label="GCS"            value={gcs}      unit="score"       warn={getVitalWarning('gcs',  gcs)}  />
          </div>
        </div>

        {/* Vitals Trend */}
        <VitalsChart history={patient.vitalsHistory} />

        {/* Medications + FHIR */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <MedicationList medications={patient.medications} allergies={patient.allergies} />

          {/* FHIR Resources panel */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
              FHIR R4 Resources
            </div>
            {FHIR_RESOURCES.map(r => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-green)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>{r}</span>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', background: 'rgba(0,229,160,0.06)', padding: '1px 6px', borderRadius: 4 }}>
                  AU compliant
                </span>
              </div>
            ))}
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Aligned with <span style={{ color: 'var(--accent-green)' }}>FHIR AU</span> implementation guide & <span style={{ color: 'var(--accent-green)' }}>My Health Record</span> ecosystem
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientRecord;