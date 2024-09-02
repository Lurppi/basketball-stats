// api.jsx
const BASE_URL = 'https://backend-sandy-rho.vercel.app/api';

const handleFetchResponse = async (response) => {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Network response was not ok: ${errorMessage}`);
  }
  return response.json();
};

export const fetchPlayers = async (file) => {
  const response = await fetch(`${BASE_URL}/players?file=${file}`);
  return handleFetchResponse(response);
};

export const fetchTeams = async (file) => {
  const response = await fetch(`${BASE_URL}/teams?file=${file}`);
  return handleFetchResponse(response);
};
