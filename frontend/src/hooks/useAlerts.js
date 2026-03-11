import { useState, useEffect } from 'react';
import { alertAPI } from '../services/fhirClient';
import { sortAlertsBySeverity } from '../services/alertService';

export const useAlerts = (patientId) => {
  const [alerts, setAlerts]     = useState([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    alertAPI.getByPatient(patientId)
      .then(res => setAlerts(sortAlertsBySeverity(res.data)))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, [patientId]);

  const acknowledge = async (alertId) => {
    await alertAPI.acknowledge(alertId);
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  return { alerts, loading, acknowledge };
};