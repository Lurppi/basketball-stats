import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './PlayerPage.css';

const PlayerPage = () => {
  const { id } = useParams(); // ID aus URL (wird PLAYER_ID sein)
  const [playerData, setPlayerData] = useState(null);
  const [lastGames, setLastGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await fetch(`https://backend-sandy-rho.vercel.app/api/playerdetails`);
        const data = await response.json();
        const player = data.find((p) => p.PLAYER_ID === id); // Spieler mit passender PLAYER_ID suchen
        setPlayerData(player);

        const responseLastGames = await fetch('https://backend-sandy-rho.vercel.app/api/form?file=matchdata');
        const gamesData = await responseLastGames.json();
        const games = gamesData.filter((game) => game.PLAYER_ID === id);
        setLastGames(games);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className="playerpage-grid-container">
      <Header />
      {playerData && (
        <div className="playerpage-profile">
          <h1>{playerData.PLAYER}</h1>
          <p>Born: {playerData.BIRTH_DATE}</p>
          <p>Position: {playerData.POSITION}</p>
          <p>Team: {playerData.TEAM}</p>
          {/* ...and other player info */}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PlayerPage;
