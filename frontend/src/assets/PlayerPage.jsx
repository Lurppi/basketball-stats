import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './PlayerPage.css';

const PlayerPage = () => {
  const { id } = useParams(); // Player ID from URL
  const [playerData, setPlayerData] = useState(null);
  const [lastGames, setLastGames] = useState([]);
  const [seasonStats, setSeasonStats] = useState(null); // State für Season Stats
  const [activeTab, setActiveTab] = useState('profile'); // For Profile and Stats Tabs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to calculate age
  const calculateAge = (birthDate) => {
    // Das Format TT.MM.YYYY in ein JavaScript-Date-Objekt konvertieren
    const [day, month, year] = birthDate.split('.'); // Datum splitten
    const birth = new Date(`${year}-${month}-${day}`); // Neues Datum im Format YYYY-MM-DD

    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;  // Wenn der Geburtstag in diesem Jahr noch nicht war, Alter um 1 reduzieren
    }

    return age;
  };

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        // Fetch Season Stats from new route
        const seasonStatsResponse = await fetch(`https://backend-sandy-rho.vercel.app/api/players/stats/${id}`);
        const seasonStatsData = await seasonStatsResponse.json();

        setSeasonStats(seasonStatsData);
        console.log('Season stats data:', seasonStatsData);

        // Fetch last 10 games (use new route)
        const gamesResponse = await fetch(`https://backend-sandy-rho.vercel.app/api/playerdetails/last10games/${id}`);
        const games = await gamesResponse.json();

        if (games.length === 0) {
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

  return (
    <div className="playerpage-grid-container">
      <Header />

      {seasonStats && (
        <div className="playerpage-fixed-container">
          <div className="playerpage-profile-modern">
            <h1 className="player-name">{seasonStats.PLAYER}</h1>
            <div className="team-position">
              <div>
                <p className="team-name">{seasonStats.TEAM}</p>
                <p className="position">{seasonStats.POS}</p>
              </div>
            </div>
            <div className="player-info-modern">
              <div className="info-item">
                <h4>Offensive Role</h4>
                <p>{seasonStats.ROLE}</p>
              </div>
              <div className="info-item">
                <h4>Born</h4>
                <p>{seasonStats.BIRTHDATE}</p>
              </div>
              <div className="info-item">
                <h4>Age</h4>
                <p>{calculateAge(seasonStats.BIRTHDATE)} years</p>
              </div>
            </div>
          </div>

          {/* Stat Circles */}
          <div className="player-stats-circle-container">
            <div className="player-stats-circle">
              <h4>{seasonStats.PPG}</h4>
              <p>PTS</p>
            </div>
            <div className="player-stats-circle">
              <h4>{seasonStats.RPG}</h4>
              <p>REB</p>
            </div>
            <div className="player-stats-circle">
              <h4>{seasonStats.APG}</h4>
              <p>AST</p>
            </div>
            <div className="player-stats-circle">
              <h4>{seasonStats.PER}</h4>
              <p>PER</p>
            </div>
            <div className="player-stats-circle">
              <h4>{seasonStats.PIE}</h4>
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

      {/* Last 10 Games Table */}
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
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PlayerPage;
