export const fetchPlayers = async (league, statsType) => {
  const response = await fetch(`https://backend-sandy-rho.vercel.app/api/players/${league}/${statsType}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};

export const fetchTeams = async (league, statsType) => {
  const response = await fetch(`https://backend-sandy-rho.vercel.app/api/teams/${league}/${statsType}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
};
