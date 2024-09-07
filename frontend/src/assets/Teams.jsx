import React, { useState, useEffect, useMemo } from 'react';
import { fetchTeams } from '../api'; // Angepasst für Teams
import Header from './Header';
import Footer from './Footer';
import './Teams.css';
import { columnHeaderMapping, ToolheadersMapping } from './MappingList.jsx';

const columnMappings = {
  Totals: [
    'TEAM_ID', 'GP', 'WINS', 'PACE', 'MP', 'PT', 'DR', 'OR', 'RB', 'AS', 'ST', 'BS', 'TO', 'PF', 'EF', 'PIE', 'TEAM', 'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],
  Averages: [
    'TEAM_ID', 'GP', 'WINS', 'PACE', 'MPG', 'PPG', 'DRPG', 'ORPG', 'RPG', 'APG', 'SPG', 'BPG', 'TOPG', 'PFPG', 'EFPG', 'PER', 'TEAM', 'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],

  Shooting: [
    'TEAM_ID', 'GP', 'WINS', '2PM', '2PA', '2P%', '3PM', '3PA', '3P%', 'FGM', 'FGA', 'FG%', 'FTM', 'FTA', 'FT%', 'TS%', 'TEAM', 'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],

  Opponent: [
    'TEAM_ID', 'GP', 'WINS', 'OPP_PPG', 'OPP_RPG', 'OPP_APG', 'OPP_SPG', 'OPP_BPG', 'OPP_2P%', 'OPP_3P%', 'OPP_FG%', 'OPP_FT%', 'OPP_EFG%', 'OPP_TOV%', 'OPP_ORB%', 'OPP_FT_RATE', 'TEAM', 'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],

  Advanced: [
    'TEAM_ID', 'GP', 'WINS', 'PACE', 'ORTG', 'DRTG', 'NRTG', 'PPP', 'EFG%', 'TOV%', 'ORB%', 'FT_RATE', 'OPP_EFG%', 'OPP_TOV%', 'OPP_ORB%', 'OPP_FT_RATE', 'TEAM', 'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],
};

const Teams = () => {
  const [allTeams, setAllTeams] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [filters, setFilters] = useState({
    season: 'All',
    league: 'All',
    statsType: 'Totals',
    division: 'All',
    seasonType: 'All',
    team: 'All',
    sortStat: '',
    sortDirection: 'desc',
  });

  const [seasons, setSeasons] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [seasonTypes, setSeasonTypes] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const rowsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTeams(filters.statsType); // Hole nur die Spalten, die für den Stats Type relevant sind

        if (data && data.length > 0) {
          const uniqueSeasons = [...new Set(data.map(item => item.SEASON_YEAR))];
          setSeasons(uniqueSeasons);

          const selectedColumns = columnMappings[filters.statsType];
          setHeaders(selectedColumns);

          const processedData = data.map((entry) =>
            selectedColumns.map((column) => entry[column] || '')
          );

          setAllTeams(processedData);
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
  }, [filters.statsType]);

  const applyFilters = (data) => {
    return data.filter(row => {
      const seasonMatch = filters.season === 'All' || row[headers.indexOf('SEASON_YEAR')] === filters.season;
      const leagueMatch = filters.league === 'All' || row[headers.indexOf('LEAGUE')] === filters.league;
      const divisionMatch = filters.division === 'All' || row[headers.indexOf('DIV')] === filters.division;
      const seasonTypeMatch = filters.seasonType === 'All' || row[headers.indexOf('SEASON_TYPE')] === filters.seasonType;
      const teamMatch = filters.team === 'All' || row[headers.indexOf('TEAM')] === filters.team; // Team-Filter anwenden

      return (
        seasonMatch &&
        leagueMatch &&
        divisionMatch &&
        seasonTypeMatch &&
        teamMatch // Den Team-Match in den Filterprozess einbeziehen
      );
    });
  };

  useEffect(() => {
    const updateDropdownValues = () => {
      const filtered = applyFilters(allTeams);

      const uniqueSeasons = [...new Set(allTeams.map(team => team[headers.indexOf('SEASON_YEAR')]))];
      setSeasons(uniqueSeasons);

      const uniqueLeagues = [...new Set(
        allTeams
          .filter(team => filters.season === 'All' || team[headers.indexOf('SEASON_YEAR')] === filters.season)
          .map(team => team[headers.indexOf('LEAGUE')])
      )];
      setLeagues(uniqueLeagues);

      const uniqueDivisions = [...new Set(
        allTeams
          .filter(team =>
            (filters.season === 'All' || team[headers.indexOf('SEASON_YEAR')] === filters.season) &&
            (filters.league === 'All' || team[headers.indexOf('LEAGUE')] === filters.league)
          )
          .map(team => team[headers.indexOf('DIV')])
      )];
      setDivisions(uniqueDivisions);

      const uniqueSeasonTypes = [...new Set(
        allTeams
          .filter(team =>
            (filters.season === 'All' || team[headers.indexOf('SEASON_YEAR')] === filters.season) &&
            (filters.league === 'All' || team[headers.indexOf('LEAGUE')] === filters.league) &&
            (filters.division === 'All' || team[headers.indexOf('DIV')] === filters.division)
          )
          .map(team => team[headers.indexOf('SEASON_TYPE')])
      )];
      setSeasonTypes(uniqueSeasonTypes);

      // Neue Logik für den Team-Filter:
      const uniqueTeams = [...new Set(
        allTeams
          .filter(team =>
            (filters.season === 'All' || team[headers.indexOf('SEASON_YEAR')] === filters.season) &&
            (filters.league === 'All' || team[headers.indexOf('LEAGUE')] === filters.league) &&
            (filters.division === 'All' || team[headers.indexOf('DIV')] === filters.division)
          )
          .map(team => team[headers.indexOf('TEAM')])
      )];
      setTeams(uniqueTeams); // Team-Dropdown aktualisieren
    };

    updateDropdownValues();
  }, [filters, allTeams, headers]);

  useEffect(() => {
    const handleFilterError = () => {
      const filtered = applyFilters(allTeams);

      if (filtered.length === 0) {
        if (filters.seasonType !== 'All') {
          setFilters(prevFilters => ({
            ...prevFilters,
            seasonType: 'All',
          }));
        } else if (filters.league !== 'All') {
          setFilters(prevFilters => ({
            ...prevFilters,
            league: 'All',
          }));
        } else if (filters.division !== 'All') {
          setFilters(prevFilters => ({
            ...prevFilters,
            division: 'All',
          }));
        }
      }
    };

    handleFilterError();
  }, [filters, allTeams]);

  const sortData = (data) => {
    if (!filters.sortStat) return data;

    return data.sort((a, b) => {
      const statA = a[headers.indexOf(filters.sortStat)];
      const statB = b[headers.indexOf(filters.sortStat)];

      const isNumericA = statA && !isNaN(statA);
      const isNumericB = statB && !isNaN(statB);
      const valueA = isNumericA ? parseFloat(statA) : statA;
      const valueB = isNumericB ? parseFloat(statB) : statB;

      if (filters.sortDirection === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  };

  const displayedTeams = useMemo(() => {
    const filtered = applyFilters(filteredData);
    const sorted = sortData(filtered);

    return sorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filteredData, filters, currentPage, rowsPerPage]);

  const totalRows = useMemo(() => applyFilters(filteredData).length, [filteredData, filters]);
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  return (
    <div className="teams-grid-container">
      <Header />
      <div className="teams-grid-item">
        <div className="teams-filter-container">
          <div className="teams-filters">
            <label>
              Season:
              <select
                name="season"
                value={filters.season}
                onChange={e => setFilters({ ...filters, season: e.target.value })}
              >
                <option value="All">All</option>
                {seasons.map((season, idx) => (
                  <option key={idx} value={season}>{season}</option>
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
                  <option key={idx} value={league}>{league}</option>
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
                  <option key={idx} value={division}>{division}</option>
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
                  <option key={idx} value={type}>{type}</option>
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
                  <option key={idx} value={team}>{team}</option>
                ))}
              </select>
            </label>

            <label>
              Sort column:
              <select
                name="sortStat"
                value={filters.sortStat}
                onChange={e => {
                  setFilters({ ...filters, sortStat: e.target.value });
                  setCurrentPage(1);
                }}
              >
                <option value="">Select Stat</option>
                {headers.slice(0, 16).map((header, idx) => (
                  <option key={idx} value={header}>{header}</option>
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

        <div className="teams-container">
          <div className="teams-pagination teams-pagination-top-right">
            {totalRows} Teams - Page {currentPage} of {totalPages}
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              {"<"}
            </button>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              {">"}
            </button>
          </div>

          <div className="teams-table-wrapper">
            <table className="teams-table-container">
              <thead>
                <tr>
                  <th>#</th>
                  {headers.map((header, idx) => (
                    <th key={idx} title={ToolheadersMapping[header] || header}>
                      {columnHeaderMapping[header] || header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedTeams.map((row, idx) => (
                  <tr key={idx}>
                    <td>{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                    {row.map((cell, cellIdx) => <td key={cellIdx}>{cell || ''}</td>)}
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

export default Teams;
