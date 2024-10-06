import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './PlayerPage.css';
import { teamImageMappings } from './MappingList';
import Badge1 from '../images/Badge1.jpg';
import Badge2 from '../images/Badge2.jpg';
import Badge3 from '../images/Badge3.jpg';
import Badge4 from '../images/Badge4.jpg';
import Badge5 from '../images/Badge5.jpg';
import Badge6 from '../images/Badge6.jpg';
import Badge7 from '../images/Badge7.jpg';
import Badge8 from '../images/Badge8.jpg';
import Badge9 from '../images/Badge9.jpg';
import Badge10 from '../images/Badge10.jpg';
import Badge11 from '../images/Badge11.jpg';
import Badge12 from '../images/Badge12.jpg';
import Badge13 from '../images/Badge13.jpg';

// Badge-Zuordnung:
const badgeImages = {
  Sharpshooter: Badge1,
  'Volume Scorer': Badge2,
  'Inside Scorer': Badge3,
  'Free Throw Ace': Badge4,
  'Lockdown Defender': Badge5,
  'Rim Protector': Badge6,
  'Rebounding Machine': Badge7,
  Playmaker: Badge8,
  'Floor General': Badge9,
  'Two-Way Player': Badge10,
  'Efficient Shooter': Badge11,
  'High Impact Player': Badge12,
  'Sixth Man': Badge13,
};

const PlayerPage = () => {
  const { id } = useParams(); // Player ID from URL
  const [playerStats, setPlayerStats] = useState([]); // Für die Spielerstatistiken
  const [badges, setBadges] = useState([]); // Für die Badges
  const [lastGames, setLastGames] = useState([]); // Last 10 games data
  const [activeTab, setActiveTab] = useState('profile'); // For Profile and Stats Tabs
  const [seasonTypes, setSeasonTypes] = useState([]); // List of available Season Types
  const [seasonType, setSeasonType] = useState(''); // Default Season Type
  const [statsType, setStatsType] = useState('Averages'); // Default Stats Type
  const [filteredStats, setFilteredStats] = useState([]); // Filtered data based on selected Season Type
  const [loadingProfile, setLoadingProfile] = useState(true); // Ladezustand für Profil
  const [loadingBadges, setLoadingBadges] = useState(true); // Ladezustand für Badges
  const [error, setError] = useState(null);
  const [playerInfo, setPlayerInfo] = useState(null); // Neuer Zustand für PlayerInfo
  const [loadingPlayerInfo, setLoadingPlayerInfo] = useState(true); // Ladezustand für PlayerInfo
  const [playerInfoError, setPlayerInfoError] = useState(null); // Fehlerzustand für PlayerInfo

  useEffect(() => {
    const fetchPlayerInfo = async () => {
      try {
        const response = await fetch(`https://backend-sandy-rho.vercel.app/api/players/stats/${id}`);
        const statsData = await response.json();

        if (!statsData || !statsData.seasonStats) {
          throw new Error('Player info not found or invalid format');
        }

        setPlayerInfo(statsData.seasonStats); // Spielerstatistiken speichern
      } catch (err) {
        console.error('Error fetching player info:', err);
        setPlayerInfoError(err.message); // Fehler setzen, falls API-Aufruf fehlschlägt
      } finally {
        setLoadingPlayerInfo(false); // Ladezustand beenden
      }
    };

    fetchPlayerInfo();
  }, [id]);

  // Fetch player stats data (Stats)
  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const response = await fetch(`https://backend-sandy-rho.vercel.app/api/players/stats/${id}/season`);
        const statsData = await response.json();

        if (!statsData || !Array.isArray(statsData)) {
          throw new Error('Player stats not found or invalid format');
        }

        setPlayerStats(statsData); // Speichern der Spielerstatistiken

        // Extrahiere eindeutige Season Types und sortiere sie rückwärts (z-a)
        const uniqueSeasonTypes = [...new Set(statsData.map((stat) => stat.SEASON_TYPE))].sort().reverse();
        setSeasonTypes(uniqueSeasonTypes);

        // Standard-Season-Type setzen
        if (uniqueSeasonTypes.length > 0) {
          setSeasonType(uniqueSeasonTypes[0]);
          setFilteredStats(statsData.filter((stat) => stat.SEASON_TYPE === uniqueSeasonTypes[0]));
        }
      } catch (err) {
        console.error('Error fetching player stats:', err);
        setError(err.message);
      } finally {
        setLoadingProfile(false); // Ladezustand für Profil beenden
      }
    };

    fetchPlayerStats();
  }, [id]);

  // Fetch player badges data (separate von Player-Stats)
  useEffect(() => {
    const fetchPlayerBadges = async () => {
      try {
        const response = await fetch(`https://backend-sandy-rho.vercel.app/api/players/stats/${id}/valid`);
        if (response.status === 404) {
          setBadges([]); // Keine Badges vorhanden
          return;
        }
        const badgesData = await response.json();
        setBadges(badgesData.badges || []); // Nur die Badges speichern
      } catch (err) {
        console.error('Error fetching player badges:', err);
        setBadges([]); // Fallback auf leeres Array, wenn ein Fehler auftritt
      } finally {
        setLoadingBadges(false); // Ladezustand für Badges beenden
      }
    };

    fetchPlayerBadges();
  }, [id]);

  // Rendering badge list
  const renderBadges = () => {
    if (loadingBadges) return <p>Loading badges...</p>;
    if (badges.length === 0) return <p>No badges available for this player.</p>;

    return (
      <div className="player-badges">
        <ul>
          {badges.map((badge, index) => (
            <li key={index}>
              <img src={badgeImages[badge]} alt={badge} />
              <span>{badge}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Fetch last 10 games
  useEffect(() => {
    const fetchLastGames = async () => {
      try {
        const gamesResponse = await fetch(`https://backend-sandy-rho.vercel.app/api/playerdetails/last10games/${id}`);
        const games = await gamesResponse.json();

        if (!games || games.length === 0) {
          throw new Error('No games found for player');
        }

        setLastGames(games);
      } catch (err) {
        console.error('Error fetching last 10 games:', err);
        setError(err.message);
      }
    };

    fetchLastGames();
  }, [id]);

  // Function to handle Season Type change
  const handleSeasonTypeChange = (event) => {
    const selectedSeasonType = event.target.value;
    setSeasonType(selectedSeasonType);

    if (playerStats) {
      const filtered = playerStats.filter((stat) => stat.SEASON_TYPE === selectedSeasonType);
      setFilteredStats(filtered);
    }
  };

  // Function to handle Stats Type change
  const handleStatsTypeChange = (event) => {
    setStatsType(event.target.value);
  };

  if (loadingProfile) return <p>Loading player profile...</p>; // Ladezustand für Profil
  if (error) return <p>Error: {error}</p>;

  // Rendering last 10 games
  const renderLastGamesTable = () => {
    return (
      <table className="playerpage-table-container">
        <thead>
          <tr>
            <th>Date</th>
            <th>Matchup</th>
            <th>W/L</th>
            <th>MP</th>
            <th>PT</th>
            <th>FGM</th>
            <th>FGA</th>
            <th>FG%</th>
            <th>3PM</th>
            <th>3PA</th>
            <th>3P%</th>
            <th>FTM</th>
            <th>FTA</th>
            <th>FT%</th>
            <th>OR</th>
            <th>DR</th>
            <th>RB</th>
            <th>AS</th>
            <th>ST</th>
            <th>BS</th>
            <th>TO</th>
            <th>PF</th>
            <th>BPM</th>
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
    );
  };

  const renderStatsTable = () => {
    if (!filteredStats || filteredStats.length === 0) {
      return <p>No stats available</p>;
    }

    const isTotals = statsType === 'Totals';

    return (
      <table className="playerpage-table-container"> {/* Stelle sicher, dass diese Klasse verwendet wird */}
        <thead>
          <tr>
            <th>BY YEAR</th>
            <th>LEAGUE</th>
            <th>TEAM</th>
            <th>GP</th>
            <th>{isTotals ? 'MP' : 'MP'}</th>
            <th>{isTotals ? 'PT' : 'PT'}</th>
            <th>{isTotals ? 'FGM' : 'FGM'}</th>
            <th>{isTotals ? 'FGA' : 'FGA'}</th>
            <th>FG%</th>
            <th>{isTotals ? '3PM' : '3PM'}</th>
            <th>{isTotals ? '3PA' : '3PA'}</th>
            <th>3P%</th>
            <th>{isTotals ? 'FTM' : 'FTM'}</th>
            <th>{isTotals ? 'FTA' : 'FTA'}</th>
            <th>FT%</th>
            <th>{isTotals ? 'OR' : 'OR'}</th>
            <th>{isTotals ? 'DR' : 'DR'}</th>
            <th>{isTotals ? 'RB' : 'RB'}</th>
            <th>{isTotals ? 'AS' : 'AS'}</th>
            <th>{isTotals ? 'TO' : 'TO'}</th>
            <th>{isTotals ? 'ST' : 'ST'}</th>
            <th>{isTotals ? 'BS' : 'BS'}</th>
            <th>{isTotals ? 'PF' : 'PF'}</th>
            <th>{isTotals ? 'EF' : 'EF'}</th>
            <th>{isTotals ? 'FIC' : 'FIC'}</th>
            <th>DD</th>
            <th>TD</th>
          </tr>
        </thead>
        <tbody>
          {filteredStats.map((stat, index) => (
            <tr key={index}>
              <td>{`${stat.SEASON_YEAR.slice(0, 4)}-${stat.SEASON_YEAR.slice(4)}`}</td>
              <td>{stat.LEAGUE}</td>
              <td>{stat.TEAM}</td>
              <td>{stat.GP}</td>
              <td>{isTotals ? stat.MP : stat.MPG}</td>
              <td>{isTotals ? stat.PT : stat.PPG}</td>
              <td>{isTotals ? stat.FGM : stat.FGMPG}</td>
              <td>{isTotals ? stat.FGA : stat.FGAPG}</td>
              <td>{stat['FG%']}</td>
              <td>{isTotals ? stat['3PM'] : stat['3PMPG']}</td>
              <td>{isTotals ? stat['3PA'] : stat['3PAPG']}</td>
              <td>{stat['3P%']}</td>
              <td>{isTotals ? stat.FTM : stat.FTMPG}</td>
              <td>{isTotals ? stat.FTA : stat.FTAPG}</td>
              <td>{stat['FT%']}</td>
              <td>{isTotals ? stat.OR : stat.ORPG}</td>
              <td>{isTotals ? stat.DR : stat.DRPG}</td>
              <td>{isTotals ? stat.RB : stat.RPG}</td>
              <td>{isTotals ? stat.AS : stat.APG}</td>
              <td>{isTotals ? stat.TO : stat.TOPG}</td>
              <td>{isTotals ? stat.ST : stat.SPG}</td>
              <td>{isTotals ? stat.BS : stat.BPG}</td>
              <td>{isTotals ? stat.PF : stat.PFPG}</td>
              <td>{isTotals ? stat.EF : stat.EFPG}</td>
              <td>{isTotals ? stat.FIC : stat.FIC_Gm}</td>
              <td>{stat.DD}</td>
              <td>{stat.TD}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Rendering the Advanced Stats Table (Untere Tabelle)
  const renderAdvancedStatsTable = () => {
    if (!filteredStats || filteredStats.length === 0) {
      return <p>No advanced stats available</p>;
    }

    return (
      <table className="playerpage-table-container">
        <thead>
          <tr>
            <th>BY YEAR</th>
            <th>LEAGUE</th>
            <th>TEAM</th>
            <th>GP</th>
            <th>MP</th>
            <th>ORTG</th>
            <th>DRTG</th>
            <th>NRTG</th>
            <th>ASRA</th>
            <th>AST/TO</th>
            <th>ASR</th>
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
          {filteredStats.map((stat, index) => (
            <tr key={index}>
              <td>{`${stat.SEASON_YEAR.slice(0, 4)}-${stat.SEASON_YEAR.slice(4)}`}</td>
              <td>{stat.LEAGUE}</td>
              <td>{stat.TEAM}</td>
              <td>{stat.GP}</td>
              <td>{stat.MP}</td>
              <td>{stat.ORTG_ADJ}</td>
              <td>{stat.DRTG_ADJ}</td>
              <td>{stat.NRTG_ADJ}</td>
              <td>{stat.AS_RATE}</td>
              <td>{stat.AS_TO}</td>
              <td>{stat.AS_RATIO}</td>
              <td>{stat['ORB%']}</td> {/* ORB% */}
              <td>{stat['DRB%']}</td> {/* DRB% */}
              <td>{stat['REB%']}</td> {/* REB% */}
              <td>{stat['TOV%']}</td> {/* TOV% */}
              <td>{stat['EFG%']}</td> {/* EFG% */}
              <td>{stat['TS%']}</td> {/* TS% */}
              <td>{stat.USAGE}</td> {/* USAGE */}
              <td>{stat.PER}</td>
              <td>{stat.PIE}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Funktion, um das Alter zu berechnen
  const calculateAge = (birthDate) => {
    if (!birthDate || typeof birthDate !== 'string' || birthDate === '00.01.1900') {
      return 'Unknown';
    }
    const birth = new Date(birthDate.split('.').reverse().join('-'));
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Funktion, um das Geburtsdatum zu formatieren
  const formatBirthDate = (birthDate) => {
    if (!birthDate || typeof birthDate !== 'string' || birthDate === '00.01.1900') {
      return 'Unknown';
    }

    const birth = new Date(birthDate.split('.').reverse().join('-'));

    // Formatieren des Geburtsdatums in "Mar 27, 1994"
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return birth.toLocaleDateString('en-US', options);
  };

  // Funktion zur Umrechnung von cm in feet und inches
  const convertHeightToFeetInches = (heightInCm) => {
    if (!heightInCm || isNaN(heightInCm) || heightInCm === 0) {
      return 'Unknown'; // Wenn Höhe nicht definiert oder ungültig ist
    }

    const totalInches = Math.round(heightInCm * 0.3937);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}'${inches}"`;
  };

  // Funktion zur Umrechnung von cm in Meter
  const convertHeightToMeters = (heightInCm) => {
    if (!heightInCm || isNaN(heightInCm) || heightInCm === 0) {
      return 'Unknown'; // Wenn Höhe nicht definiert oder ungültig ist
    }

    const heightInMeters = (heightInCm / 100).toFixed(2); // Zentimeter in Meter umrechnen und auf zwei Dezimalstellen runden
    return `${heightInMeters}m`;
  };

  // Funktion zur Umrechnung von kg in Pfund (lb)
  const convertWeightToPounds = (weightInKg) => {
    if (!weightInKg || isNaN(weightInKg) || weightInKg === 0) {
      return 'Unknown'; // Wenn das Gewicht nicht definiert oder ungültig ist
    }

    const weightInPounds = (weightInKg * 2.20462).toFixed(0); // Kilogramm in Pfund umrechnen und auf 0 Dezimalstellen runden
    return `${weightInPounds}lb (${weightInKg}kg)`; // Gewicht im gewünschten Format anzeigen
  };

  return (
    <div className="playerpage-grid-container">
      <Header />

      {/* Spielerprofil und Informationen */}
      {loadingPlayerInfo ? (
        <p>Loading player profile...</p>
      ) : playerInfo ? (
        <div className="playerpage-fixed-container">
          <div className="playerpage-profile-modern">
            {/* Team-Logo hinzufügen */}
            <div className="team-logo-container">
              {teamImageMappings[playerInfo.TEAM] ? (
                <img
                  src={teamImageMappings[playerInfo.TEAM]}
                  alt={playerInfo.TEAM}
                  className="team-logo"
                />
              ) : (
                <p>No logo available</p>
              )}
            </div>

            {/* Spielername und Teaminfo */}
            <div className="player-name-info">
              <div>
                <h1 className="player-name">{playerInfo.PLAYER || 'Unknown Player'}</h1>
              </div>
              <div>
                <h2 className="team-long">{playerInfo.TEAM_long || 'Unknown Team'}</h2>
              </div>
            </div>

            {/* Flexbox für die Spielerinformationen in zwei Reihen */}
            <div className="player-info-rows">

              {/* Erste Reihe: Position, Height, Weight */}
              <div className="player-info-row">
                <div className="info-item">
                  <h4>Position</h4>
                  <p>{playerInfo.POS || 'Unknown'}</p>
                </div>
                <div className="info-item">
                  <h4>Height</h4>
                  <p>
                    {playerInfo.HEIGHT && playerInfo.HEIGHT !== 0
                      ? `${convertHeightToFeetInches(playerInfo.HEIGHT)} (${convertHeightToMeters(playerInfo.HEIGHT)})`
                      : 'Unknown'}
                  </p>
                </div>
                <div className="info-item">
                  <h4>Weight</h4>
                  <p>
                    {playerInfo.WEIGHT && playerInfo.WEIGHT !== 0
                      ? convertWeightToPounds(playerInfo.WEIGHT)
                      : 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Zweite Reihe: Role, Age, Born */}
              <div className="player-info-row">
                <div className="info-item">
                  <h4>Offensive Role</h4>
                  <p>{playerInfo.ROLE || 'Unknown'}</p>
                </div>
                <div className="info-item">
                  <h4>Age</h4>
                  <p>{calculateAge(playerInfo.BIRTHDATE)} years</p>
                </div>
                <div className="info-item">
                  <h4>Born</h4>
                  <p>{formatBirthDate(playerInfo.BIRTHDATE)}</p>
                </div>
              </div>

            </div>

            {/* Statistische Kreise */}
            <div className="player-stats-circle-container">
              <div className="player-stats-circle">
                <h4>{playerInfo.PPG || 'N/A'}</h4>
                <p>PTS</p>
              </div>
              <div className="player-stats-circle">
                <h4>{playerInfo.RPG || 'N/A'}</h4>
                <p>REB</p>
              </div>
              <div className="player-stats-circle">
                <h4>{playerInfo.APG || 'N/A'}</h4>
                <p>AST</p>
              </div>
              <div className="player-stats-circle">
                <h4>{playerInfo.PER || 'N/A'}</h4>
                <p>PER</p>
              </div>
              <div className="player-stats-circle">
                <h4>{playerInfo.PIE || 'N/A'}</h4>
                <p>PIE</p>
              </div>
            </div>
          </div>

          {/* Badge-Bereich anzeigen */}
          {renderBadges()}

        </div>
      ) : (
        <p>Player profile is loading or unavailable</p> // Fallback, wenn kein Spielerprofil vorhanden
      )}

      {/* Breadcrumb navigation */}
      <div className="breadcrumb-container">
        <div className="breadcrumb-menu">
          <button
            id="profile-button"
            className={activeTab === 'profile' ? 'breadcrumb-active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            id="stats-button"
            className={activeTab === 'stats' ? 'breadcrumb-active' : ''}
            onClick={() => setActiveTab('stats')}
          >
            Stats
          </button>
        </div>
      </div>

      {/* Conditional Rendering based on Active Tab */}
      {activeTab === 'profile' && (
        <div className="playerpage-lastgames-container">
          <h2>LAST 10 GAMES</h2>
          <div className="playerpage-table-wrapper">
            {renderLastGamesTable()}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="playerpage-stats">
          {/* Filter Dropdowns */}
          <div className="playerpage-filter-container">
            <div className="playerpage-filters">
              <label htmlFor="seasonType">Season Type:</label>
              <select
                id="seasonType"
                value={seasonType}
                onChange={handleSeasonTypeChange}
              >
                {seasonTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <label htmlFor="statsType">Stats Type:</label>
              <select
                id="statsType"
                value={statsType}
                onChange={handleStatsTypeChange}
              >
                <option value="Totals">TOTALS</option>
                <option value="Averages">AVERAGES</option>
              </select>
            </div>
          </div>

          <h2>TRADITIONAL</h2>
          {/* Stats Tables */}
          <div className="player-stats-tables">
            {renderStatsTable()}

            <h2>ADVANCED</h2>
            {/* Advanced Stats Table */}
            {renderAdvancedStatsTable()}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PlayerPage;


