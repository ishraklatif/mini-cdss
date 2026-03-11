import { useState, useEffect, useCallback } from "react";
import { alertAPI } from "../services/fhirClient";
import { MOCK_PATIENTS } from "../utils/mockData";

export function useAlerts(patientId) {
  const [alerts, setAlerts]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    if (!patientId) { setLoading(false); return; }
    try {
      const response = await alertAPI.getByPatient(patientId);
      setAlerts(response.data.map(a => ({ ...a, msg: a.msg || a.message })));
    } catch (err) {
      console.warn("Falling back to mock alerts for:", patientId);
      const mock = MOCK_PATIENTS.find(p => p.id === patientId);
      setAlerts(mock?.alerts || []);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const acknowledge = async (alertId) => {
    try {
      await alertAPI.acknowledge(alertId);
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch {
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    }
  };

  return { alerts, loading, acknowledge, refetch: fetchAlerts };
}