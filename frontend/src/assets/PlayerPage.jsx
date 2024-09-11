import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './PlayerPage.css'; // CSS für das Grid-Layout und weitere Stile

const PlayerPage = () => {
  const { id } = useParams(); // Spieler-ID aus der URL
  const [playerData, setPlayerData] = useState(null);
  const [lastGames, setLastGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Player Details
  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await fetch(`https://backend-sandy-rho.vercel.app/api/players?file=PLAYERS`);
        const data = await response.json();
        const player = data.find((p) => p.PLAYER_ID === id); // Suche den Spieler anhand der ID
        setPlayerData(player);

        const responseLastGames = await fetch('https://backend-sandy-rho.vercel.app/api/form?file=matchdata');
        const gamesData = await responseLastGames.json();
        const games = gamesData.filter((game) => game.PLAYER_ID === id); // Letzte Spiele des Spielers
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
      <div className="playerpage-content">
        {playerData && (
          <div className="playerpage-profile">
            <div className="playerpage-header" style={{ backgroundColor: '#900' }}>
              <div className="playerpage-info">
                <h1>{playerData.PLAYER}</h1>
                <p>#{playerData.JERSEY_NUMBER} | {playerData.POS}</p>
                <p>{playerData.TEAM}</p>
              </div>
              <div className="playerpage-stats-overview">
                <div>
                  <h4>PPG</h4>
                  <p>{playerData.PPG}</p>
                </div>
                <div>
                  <h4>RPG</h4>
                  <p>{playerData.RPG}</p>
                </div>
                <div>
                  <h4>APG</h4>
                  <p>{playerData.APG}</p>
                </div>
                <div>
                  <h4>PIE</h4>
                  <p>{playerData.PIE}</p>
                </div>
              </div>
            </div>

            {/* Last 5 Games */}
            <div className="playerpage-last-games">
              <h2>Last 5 Games</h2>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Matchup</th>
                    <th>W/L</th>
                    <th>PTS</th>
                    <th>REB</th>
                    <th>AST</th>
                    <th>STL</th>
                    <th>BLK</th>
                    <th>TO</th>
                  </tr>
                </thead>
                <tbody>
                  {lastGames.slice(0, 5).map((game, idx) => (
                    <tr key={idx}>
                      <td>{game.Date}</td>
                      <td>{game.Matchup}</td>
                      <td>{game.WinLoss}</td>
                      <td>{game.PTS}</td>
                      <td>{game.REB}</td>
                      <td>{game.AST}</td>
                      <td>{game.STL}</td>
                      <td>{game.BLK}</td>
                      <td>{game.TO}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PlayerPage;
