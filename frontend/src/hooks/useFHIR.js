import { useState, useEffect } from "react";
import { patientAPI } from "../services/fhirClient";
import { MOCK_PATIENTS } from "../utils/mockData";

export function usePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [source, setSource]     = useState("api");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await patientAPI.getAll();
        setPatients(response.data);
        setSource("api");
      } catch (err) {
        console.warn("Backend unavailable, falling back to mock data:", err.message);
        setPatients(MOCK_PATIENTS);
        setSource("mock");
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return { patients, loading, error, source };
}

export function usePatient(patientId) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!patientId) { setLoading(false); return; }

    const fetchPatient = async () => {
      try {
        const response = await patientAPI.getById(patientId);
        setPatient(response.data);
      } catch (err) {
        console.warn("Falling back to mock for patient:", patientId);
        const mock = MOCK_PATIENTS.find(p => p.id === patientId) || null;
        setPatient(mock);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [patientId]);

  return { patient, loading, error };
}