import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './PlayerPage.css';

const PlayerPage = () => {
  const { id } = useParams(); // Player ID aus der URL
  const [playerData, setPlayerData] = useState(null);
  const [lastGames, setLastGames] = useState([]);
  const [activeTab, setActiveTab] = useState('profile'); // Für Profil und Stats Tabs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funktion zum Berechnen des Alters
  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        // Abrufen der Spielerinformationen
        const playerResponse = await fetch(`https://backend-sandy-rho.vercel.app/api/players?file=PLAYERS`);
        const playerData = await playerResponse.json();

        // Spieler anhand der PlayerID finden
        const player = playerData.find((p) => p.PlayerID === id); // Die PlayerID wird jetzt korrekt verwendet
        if (!player) {
          throw new Error('Player not found');
        }

        setPlayerData(player);
        console.log('Player data:', player);

        // Abrufen der letzten 10 Spiele
        const gamesResponse = await fetch(`https://backend-sandy-rho.vercel.app/api/playerdetails`);
        const gamesData = await gamesResponse.json();
        const games = gamesData.filter((game) => game.PlayerID === id); // Finde Spiele für den Spieler anhand der PlayerID
        if (games.length === 0) {
          throw new Error('No games found for player');
        }

        setLastGames(games.slice(0, 10)); // Die letzten 10 Spiele
        console.log('Last 10 games:', games.slice(0, 10));

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="playerpage-grid-container">
      <Header />

      {playerData && (
        <div className="playerpage-profile">
          <h1>{playerData.PLAYER}</h1>
          <div className="player-info">
            <p>Team: {playerData.TEAM}</p>
            <p>Position: {playerData.POS}</p>
            <p>Offensive Role: {playerData.ROLE}</p>
            <p>Born: {playerData.BIRTHDATE}</p>
            <p>Age: {calculateAge(playerData.BIRTHDATE)} years</p>
          </div>
          <div className="player-stats">
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
              <h4>PER</h4>
              <p>{playerData.PER}</p>
            </div>
            <div>
              <h4>PIE</h4>
              <p>{playerData.PIE}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs für Profil und Stats */}
      <div className="playerpage-tabs">
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          Stats
        </button>
      </div>

      {/* Profil - Last 10 Games */}
      {activeTab === 'profile' && (
        <div className="playerpage-lastgames">
          <h2>Last 10 Games</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Matchup</th>
                <th>W/L</th>
                <th>MIN</th>
                <th>PTS</th>
                <th>FGM</th>
                <th>FGA</th>
                <th>FG%</th>
                <th>3PM</th>
                <th>3PA</th>
                <th>3P%</th>
                <th>FTM</th>
                <th>FTA</th>
                <th>FT%</th>
                <th>OREB</th>
                <th>DREB</th>
                <th>REB</th>
                <th>AST</th>
                <th>STL</th>
                <th>BLK</th>
                <th>TOV</th>
                <th>PF</th>
                <th>+/-</th>
              </tr>
            </thead>
            <tbody>
              {lastGames.map((game, index) => (
                <tr key={index}>
                  <td>{game.Date}</td>
                  <td>{`${game.Team} ${game.Location === '1' ? 'vs' : '@'} ${game.Opponent}`}</td>
                  <td>{game.WIN === '1' ? 'W' : 'L'}</td>
                  <td>{game.MP}</td>
                  <td>{game.PTS}</td>
                  <td>{game.FGM}</td>
                  <td>{game.FGA}</td>
                  <td>{game['FG%']}</td>
                  <td>{game['3PM']}</td>
                  <td>{game['3PA']}</td>
                  <td>{game['3P%']}</td>
                  <td>{game['FTM']}</td>
                  <td>{game['FTA']}</td>
                  <td>{game['FT%']}</td>
                  <td>{game.OR}</td>
                  <td>{game.DR}</td>
                  <td>{game.RB}</td>
                  <td>{game.AS}</td>
                  <td>{game.ST}</td>
                  <td>{game.BS}</td>
                  <td>{game.TO}</td>
                  <td>{game.PF}</td>
                  <td>{game.PTMARGIN}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stats Tab (leere Tabellen, die später gefüllt werden) */}
      {activeTab === 'stats' && (
        <div className="playerpage-stats">
          <h2>Stats (Traditional and Advanced)</h2>
          <div className="player-stats-tables">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Traditional Stats</td>
                  <td>Data to be filled</td>
                </tr>
              </tbody>
            </table>

            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Advanced Stats</td>
                  <td>Data to be filled</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PlayerPage;
