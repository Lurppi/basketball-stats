const BASE_URL = 'https://backend-sandy-rho.vercel.app/api';

const handleFetchResponse = async (response) => {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Network response was not ok: ${errorMessage}`);
  }
  return response.json();
};

export const fetchPlayers = async (league, statsType) => {
  const response = await fetch(`${BASE_URL}/players/${league}/${statsType}`);
  return handleFetchResponse(response);
};

export const fetchTeams = async (league, statsType) => {
  const response = await fetch(`${BASE_URL}/teams/${league}/${statsType}`);
  return handleFetchResponse(response);
};
