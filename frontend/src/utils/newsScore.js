/**
 * NEWS2 Score Calculator
 * Based on Royal College of Physicians NEWS2 guidelines
 * Mirrors clinical logic used in Alcidion Miya Logic CDS engine
 */

export const calculateNEWS2 = ({ rr, spo2, hr, temp, gcs, onSupplementalO2 = false }) => {
    let score = 0;
  
    // Respiration rate
    if (rr <= 8) score += 3;
    else if (rr <= 11) score += 1;
    else if (rr <= 20) score += 0;
    else if (rr <= 24) score += 2;
    else score += 3;
  
    // SpO2 (Scale 1 — no hypercapnic respiratory failure)
    if (spo2 <= 91) score += 3;
    else if (spo2 <= 93) score += 2;
    else if (spo2 <= 95) score += 1;
    else score += 0;
  
    // Supplemental O2
    if (onSupplementalO2) score += 2;
  
    // Temperature
    if (temp <= 35.0) score += 3;
    else if (temp <= 36.0) score += 1;
    else if (temp <= 38.0) score += 0;
    else if (temp <= 39.0) score += 1;
    else score += 2;
  
    // Heart rate
    if (hr <= 40) score += 3;
    else if (hr <= 50) score += 1;
    else if (hr <= 90) score += 0;
    else if (hr <= 110) score += 1;
    else if (hr <= 130) score += 2;
    else score += 3;
  
    // GCS
    if (gcs < 15) score += 3;
  
    return score;
  };
  
  export const getNEWS2Risk = (score) => {
    if (score === 0) return { level: 'low', label: 'Low', color: 'var(--status-stable)' };
    if (score <= 4) return { level: 'low-medium', label: 'Low–Medium', color: 'var(--accent-cyan)' };
    if (score <= 6) return { level: 'medium', label: 'Medium', color: 'var(--status-risk)' };
    return { level: 'high', label: 'High', color: 'var(--status-critical)' };
  };
  
  export const getVitalWarning = (type, value) => {
    const thresholds = {
      hr:   { low: 50, high: 100 },
      spo2: { low: 94 },
      temp: { low: 36.0, high: 38.0 },
      rr:   { low: 12, high: 20 },
      gcs:  { low: 15 },
    };
    const t = thresholds[type];
    if (!t) return false;
    if (t.low  !== undefined && value <  t.low)  return true;
    if (t.high !== undefined && value >  t.high) return true;
    return false;
  };