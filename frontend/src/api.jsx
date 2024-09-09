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
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Optionaler Authorization-Header, falls `authToken` übergeben wird
  const headersWithAuth = {
    ...defaultHeaders,
    ...(options.authToken ? { Authorization: `Bearer ${options.authToken}` } : {}),
  };

  const finalOptions = {
    method: 'GET',
    headers: headersWithAuth,
    mode: 'cors',
    ...options,
  };

  const response = await fetch(url, finalOptions);
  return handleFetchResponse(response);
};

// Hole immer nur PLAYERS.csv
export const fetchPlayers = async (authToken) => {
  return fetchWithHeaders(`${BASE_URL}/players?file=PLAYERS`, { authToken });
};

export const fetchTeams = async (authToken) => {
  return fetchWithHeaders(`${BASE_URL}/teams?file=TEAMS`, { authToken });
};

// api.js
export const fetchForm = async (authToken) => {
  return fetchWithHeaders(`${BASE_URL}/form`, { authToken });
};
