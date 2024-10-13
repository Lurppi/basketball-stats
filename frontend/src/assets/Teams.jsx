import React, { useState, useEffect, useMemo } from 'react';
import { fetchTeams } from '../api'; // Angepasst für Teams
import Header from './Header';
import Footer from './Footer';
import './Teams.css';
import { columnHeaderMapping, ToolheadersMapping } from './MappingList.jsx';

const columnMappings = {
  Totals: [
    'TEAM', 'GP', 'WINS', 'PACE', 'MP', 'PT', 'DR', 'OR', 'RB', 'AS', 'ST', 'BS', 'TO', 'PF', 'EF', 'PIE', 'TEAM_ID', 'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],
  Averages: [
    'TEAM', 'GP', 'WINS', 'PACE', 'MPG', 'PPG', 'DRPG', 'ORPG', 'RPG', 'APG', 'SPG', 'BPG', 'TOPG', 'PFPG', 'EFPG', 'PER', 'TEAM_ID', 'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],

  Shooting: [
    'TEAM', 'GP', 'WINS', '2PM', '2PA', '2P%', '3PM', '3PA', '3P%', 'FGM', 'FGA', 'FG%', 'FTM', 'FTA', 'FT%', 'TS%', 'TEAM_ID', 'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],

  Opponent: [
    'TEAM', 'GP', 'WINS', 'OPP_PPG', 'OPP_RPG', 'OPP_APG', 'OPP_SPG', 'OPP_BPG', 'OPP_2P%', 'OPP_3P%', 'OPP_FG%', 'OPP_FT%', 'OPP_EFG%', 'OPP_TOV%', 'OPP_ORB%', 'OPP_FT_RATE', 'TEAM', 'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],

  Advanced: [
    'TEAM', 'GP', 'WIN%', 'PACE', 'ORTG', 'DRTG', 'NRTG', 'PPP', 'EFG%', 'TOV%', 'ORB%', 'FT_RATE', 'TS%', 'AS_TO', 'PER', 'PIE', 'TEAM_ID', 'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],

  'Four Factors': [
    'TEAM', 'GP', 'WIN%', 'PACE', 'ORTG', 'EFG%', 'TOV%', 'ORB%', 'FT_RATE', '3PR', 'DRTG', 'OPP_EFG%', 'OPP_TOV%', 'OPP_ORB%', 'OPP_FT_RATE', 'OPP3PR', 'TEAM_ID', 'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE'
  ],
};

const Teams = () => {
  const [allTeams, setAllTeams] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [filters, setFilters] = useState({
    season: '20242025',
    league: 'NBBL',
    statsType: 'Averages',
    division: 'NBBL A',
    seasonType: 'REGULAR SEASON',
    team: 'All',
    sortStat: 'WINS',
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
        const data = await fetchTeams(filters.statsType); // Hole die Daten basierend auf dem aktuellen statsType

        if (data && data.length > 0) {
          // Filtere die Daten, sodass nur Einträge mit einer nicht-leeren SEASON_YEAR behalten werden
          const filteredData = data.filter(item => item.SEASON_YEAR && item.SEASON_YEAR.trim() !== "");

          // Dynamische Ermittlung der verfügbaren Seasons
          const availableSeasons = [...new Set(filteredData.map(item => item.SEASON_YEAR))].sort(); // Sortiere die Seasons

          // Speichere alle verfügbaren Seasons
          setSeasons(availableSeasons);

          // Setze die neueste Saison als Standard, ohne das Array zu verändern
          const latestSeason = availableSeasons[availableSeasons.length - 1];

          // Setze die Season, falls noch nicht gesetzt
          setFilters(prevFilters => ({
            ...prevFilters,
            season: prevFilters.season || latestSeason // Setze die neueste verfügbare Saison, falls nicht gesetzt
          }));

          const selectedColumns = columnMappings[filters.statsType];
          setHeaders(selectedColumns);

          // Verarbeite nur die gefilterten Daten
          const processedData = filteredData.map((entry) =>
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
  }, [filters.statsType, filters.season]);
  
  const applyFilters = (data) => {
    return data.filter(row => {
      const seasonMatch = row[headers.indexOf('SEASON_YEAR')] === filters.season;
      const leagueMatch = row[headers.indexOf('LEAGUE')] === filters.league;
      const divisionMatch = row[headers.indexOf('DIV')] === filters.division;
      const seasonTypeMatch = row[headers.indexOf('SEASON_TYPE')] === filters.seasonType;
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

      // Debugging: Zeige gefilterte Teams nach Division-Änderung
      console.log("Gefilterte Teams:", filtered);

      // Aktualisiere Leagues und sortiere sie alphabetisch
      const uniqueLeagues = [...new Set(
        allTeams
          .filter(team => team[headers.indexOf('SEASON_YEAR')] === filters.season)
          .map(team => team[headers.indexOf('LEAGUE')])
      )].sort(); // Sortiere die Leagues alphabetisch

      setLeagues(uniqueLeagues);

      if (!uniqueLeagues.includes(filters.league)) {
        setFilters(prev => ({ ...prev, league: uniqueLeagues[0] }));
      }

      // Aktualisiere Divisions und sortiere alphabetisch (A-Z)
      const uniqueDivisions = [...new Set(
        allTeams
          .filter(team =>
            team[headers.indexOf('SEASON_YEAR')] === filters.season &&
            team[headers.indexOf('LEAGUE')] === filters.league
          )
          .map(team => team[headers.indexOf('DIV')])
      )].sort(); // Sortiere die Divisions alphabetisch (A-Z)

      setDivisions(uniqueDivisions);

      if (!uniqueDivisions.includes(filters.division)) {
        setFilters(prev => ({ ...prev, division: uniqueDivisions[0] }));
      }

      // Aktualisiere Season Types und sortiere sie alphabetisch (A-Z)
      const uniqueSeasonTypes = [...new Set(
        allTeams
          .filter(team =>
            team[headers.indexOf('SEASON_YEAR')] === filters.season &&
            team[headers.indexOf('LEAGUE')] === filters.league &&
            team[headers.indexOf('DIV')] === filters.division
          )
          .map(team => team[headers.indexOf('SEASON_TYPE')])
      )].sort(); // Sortiere die Season Types alphabetisch (A-Z)

      console.log("uniqueSeasonTypes nach Division-Änderung:", uniqueSeasonTypes);

      setSeasonTypes(uniqueSeasonTypes);

      if (!uniqueSeasonTypes.includes(filters.seasonType)) {
        setFilters(prev => ({
          ...prev,
          seasonType: uniqueSeasonTypes.length > 0 ? uniqueSeasonTypes[0] : ''
        }));
      }

      // Aktualisiere Teams und sortiere alphabetisch, "All" bleibt an erster Stelle
      let uniqueTeams = ['All', ...new Set(
        allTeams
          .filter(team =>
            team[headers.indexOf('SEASON_YEAR')] === filters.season &&
            team[headers.indexOf('LEAGUE')] === filters.league &&
            team[headers.indexOf('DIV')] === filters.division &&
            team[headers.indexOf('SEASON_TYPE')] === filters.seasonType
          )
          .map(team => team[headers.indexOf('TEAM')])
      )].sort();

      console.log("Gefilterte Teams für Dropdown:", uniqueTeams);

      if (uniqueTeams.includes('All')) {
        uniqueTeams = ['All', ...uniqueTeams.filter(team => team !== 'All')];
      }
      setTeams(uniqueTeams);

      if (filters.team !== 'All' && !uniqueTeams.includes(filters.team)) {
        setFilters(prev => ({ ...prev, team: 'All' }));
      }
    };

    // Erweiterte Abhängigkeiten für updates (füge seasonType hinzu)
    updateDropdownValues();
  }, [
    filters.season,
    filters.league,
    filters.division,
    filters.seasonType,
    allTeams,
    headers
  ]);

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
    // Filter und sortiere die Teams, wie es in Players.jsx gemacht wird
    const filtered = applyFilters(filteredData);
    const sorted = sortData(filtered);

    // Slicing für die Paginierung, basierend auf der aktuellen Seite und den Teams pro Seite
    return sorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filteredData, filters, currentPage, rowsPerPage]);

  // Berechne die Gesamtzahl der gefilterten Teams
  const totalRows = useMemo(() => {
    return applyFilters(filteredData).length;
  }, [filteredData, filters]);

  // Berechne die Gesamtseiten basierend auf der Anzahl der gefilterten Teams
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
              {seasons.map((season, idx) => {
                const formattedSeason = `${season.slice(0, 4)}-${season.slice(4)}`;
                return (
                  <option key={idx} value={season}>
                    {formattedSeason}
                  </option>
                );
              })}
            </select>
          </label>

          <label>
            League:
            <select
              name="league"
              value={leagues.includes(filters.league) ? filters.league : leagues[0]}  // Fallback auf ersten Wert
              onChange={e => setFilters({ ...filters, league: e.target.value })}
            >
              {leagues.map((league, idx) => (
                <option key={idx} value={league}>{league}</option>
              ))}
            </select>
          </label>

          <label>
            Division:
            <select
              name="division"
              value={divisions.includes(filters.division) ? filters.division : divisions[0]}  // Fallback auf ersten Wert
              onChange={e => setFilters({ ...filters, division: e.target.value })}
            >
              {divisions.map((division, idx) => (
                <option key={idx} value={division}>{division}</option>
              ))}
            </select>
          </label>

          <label>
            Season Type:
            <select
              name="seasonType"
              value={seasonTypes.includes(filters.seasonType) ? filters.seasonType : seasonTypes[0]}  // Fallback auf ersten Wert
              onChange={e => setFilters({ ...filters, seasonType: e.target.value })}
            >
              {seasonTypes.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
              ))}
            </select>
          </label>

          <label>
            Team:
            <select
              name="team"
              value={teams.includes(filters.team) ? filters.team : teams[0]}  // Fallback auf ersten Wert
              onChange={e => setFilters({ ...filters, team: e.target.value })}
            >
              {teams.map((team, idx) => (
                <option key={idx} value={team}>{team}</option>
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
