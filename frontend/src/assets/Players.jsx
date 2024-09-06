import React, { useState, useEffect, useMemo } from 'react';
import { fetchPlayers } from '../api';
import Header from './Header';
import Footer from './Footer';
import './Players.css';

const columnMappings = {
  Totals: [
    'PLAYER', 'TEAM', 'POS', 'ROLE', 'BORN', 'GP', 'MP', 'PT', 'RB', 'AS', 'ST', 'BS', 'TO', 'PF', 'EF', 'DD', 'TD',
    'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],
  Averages: [
    'PLAYER', 'TEAM', 'POS', 'ROLE', 'BORN', 'MPG', 'PPG', 'RPG', 'APG', 'SPG', 'BPG', 'TOPG', 'PFPG', 'EFPG', 'PER', 'PIE',
    'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],
  Shooting: [
    'PLAYER', 'TEAM', 'POS', 'ROLE', 'BORN', '2PM', '2PA', '2P%', '3PM', '3PA', '3P%', 'FGM', 'FGA', 'FG%', 'FTM', 'FTA', 'FT%',
    'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],
  'Advanced 1': [
    'PLAYER', 'TEAM', 'POS', 'ROLE', 'BORN', 'USAGE', 'PER', 'PIE', 'FIC', 'FIC_Gm', 'AS_RATIO', 'AS_RATE', 'AS_TO', 'REB%', 'ST%', 'BS%',
    'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],
  'Advanced 2': [
    'PLAYER', 'TEAM', 'POS', 'ROLE', 'BORN', 'USAGE', 'PER', 'PIE', 'TS%', 'EFG%', 'TOV%', 'ORB%', 'FT_RATE', 'ORTG', 'DRTG', 'NRTG',
    'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],
  'Advanced 3': [
    'PLAYER', 'TEAM', 'POS', 'ROLE', 'BORN', 'USAGE', 'PER', 'PIE', 'OBPM', 'DBPM', 'BPM', 'VORP', 'OWS', 'DWS', 'WS', 'WS_40',
    'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],
};

const Players = () => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [filters, setFilters] = useState({
    season: 'All',
    league: 'All', 
    statsType: 'Totals', 
    division: 'All',
    team: 'All',
    position: 'All',
    offensiveRole: 'All',
    seasonType: 'All', 
    born: 'All',
    gamesPlayed: '',
    minutesPlayed: '',
    sortStat: '',
    sortDirection: 'asc',
  });

  const [seasons, setSeasons] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [positions, setPositions] = useState([]);
  const [offensiveRoles, setOffensiveRoles] = useState([]);
  const [bornYears, setBornYears] = useState([]);
  const [seasonTypes, setSeasonTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const rowsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPlayers({
          season: filters.season !== 'All' ? filters.season : undefined,
        });
  
        console.log('API response:', data); // Ausgabe zur Überprüfung der API-Antwort
  
        if (data && data.length > 0) {
          const selectedColumns = columnMappings[filters.statsType];
          setHeaders(selectedColumns);
  
          const processedData = data.map((entry) =>
            selectedColumns.map((column) => entry[column] || '')
          );
  
          console.log('Processed Data:', processedData); // Verarbeite Daten und prüfe SEASON_YEAR
  
          setAllPlayers(processedData);
          setFilteredData(processedData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [filters.season, filters.statsType]);
  

  const applyFilters = (data) => {
    return data.filter(row => {
      const leagueMatch = filters.league === 'All' || row[headers.indexOf('LEAGUE')] === filters.league;
      const divisionMatch = filters.division === 'All' || row[headers.indexOf('DIV')] === filters.division;
      const teamMatch = filters.team === 'All' || row[headers.indexOf('TEAM')] === filters.team;
      const positionMatch = filters.position === 'All' || row[headers.indexOf('POS')] === filters.position;
      const offensiveRoleMatch = filters.offensiveRole === 'All' || row[headers.indexOf('ROLE')] === filters.offensiveRole;
      const seasonTypeMatch = filters.seasonType === 'All' || row[headers.indexOf('SEASON_TYPE')] === filters.seasonType;
      const bornMatch = filters.born === 'All' || row[headers.indexOf('BORN')] === filters.born;
      const gamesPlayedMatch = !filters.gamesPlayed || parseInt(row[headers.indexOf('GP')], 10) >= parseInt(filters.gamesPlayed, 10);
      const minutesPlayedMatch = !filters.minutesPlayed || parseInt(row[headers.indexOf('MP')], 10) >= parseInt(filters.minutesPlayed, 10);
  
      return (
        leagueMatch &&
        divisionMatch &&
        teamMatch &&
        positionMatch &&
        offensiveRoleMatch &&
        seasonTypeMatch &&
        bornMatch &&
        gamesPlayedMatch &&
        minutesPlayedMatch
      );
    });
  };
  
  const sortData = (data) => {
    if (!filters.sortStat) return data;
  
    return data.sort((a, b) => {
      const statA = a[headers.indexOf(filters.sortStat)];
      const statB = b[headers.indexOf(filters.sortStat)];
  
      return filters.sortDirection === 'asc' ? (statA > statB ? 1 : -1) : statA < statB ? 1 : -1;
    });
  };

  const displayedPlayers = useMemo(() => {
    const filtered = applyFilters(filteredData);
    const sorted = sortData(filtered);

    return sorted
      .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filteredData, filters, currentPage, rowsPerPage]);

  const totalRows = useMemo(() => applyFilters(filteredData).length, [filteredData, filters]);
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  return (
    <div className="players-grid-container">
      <Header />
      <div className="players-grid-item">
        <div className="players-filter-container">
          <div className="players-filters">
            <label>
              Season:
              <select
                name="season"
                value={filters.season}
                onChange={e => setFilters({
                  ...filters,
                  season: e.target.value,
                  league: 'All',
                  division: 'All',
                  team: 'All',
                  position: 'All',
                  offensiveRole: 'All',
                  gamesPlayed: '',
                  minutesPlayed: '',
                })}
              >
                <option value="All">All</option>
                {seasons.map((season, idx) => (
                  <option key={idx} value={season.replace('-', '')}>
                    {season}
                  </option>
                ))}
              </select>
            </label>

            <label>
              League:
              <select
                name="league"
                value={filters.league}
                onChange={e => setFilters({ ...filters, league: e.target.value })}
              >
                <option value="All">All</option>
                {leagues.map((league, idx) => (
                  <option key={idx} value={league}>
                    {league}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Division:
              <select
                name="division"
                value={filters.division}
                onChange={e => setFilters({ ...filters, division: e.target.value })}
              >
                <option value="All">All</option>
                {divisions.map((division, idx) => (
                  <option key={idx} value={division}>
                    {division}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Season Type:
              <select
                name="seasonType"
                value={filters.seasonType}
                onChange={e => setFilters({ ...filters, seasonType: e.target.value })}
              >
                <option value="All">All</option>
                {seasonTypes.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Stats Type:
              <select
                name="statsType"
                value={filters.statsType}
                onChange={e => setFilters({ ...filters, statsType: e.target.value })}
              >
                {Object.keys(columnMappings).map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Team:
              <select
                name="team"
                value={filters.team}
                onChange={e => setFilters({ ...filters, team: e.target.value })}
              >
                <option value="All">All</option>
                {teams.map((team, idx) => (
                  <option key={idx} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Position:
              <select
                name="position"
                value={filters.position}
                onChange={e => setFilters({ ...filters, position: e.target.value })}
              >
                <option value="All">All</option>
                {positions.map((position, idx) => (
                  <option key={idx} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Offensive Role:
              <select
                name="offensiveRole"
                value={filters.offensiveRole}
                onChange={e => setFilters({ ...filters, offensiveRole: e.target.value })}
              >
                <option value="All">All</option>
                {offensiveRoles.map((role, idx) => (
                  <option key={idx} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Born:
              <select
                name="born"
                value={filters.born}
                onChange={e => setFilters({ ...filters, born: e.target.value })}
              >
                <option value="All">All</option>
                {bornYears.map((year, idx) => (
                  <option key={idx} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Games Played:
              <input
                type="number"
                name="gamesPlayed"
                value={filters.gamesPlayed}
                onChange={e => setFilters({ ...filters, gamesPlayed: e.target.value })}
              />
            </label>

            <label>
              Minutes Played:
              <input
                type="number"
                name="minutesPlayed"
                value={filters.minutesPlayed}
                onChange={e => setFilters({ ...filters, minutesPlayed: e.target.value })}
              />
            </label>

            <label>
              Sort column:
              <select
                name="sortStat"
                value={filters.sortStat}
                onChange={e => setFilters({ ...filters, sortStat: e.target.value })}
              >
                <option value="">Select Stat</option>
                {headers.map((header, idx) => (
                  <option key={idx} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Sort direction:
              <select
                name="sortDirection"
                value={filters.sortDirection}
                onChange={e => setFilters({ ...filters, sortDirection: e.target.value })}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>
        </div>

        <div className="players-container">
          <div className="players-pagination players-pagination-top-right">
            {totalRows} Players - Page {currentPage} of {totalPages}
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              {"<"}
            </button>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              {">"}
            </button>
          </div>

          <div className="players-table-wrapper">
            <table className="players-table-container">
              <thead>
                <tr>
                  {headers.map((header, idx) => (
                    <th key={idx}>{header}</th> 
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedPlayers.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx}>{cell || ''}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Players;
