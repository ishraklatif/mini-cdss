import React from 'react';
import { ALERT_CONFIG } from '../../services/alertService';

const MedicationList = ({ medications = [], allergies = [] }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 }}>
      Medications ({medications.length})
    </div>
    {medications.map((med, i) => {
      const cfg = med.alert ? ALERT_CONFIG[med.alert] : null;
      return (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '9px 0',
          borderBottom: i < medications.length - 1 ? '1px solid var(--border)' : 'none',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: cfg ? cfg.color : 'var(--text-primary)' }}>
              {med.name}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
              {med.route} · {med.freq}
            </div>
          </div>
          {cfg && (
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: '1px',
              color: cfg.color, background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              borderRadius: 4, padding: '2px 7px',
            }}>
              {cfg.label}
            </span>
          )}
        </div>
      );
    })}

    {allergies.length > 0 && (
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--status-critical)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
          ⚠ Allergies
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {allergies.map((a, i) => (
            <span key={i} style={{
              background: 'rgba(255,76,76,0.08)', border: '1px solid rgba(255,76,76,0.2)',
              color: '#FF9090', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 500,
            }}>
              {a}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default MedicationList;