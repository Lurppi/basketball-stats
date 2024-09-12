import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './PlayerPage.css';

const PlayerPage = () => {
  const { id } = useParams(); // Player ID from URL
  const [playerData, setPlayerData] = useState(null);
  const [lastGames, setLastGames] = useState([]);
  const [seasonTypes, setSeasonTypes] = useState([]); // Store available season types
  const [activeTab, setActiveTab] = useState('profile'); // For Profile and Stats Tabs
  const [seasonType, setSeasonType] = useState(''); // Selected season type
  const [statsType, setStatsType] = useState('Totals'); // Selected stats type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to calculate age
  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate.split('.').reverse().join('-')); // Adjust for DD.MM.YYYY format
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

        if (!playerData) {
          throw new Error('Player not found');
        }

        setPlayerData(playerData); // playerData ist nun ein Objekt
        console.log('Player data:', playerData);

        // Fetch last 10 games (use new route)
        const gamesResponse = await fetch(`https://backend-sandy-rho.vercel.app/api/playerdetails/last10games/${id}`);
        const games = await gamesResponse.json();

        if (!games.length) {
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

  const handleSeasonTypeChange = (e) => {
    setSeasonType(e.target.value);
  };

  const handleStatsTypeChange = (e) => {
    setStatsType(e.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="playerpage-grid-container">
      <Header />

      {playerData && (
        <div className="playerpage-fixed-container">
          <div className="playerpage-profile-modern">
            <h1 className="player-name">{playerData.PLAYER}</h1>
            <div className="team-position">
              <div>
                <p className="team-name">{playerData.TEAM}</p>
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

      {/* Filter area for season type and stats type */}
      {activeTab === 'stats' && (
        <div className="filter-container">
          <label>Season Type:</label>
          <select value={seasonType} onChange={handleSeasonTypeChange}>
            {seasonTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <label>Stats Type:</label>
          <select value={statsType} onChange={handleStatsTypeChange}>
            <option value="Totals">Totals</option>
            <option value="Averages">Averages</option>
          </select>
        </div>
      )}

      {/* Display the player's last 10 games */}
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

      {/* Stats Tab (Traditional and Advanced) */}
      {activeTab === 'stats' && (
        <div className="playerpage-stats">
          <h2>Stats (Traditional and Advanced)</h2>

          {/* Traditional Splits Table */}
          <div className="player-stats-tables">
            <h3>Traditional Splits</h3>
            {statsType === 'Totals' ? (
              <table>
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
                  {playerData
                    .filter((season) => season.SEASON_TYPE === seasonType)
                    .map((season) => (
                      <tr key={season.SEASON_YEAR}>
                        <td>{`${season.SEASON_YEAR.slice(0, 4)}-${season.SEASON_YEAR.slice(4)}`}</td>
                        <td>{season.LEAGUE}</td>
                        <td>{season.TEAM}</td>
                        <td>{season.GP}</td>
                        <td>{season.MP}</td>
                        <td>{season.PTS}</td>
                        <td>{season.FGM}</td>
                        <td>{season.FGA}</td>
                        <td>{season['FG%']}</td>
                        <td>{season['3PM']}</td>
                        <td>{season['3PA']}</td>
                        <td>{season['3P%']}</td>
                        <td>{season.FTM}</td>
                        <td>{season.FTA}</td>
                        <td>{season['FT%']}</td>
                        <td>{season.OR}</td>
                        <td>{season.DR}</td>
                        <td>{season.RB}</td>
                        <td>{season.AS}</td>
                        <td>{season.TO}</td>
                        <td>{season.ST}</td>
                        <td>{season.BS}</td>
                        <td>{season.PF}</td>
                        <td>{season.FP}</td>
                        <td>{season.DD}</td>
                        <td>{season.TD}</td>
                        <td>{season.FIC}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <table>
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
                  {playerData
                    .filter((season) => season.SEASON_TYPE === seasonType)
                    .map((season) => (
                      <tr key={season.SEASON_YEAR}>
                        <td>{`${season.SEASON_YEAR.slice(0, 4)}-${season.SEASON_YEAR.slice(4)}`}</td>
                        <td>{season.LEAGUE}</td>
                        <td>{season.TEAM}</td>
                        <td>{season.GP}</td>
                        <td>{season.MPG}</td>
                        <td>{season.PPG}</td>
                        <td>{season.FGMPG}</td>
                        <td>{season.FGAPG}</td>
                        <td>{season['FG%']}</td>
                        <td>{season['3PMPG']}</td>
                        <td>{season['3PAPG']}</td>
                        <td>{season['3P%']}</td>
                        <td>{season['FTMPG']}</td>
                        <td>{season['FTAPG']}</td>
                        <td>{season['FT%']}</td>
                        <td>{season.ORPG}</td>
                        <td>{season.DRPG}</td>
                        <td>{season.RPG}</td>
                        <td>{season.APG}</td>
                        <td>{season.TOPG}</td>
                        <td>{season.SPG}</td>
                        <td>{season.BPG}</td>
                        <td>{season.PFPG}</td>
                        <td>{season.FPPG}</td>
                        <td>{season.DD}</td>
                        <td>{season.TD}</td>
                        <td>{season.FIC}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Advanced Splits Table */}
          <div className="player-stats-tables">
            <h3>Advanced Splits</h3>
            <table>
              <thead>
                <tr>
                  <th>By Year</th>
                  <th>League</th>
                  <th>Team</th>
                  <th>GP</th>
                  <th>MIN</th>
                  <th>OffRtg</th>
                  <th>DefRtg</th>
                  <th>NetRtg</th>
                  <th>AST%</th>
                  <th>AST/TO</th>
                  <th>AST Ratio</th>
                  <th>OREB%</th>
                  <th>DREB%</th>
                  <th>REB%</th>
                  <th>TOV%</th>
                  <th>EFG%</th>
                  <th>TS%</th>
                  <th>USG%</th>
                  <th>PER</th>
                  <th>PIE</th>
                </tr>
              </thead>
              <tbody>
                {playerData
                  .filter((season) => season.SEASON_TYPE === seasonType)
                  .map((season) => (
                    <tr key={season.SEASON_YEAR}>
                      <td>{`${season.SEASON_YEAR.slice(0, 4)}-${season.SEASON_YEAR.slice(4)}`}</td>
                      <td>{season.LEAGUE}</td>
                      <td>{season.TEAM}</td>
                      <td>{season.GP}</td>
                      <td>{season.MPG}</td>
                      <td>{season.ORTG_ADJ}</td>
                      <td>{season.DRTG_ADJ}</td>
                      <td>{season.NRTG_ADJ}</td>
                      <td>{season.AS_RATE}</td>
                      <td>{season.AS_TO}</td>
                      <td>{season.AS_RATIO}</td>
                      <td>{season['ORB%']}</td>
                      <td>{season['DRB%']}</td>
                      <td>{season['REB%']}</td>
                      <td>{season.TOV_RATE}</td>
                      <td>{season.EFG_RATE}</td>
                      <td>{season.TS_RATE}</td>
                      <td>{season.USAGE}</td>
                      <td>{season.PER}</td>
                      <td>{season.PIE}</td>
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