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

export const fetchPlayers = async (file, authToken) => {
  return fetchWithHeaders(`${BASE_URL}/players?file=${file}`, { authToken });
};

export const fetchTeams = async (file, authToken) => {
  return fetchWithHeaders(`${BASE_URL}/teams?file=${file}`, { authToken });
};
