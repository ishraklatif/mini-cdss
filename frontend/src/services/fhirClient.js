import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Intercept requests — attach auth token when ready
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('cdss_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const patientAPI = {
  getAll:   ()         => client.get('/patients'),
  getById:  (id)       => client.get(`/patients/${id}`),
  search:   (query)    => client.get('/patients', { params: { search: query } }),
};

export const observationAPI = {
  getByPatient: (patientId) => client.get(`/patients/${patientId}/observations`),
  getLatest:    (patientId) => client.get(`/patients/${patientId}/observations/latest`),
};

export const medicationAPI = {
  getByPatient: (patientId) => client.get(`/patients/${patientId}/medications`),
  checkAlerts:  (patientId) => client.get(`/patients/${patientId}/medications/alerts`),
};

export const alertAPI = {
  getByPatient: (patientId) => client.get(`/patients/${patientId}/alerts`),
  acknowledge:  (alertId)   => client.post(`/alerts/${alertId}/acknowledge`),
};

export const riskScoreAPI = {
  getScore: (patientId) => client.get(`/patients/${patientId}/risk-score`),
};

export default client;