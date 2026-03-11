import React from 'react';
import { ALERT_CONFIG, sortAlertsBySeverity } from '../../services/alertService';

const AlertPanel = ({ alerts = [] }) => {
  if (alerts.length === 0) return (
    <div style={{ padding: '14px 16px', background: 'rgba(0,229,160,0.04)', border: '1px solid rgba(0,229,160,0.1)', borderRadius: 10, fontSize: 12, color: 'var(--text-muted)' }}>
      ✓ No active alerts for this patient
    </div>
  );

  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10 }}>
        ⚠ Active Alerts ({alerts.length})
      </div>
      {sortAlertsBySeverity(alerts).map((alert, i) => {
        const cfg = ALERT_CONFIG[alert.severity];
        return (
          <div key={alert.id || i} style={{
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderLeft: `3px solid ${cfg.color}`,
            borderRadius: 8, padding: '12px 16px', marginBottom: 8,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{alert.msg}</span>
            <span style={{
              color: cfg.color, fontSize: 9, fontWeight: 800,
              letterSpacing: '1.5px', marginLeft: 12, flexShrink: 0,
              background: cfg.bg, border: `1px solid ${cfg.border}`,
              borderRadius: 4, padding: '2px 7px',
            }}>
              {cfg.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default AlertPanel;