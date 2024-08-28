const API_BASE_URL = "https://backend-sandy-rho.vercel.app/api";

export const fetchPlayersData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/players/Regular/Totals`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch players data failed:", error);
    return [];
  }
};

export const fetchTeamsData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/teams/Regular/Totals`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch teams data failed:", error);
    return [];
  }
};
