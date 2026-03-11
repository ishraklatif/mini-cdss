/**
 * Alert severity classification service
 * Mirrors logic from FHIR DetectedIssue resource severity coding
 */

export const SEVERITY = {
    CRITICAL: 'critical',
    HIGH:     'high',
    MEDIUM:   'medium',
    LOW:      'low',
  };
  
  export const ALERT_CONFIG = {
    critical: {
      label:  'CRITICAL',
      color:  '#FF4C4C',
      bg:     'rgba(255,76,76,0.08)',
      border: 'rgba(255,76,76,0.3)',
    },
    high: {
      label:  'HIGH',
      color:  '#FFB020',
      bg:     'rgba(255,176,32,0.08)',
      border: 'rgba(255,176,32,0.3)',
    },
    medium: {
      label:  'MEDIUM',
      color:  '#00BFFF',
      bg:     'rgba(0,191,255,0.08)',
      border: 'rgba(0,191,255,0.3)',
    },
    low: {
      label:  'LOW',
      color:  '#00E5A0',
      bg:     'rgba(0,229,160,0.08)',
      border: 'rgba(0,229,160,0.3)',
    },
  };
  
  export const sortAlertsBySeverity = (alerts) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return [...alerts].sort((a, b) => order[a.severity] - order[b.severity]);
  };
  
  export const countAlertsBySeverity = (alerts) =>
    alerts.reduce((acc, a) => {
      acc[a.severity] = (acc[a.severity] || 0) + 1;
      return acc;
    }, {});