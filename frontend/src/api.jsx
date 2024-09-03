// api.js
const BASE_URL = 'https://backend-sandy-rho.vercel.app/api';

const handleFetchResponse = async (response) => {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Network response was not ok: ${errorMessage}`);
  }
  return response.json();
};

const fetchWithHeaders = async (url, options = {}) => {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer your-token-here', // Falls nötig
    },
    mode: 'cors', // Wichtig, um CORS-Anfragen korrekt zu senden
  };

  const finalOptions = { ...defaultOptions, ...options };
  const response = await fetch(url, finalOptions);
  return handleFetchResponse(response);
};

export const fetchPlayers = async (file) => {
  return fetchWithHeaders(`${BASE_URL}/players?file=${file}`);
};

export const fetchTeams = async (file) => {
  return fetchWithHeaders(`${BASE_URL}/teams?file=${file}`);
};
