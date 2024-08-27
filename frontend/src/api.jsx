// src/api.jsx
export const fetchPlayers = async (league, statsType) => {
  try {
    // Die URL hier anpassen
    const response = await fetch(`http://localhost:5000/api/players/${league}/${statsType}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch players:', error);
    throw error;
  }
};

export const fetchTeams = async (league, statsType) => {
  try {
    // Die URL hier anpassen
    const response = await fetch(`http://localhost:5000/api/teams/${league}/${statsType}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch teams:', error);
    throw error;
  }
};
