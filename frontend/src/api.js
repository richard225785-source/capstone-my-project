import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);

// Teams
export const getTeams = () => API.get('/teams');
export const addTeam = (data) => API.post('/teams', data);
export const deleteTeam = (id) => API.delete(`/teams/${id}`);

// Matches
export const getMatches = () => API.get('/matches');
export const createMatch = (data) => API.post('/matches', data);
export const updateScore = (id, data) => API.put(`/matches/${id}/score`, data);
export const deleteMatch = (id) => API.delete(`/matches/${id}`);

// Points Table
export const getPointsTable = () => API.get('/matches/points-table');

export default API;
