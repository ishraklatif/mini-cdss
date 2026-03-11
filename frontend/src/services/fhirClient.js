import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export const patientAPI = {
  getAll:    (params) => client.get("/patients/", { params }),
  getById:   (id)     => client.get(`/patients/${id}`),
  create:    (data)   => client.post("/patients/", data),
  delete:    (id)     => client.delete(`/patients/${id}`),
};

export const observationAPI = {
  getByPatient:  (patientId) => client.get(`/patients/${patientId}/observations`),
  getLatest:     (patientId) => client.get(`/patients/${patientId}/observations/latest`),
  create:        (patientId, data) => client.post(`/patients/${patientId}/observations`, data),
};

export const medicationAPI = {
  getByPatient:  (patientId) => client.get(`/patients/${patientId}/medications`),
  getAlerts:     (patientId) => client.get(`/patients/${patientId}/medications/alerts`),
  prescribe:     (patientId, data) => client.post(`/patients/${patientId}/medications`, data),
};

export const alertAPI = {
  getByPatient:  (patientId) => client.get(`/patients/${patientId}/alerts`),
  acknowledge:   (alertId, clinician = "Clinician") => client.post(`/patients/alerts/${alertId}/acknowledge?clinician=${clinician}`),
  regenerate:    (patientId) => client.post(`/patients/${patientId}/alerts/regenerate`),
};

export const riskScoreAPI = {
  getByPatient:  (patientId) => client.get(`/patients/${patientId}/risk-score`),
};
