import { useState, useEffect, useCallback } from 'react';
import { patientAPI } from '../services/fhirClient';

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const res = await patientAPI.getAll();
      setPatients(res.data);
    } catch (err) {
      console.warn('API unavailable — using mock data');
      const { MOCK_PATIENTS } = await import('../utils/mockData');
      setPatients(MOCK_PATIENTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);
  return { patients, loading, refetch: fetchPatients };
};

export const usePatient = (patientId) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    patientAPI.getById(patientId)
      .then(res => setPatient(res.data))
      .catch(() => {
        import('../utils/mockData').then(({ MOCK_PATIENTS }) => {
          setPatient(MOCK_PATIENTS.find(p => p.id === patientId) || null);
        });
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  return { patient, loading };
};