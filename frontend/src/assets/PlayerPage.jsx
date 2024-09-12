import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './PlayerPage.css';

const PlayerPage = () => {
  const { id } = useParams(); // Player ID from URL
  const [playerData, setPlayerData] = useState(null);
  const [lastGames, setLastGames] = useState([]);
  const [activeTab, setActiveTab] = useState('profile'); // For Profile and Stats Tabs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to calculate age
  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate.split('.').reverse().join('-')); // Format TT.MM.YYYY in YYYY-MM-DD konvertieren
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
        // Fetch player data
        const playerResponse = await fetch(`https://backend-sandy-rho.vercel.app/api/players/stats/${id}`);
        const playerData = await playerResponse.json();

        // Check if playerData is an object and not an array
        if (!playerData || typeof playerData !== 'object') {
          throw new Error('Player data not found or invalid format');
        }

        setPlayerData(playerData); // Object expected
        console.log('Player data:', playerData);

        // Fetch last 10 games (use new route)
        const gamesResponse = await fetch(`https://backend-sandy-rho.vercel.app/api/playerdetails/last10games/${id}`);
        const games = await gamesResponse.json();

        if (!games || games.length === 0) {
          throw new Error('No games found for player');
        }

        setLastGames(games); // Use games directly
        console.log('Last 10 games:', games);

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

  // Dynamische Darstellung für die Statistiken im "Stats"-Reiter
  const renderStatsTable = () => {
    if (!playerData) {
      return <p>No stats available</p>;
    }

    return (
      <table className="playerpage-table-container">
        <thead>
          <tr>
            <th>By Year</th>
            <th>League</th>
            <th>Team</th>
            <th>GP</th>
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
            <th>TOV</th>
            <th>STL</th>
            <th>BLK</th>
            <th>PF</th>
            <th>EF</th>
            <th>DD2</th>
            <th>TD3</th>
            <th>FIC</th>
          </tr>
        </thead>
        <tbody>
          {/* Render stat rows */}
          <tr>
            <td>{playerData.SEASON_YEAR}</td>
            <td>{playerData.LEAGUE}</td>
            <td>{playerData.TEAM}</td>
            <td>{playerData.GP}</td>
            <td>{playerData.MP}</td>
            <td>{playerData.PTS}</td>
            <td>{playerData.FGM}</td>
            <td>{playerData.FGA}</td>
            <td>{(playerData['FG%'] * 100).toFixed(1)}</td>
            <td>{playerData['3PM']}</td>
            <td>{playerData['3PA']}</td>
            <td>{(playerData['3P%'] * 100).toFixed(1)}</td>
            <td>{playerData['FTM']}</td>
            <td>{playerData['FTA']}</td>
            <td>{(playerData['FT%'] * 100).toFixed(1)}</td>
            <td>{playerData.OR}</td>
            <td>{playerData.DR}</td>
            <td>{playerData.RB}</td>
            <td>{playerData.AS}</td>
            <td>{playerData.TO}</td>
            <td>{playerData.ST}</td>
            <td>{playerData.BS}</td>
            <td>{playerData.PF}</td>
            <td>{playerData.FP}</td>
            <td>{playerData.DD}</td>
            <td>{playerData.TD}</td>
            <td>{playerData.FIC}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="playerpage-grid-container">
      <Header />

      {playerData && (
        <div className="playerpage-fixed-container">
          <div className="playerpage-profile-modern">
            <h1 className="player-name">{playerData.PLAYER}</h1>
            <div className="team-position">
              <div>
                <p className="team-name">{playerData.TEAM_long}</p>
                <p className="position">{playerData.POS}</p>
              </div>
            </div>
            <div className="player-info-modern">
              <div className="info-item">
                <h4>Offensive Role</h4>
                <p>{playerData.ROLE}</p>
              </div>
              <div className="info-item">
                <h4>Born</h4>
                <p>{playerData.BIRTHDATE}</p>
              </div>
              <div className="info-item">
                <h4>Age</h4>
                <p>{calculateAge(playerData.BIRTHDATE)} years</p>
              </div>
            </div>
          </div>

          {/* Stat Circles */}
          <div className="player-stats-circle-container">
            <div className="player-stats-circle">
              <h4>{playerData.PPG}</h4>
              <p>PTS</p>
            </div>
            <div className="player-stats-circle">
              <h4>{playerData.RPG}</h4>
              <p>REB</p>
            </div>
            <div className="player-stats-circle">
              <h4>{playerData.APG}</h4>
              <p>AST</p>
            </div>
            <div className="player-stats-circle">
              <h4>{playerData.PER}</h4>
              <p>PER</p>
            </div>
            <div className="player-stats-circle">
              <h4>{playerData.PIE}</h4>
              <p>PIE</p>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb navigation */}
      <div className="breadcrumb-container">
        <div className="breadcrumb-menu">
          <button className={activeTab === 'profile' ? 'breadcrumb-active' : ''} onClick={() => setActiveTab('profile')}>Profile</button>
          <button className={activeTab === 'stats' ? 'breadcrumb-active' : ''} onClick={() => setActiveTab('stats')}>Stats</button>
        </div>
      </div>

      {/* Conditional Rendering based on Active Tab */}
      {activeTab === 'profile' && (
        <div className="playerpage-lastgames">
          <h2>Last 10 Games</h2>
          <div className="playerpage-table-wrapper">
            <table className="playerpage-table-container">
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
                    <td>{(game['FG%'] * 100).toFixed(1)}</td>
                    <td>{game['3PM']}</td>
                    <td>{game['3PA']}</td>
                    <td>{(game['3P%'] * 100).toFixed(1)}</td>
                    <td>{game['FTM']}</td>
                    <td>{game['FTA']}</td>
                    <td>{(game['FT%'] * 100).toFixed(1)}</td>
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
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="playerpage-stats">
          <h2>Stats (Traditional and Advanced)</h2>
          <div className="player-stats-tables">
            {renderStatsTable()}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PlayerPage;