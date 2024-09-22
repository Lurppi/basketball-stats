import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchPlayers } from '../api'; // Angepasst für Stats Type
import Header from './Header';
import Footer from './Footer';
import './Players.css';
import { columnHeaderMapping, ToolheadersMapping } from './MappingList.jsx';

const columnMappings = {
  Totals: [
    'PLAYER', 'TEAM', 'POS', 'ROLE', 'GP', 'MP', 'PT', 'RB', 'AS', 'ST', 'BS', 'TO', 'PF', 'EF', 'DD', 'TD',
    'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE', 'BORN', 'PER', 'PIE', 'TEAM_ID', 'PlayerID'
  ],
  Averages: [
    'PLAYER', 'TEAM', 'POS', 'ROLE', 'GP', 'MPG', 'PPG', 'RPG', 'APG', 'SPG', 'BPG', 'TOPG', 'PFPG', 'EFPG', 'PER', 'PIE',
    'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE', 'BORN', 'FIC', 'MP', 'TEAM_ID', 'PlayerID'
  ],
  Shooting: [
    'PLAYER', 'TEAM', 'POS', 'ROLE', '2PM', '2PA', '2P%', '3PM', '3PA', '3P%', 'FGM', 'FGA', 'FG%', 'FTM', 'FTA', 'FT%',
    'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE', 'BORN', 'GP', 'MP', 'TEAM_ID', 'PlayerID'
  ],
  'Shooting per Game': [
    'PLAYER', 'TEAM', 'POS', 'ROLE', '2PMPG', '2PAPG', '2P%', '3PMPG', '3PAPG', '3P%', 'FGMPG', 'FGAPG', 'FG%', 'FTMPG', 'FTAPG', 'FT%',
    'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE', 'BORN', 'GP', 'MP', 'TEAM_ID', 'PlayerID'
  ],
  Defense: [
    'PLAYER', 'TEAM', 'POS', 'ROLE', 'GP', 'MPG', 'DRTG_ADJ', 'DBPM', 'DWS', 'STOPS', 'STOPS_Gm', 'STOP%', 'DFG%', 'DRB%', 'ST%', 'BS%',
    'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE', 'BORN', 'EFPG', 'MP', 'TEAM_ID', 'PlayerID'
  ],
  'Advanced 1': [
    'PLAYER', 'TEAM', 'POS', 'ROLE', 'GP', 'MPG', 'USAGE', 'ORTG_ADJ', 'DRTG_ADJ', 'NRTG_ADJ', 'PER', 'PIE', 'EFG%', 'TOV%', 'ORB%', 'FT_RATE',
    'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE', 'BORN', 'EFPG', 'MP', 'TEAM_ID', 'PlayerID'
  ],
  'Advanced 2': [
    'PLAYER', 'TEAM', 'POS', 'ROLE', 'GP', 'MPG', 'USAGE', 'PER', 'OBPM', 'DBPM', 'BPM', 'VORP', 'OWS', 'DWS', 'WS', 'WS_40',
    'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE', 'BORN', 'MP', 'PIE', 'TEAM_ID', 'PlayerID'
  ],  
  'Advanced 3': [
    'PLAYER', 'TEAM', 'POS', 'ROLE', 'GP', 'MPG', 'USAGE', 'FIC', 'FIC_Gm', 'TS%', 'AS_RATIO', 'AS_RATE', 'AS_TO', 'ORB%', 'DRB%', 'REB%',
    'SEASON_YEAR', 'LEAGUE', 'DIV', 'SEASON_TYPE', 'BORN', 'EFPG', 'MP', 'TEAM_ID', 'PlayerID'
  ],
};

const Players = () => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [filters, setFilters] = useState({
    season: '20232024',
    league: '', 
    statsType: 'Advanced 1', 
    division: '',
    team: 'All',
    position: 'All',
    offensiveRole: 'All',
    seasonType: 'REGULAR SEASON', 
    born: 'All',
    gamesPlayed: '',
    minutesPlayed: '',
    sortStat: 'MP',
    sortDirection: 'desc',
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
        // Lade die Daten basierend auf statsType und season
        const data = await fetchPlayers(filters.statsType, filters.season);

        if (data && data.length > 0) {
          const selectedColumns = columnMappings[filters.statsType];
          setHeaders(selectedColumns);

          const processedData = data.map((entry) =>
            selectedColumns.map((column) => entry[column] || '')
          );

          setAllPlayers(processedData);
          setFilteredData(processedData);
        }

        // Stelle sicher, dass applyFilters auch sofort mit "REGULAR SEASON" greiftconst seasonMatch = filters.season === '20232024' || row[headers.indexOf('SEASON_YEAR')] === filters.season;
        setFilters(prevFilters => ({
          ...prevFilters,
          seasonType: 'REGULAR SEASON',  // Wenn es der erste Render ist, setze "REGULAR SEASON" explizit
        }));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.statsType, filters.season]);

  // 2. Filtere die Daten im Frontend (Zeilen)
  const applyFilters = (data) => {
    return data.filter(row => {
      const seasonMatch = row[headers.indexOf('SEASON_YEAR')] === filters.season;
      const leagueMatch = filters.league === 'All' || row[headers.indexOf('LEAGUE')] === filters.league;
      const divisionMatch = filters.division === 'All' || row[headers.indexOf('DIV')] === filters.division;
      const teamMatch = filters.team === 'All' || row[headers.indexOf('TEAM')] === filters.team;
      const positionMatch = filters.position === 'All' || row[headers.indexOf('POS')] === filters.position;
      const offensiveRoleMatch = filters.offensiveRole === 'All' || row[headers.indexOf('ROLE')] === filters.offensiveRole;
      const seasonTypeMatch = row[headers.indexOf('SEASON_TYPE')] === filters.seasonType;
      const bornMatch = filters.born === 'All' || row[headers.indexOf('BORN')] === filters.born;
      const gamesPlayedMatch = !filters.gamesPlayed || parseInt(row[headers.indexOf('GP')], 10) >= parseInt(filters.gamesPlayed, 10);
      const minutesPlayedMatch = !filters.minutesPlayed || parseInt(row[headers.indexOf('MP')], 10) >= parseInt(filters.minutesPlayed, 10);
  
      return (
        seasonMatch &&
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

  useEffect(() => {
    const updateDropdownValues = () => {
      const filtered = applyFilters(allPlayers); // Verwende gefilterte Daten

      // Werte für Season
      const uniqueSeasons = [...new Set(allPlayers.map(player => player[headers.indexOf('SEASON_YEAR')]))];
      setSeasons(uniqueSeasons);

      // Werte für League basierend auf der Season
      const uniqueLeagues = [...new Set(
        allPlayers
          .filter(player => player[headers.indexOf('SEASON_YEAR')] === filters.season)
          .map(player => player[headers.indexOf('LEAGUE')])
      )];
      setLeagues(uniqueLeagues);

      // Werte für Division basierend auf League und Season
      const uniqueDivisions = [...new Set(
        allPlayers
          .filter(player =>
            player[headers.indexOf('SEASON_YEAR')] === filters.season &&
            (filters.league === 'All' || player[headers.indexOf('LEAGUE')] === filters.league)
          )
          .map(player => player[headers.indexOf('DIV')])
      )];
      setDivisions(uniqueDivisions);

      // Werte für Teams basierend auf Division, League und Season
      const uniqueTeams = [...new Set(
        allPlayers
          .filter(player =>
            player[headers.indexOf('SEASON_YEAR')] === filters.season &&
            (filters.league === 'All' || player[headers.indexOf('LEAGUE')] === filters.league) &&
            (filters.division === 'All' || player[headers.indexOf('DIV')] === filters.division)
          )
          .map(player => player[headers.indexOf('TEAM')])
      )];
      setTeams(uniqueTeams);

      // Werte für Position basierend auf allen vorherigen Filtern
      const uniquePositions = [...new Set(
        allPlayers
          .filter(player =>
            player[headers.indexOf('SEASON_YEAR')] === filters.season &&
            (filters.league === 'All' || player[headers.indexOf('LEAGUE')] === filters.league) &&
            (filters.division === 'All' || player[headers.indexOf('DIV')] === filters.division) &&
            (filters.team === 'All' || player[headers.indexOf('TEAM')] === filters.team)
          )
          .map(player => player[headers.indexOf('POS')])
      )];
      setPositions(uniquePositions);

      // Werte für Offensive Role basierend auf allen vorherigen Filtern
      const uniqueOffensiveRoles = [...new Set(
        allPlayers
          .filter(player =>
            player[headers.indexOf('SEASON_YEAR')] === filters.season &&
            (filters.league === 'All' || player[headers.indexOf('LEAGUE')] === filters.league) &&
            (filters.division === 'All' || player[headers.indexOf('DIV')] === filters.division) &&
            (filters.team === 'All' || player[headers.indexOf('TEAM')] === filters.team) &&
            (filters.position === 'All' || player[headers.indexOf('POS')] === filters.position)
          )
          .map(player => player[headers.indexOf('ROLE')])
      )];
      setOffensiveRoles(uniqueOffensiveRoles);

      // Werte für Born (Geburtsjahr) basierend auf allen vorherigen Filtern
      const uniqueBornYears = [...new Set(
        allPlayers
          .filter(player =>
            player[headers.indexOf('SEASON_YEAR')] === filters.season &&
            (filters.league === 'All' || player[headers.indexOf('LEAGUE')] === filters.league) &&
            (filters.division === 'All' || player[headers.indexOf('DIV')] === filters.division) &&
            (filters.team === 'All' || player[headers.indexOf('TEAM')] === filters.team) &&
            (filters.position === 'All' || player[headers.indexOf('POS')] === filters.position) &&
            (filters.offensiveRole === 'All' || player[headers.indexOf('ROLE')] === filters.offensiveRole)
          )
          .map(player => player[headers.indexOf('BORN')])
      )];
      setBornYears(uniqueBornYears);

      // Werte für Season Type basierend auf allen vorherigen Filtern
      const uniqueSeasonTypes = [...new Set(
        allPlayers
          .filter(player =>
            player[headers.indexOf('SEASON_YEAR')] === filters.season &&
            (filters.league === 'All' || player[headers.indexOf('LEAGUE')] === filters.league) &&
            (filters.division === 'All' || player[headers.indexOf('DIV')] === filters.division) &&
            (filters.team === 'All' || player[headers.indexOf('TEAM')] === filters.team) &&
            (filters.position === 'All' || player[headers.indexOf('POS')] === filters.position) &&
            (filters.offensiveRole === 'All' || player[headers.indexOf('ROLE')] === filters.offensiveRole) &&
            (filters.born === 'All' || player[headers.indexOf('BORN')] === filters.born)
          )
          .map(player => player[headers.indexOf('SEASON_TYPE')])
      )];

      setSeasonTypes(uniqueSeasonTypes);

      // Überprüfe, ob der aktuell ausgewählte seasonType in den neuen Optionen enthalten ist
      if (!uniqueSeasonTypes.includes(filters.seasonType)) {
        // Wenn nicht, setze den seasonType auf die erste verfügbare Option
        setFilters(prevFilters => ({
          ...prevFilters,
          seasonType: uniqueSeasonTypes[0] || '', // Wähle eine gültige Option oder setze einen leeren String
        }));
      }
    };

    updateDropdownValues();
  }, [filters, allPlayers, headers]);

  useEffect(() => {
    const handleFilterError = () => {
      // Erstelle eine Version der Filter ohne die Eingabefelder (z.B. Games Played und Minutes Played)
      const filtersWithoutInputFields = {
        season: filters.season,
        league: filters.league || 'All',  // Optional: Hier Standardwert setzen
        division: filters.division || 'All', // Optional: Hier Standardwert setzen
        seasonType: filters.seasonType,
        statsType: filters.statsType,
        team: filters.team || 'All', // Optional: Hier Standardwert setzen
      };


      // Filter nur mit Dropdown-Werten anwenden, um zu sehen, ob sie schon zu leeren Daten führen
      const filteredWithoutInputs = applyFiltersWithCustomFilters(allPlayers, filtersWithoutInputFields);

      // Wenn diese Filter schon leere Daten liefern, dann ist es ein Fehlerfilter
      if (filteredWithoutInputs.length === 0) {
        if (filters.seasonType !== 'REGULAR SEASON') {
          setFilters(prevFilters => ({
            ...prevFilters,
            seasonType: 'REGULAR SEASON',  // Setze nur den "Season Type" zurück, wenn es keine Daten gibt
          }));
        } else if (filters.league !== 'All') {
          setFilters(prevFilters => ({
            ...prevFilters,
            league: 'All',  // Setze nur "League" zurück
          }));
        } else if (filters.division !== 'All') {
          setFilters(prevFilters => ({
            ...prevFilters,
            division: 'All',  // Setze nur "Division" zurück
          }));
        }
      }
    };

    handleFilterError();
  }, [filters, allPlayers]);

  // Hilfsfunktion zum Anwenden der Filter ohne Eingabefelder
  const applyFiltersWithCustomFilters = (data, customFilters) => {
    return data.filter(row => {
      const seasonMatch = customFilters.season === 'All' || row[headers.indexOf('SEASON_YEAR')] === customFilters.season;
      const leagueMatch = customFilters.league === 'All' || row[headers.indexOf('LEAGUE')] === customFilters.league;
      const divisionMatch = customFilters.division === 'All' || row[headers.indexOf('DIV')] === customFilters.division;
      const seasonTypeMatch = customFilters.seasonType === 'REGULAR SEASON' || row[headers.indexOf('SEASON_TYPE')] === customFilters.seasonType;
      const teamMatch = customFilters.team === 'All' || row[headers.indexOf('TEAM')] === customFilters.team;

      return (
        seasonMatch &&
        leagueMatch &&
        divisionMatch &&
        seasonTypeMatch &&
        teamMatch
      );
    });
  };
  
  const sortData = (data) => {
    if (!filters.sortStat) return data;

    return data.sort((a, b) => {
      const statA = a[headers.indexOf(filters.sortStat)];
      const statB = b[headers.indexOf(filters.sortStat)];

      // Überprüfe, ob der Wert existiert und ist numerisch
      const isNumericA = statA && !isNaN(statA);
      const isNumericB = statB && !isNaN(statB);
      const valueA = isNumericA ? parseFloat(statA) : statA;
      const valueB = isNumericB ? parseFloat(statB) : statB;

      // Sortiere numerisch oder lexikografisch je nach Datentyp
      if (filters.sortDirection === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  };

  const displayedPlayers = useMemo(() => {
    const filtered = applyFilters(filteredData);
    const sorted = sortData(filtered);
  
    return sorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
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
                onChange={e =>
                  setFilters({
                    ...filters,
                    season: e.target.value,
                    league: 'All', // Setze League zurück, wenn Season gewechselt wird
                    division: 'All', // Setze Division zurück, wenn Season gewechselt wird
                    seasonType: 'REGULAR SEASON', // Setze Season Type zurück, wenn Season gewechselt wird
                  })
                }
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
                value={filters.league}
                onChange={e =>
                  setFilters({
                    ...filters,
                    league: e.target.value,
                    division: 'All', // Setze Division zurück, wenn League gewechselt wird
                    seasonType: 'REGULAR SEASON', // Setze Season Type zurück, wenn League gewechselt wird
                  })
                }
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
                onChange={e => {
                  setFilters({
                    ...filters,
                    division: e.target.value,
                    seasonType: 'REGULAR SEASON', // Setze Season Type zurück, wenn Division gewechselt wird
                  });
                }}
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
              Position:
              <select
                name="position"
                value={filters.position}
                onChange={e => setFilters({ ...filters, position: e.target.value })}
              >
                <option value="All">All</option>
                {positions.map((position, idx) => (
                  <option key={idx} value={position}>{position}</option>
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
                  <option key={idx} value={role}>{role}</option>
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
                  <option key={idx} value={year}>{year}</option>
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
                  <th>#</th>
                  {headers.map((header, idx) => (
                    <th key={idx} title={ToolheadersMapping[header] || header}>
                      {columnHeaderMapping[header] || header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedPlayers.map((row, idx) => (
                  <tr key={idx}>
                    <td>{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                    {row.map((cell, cellIdx) => {
                      // Nehmen wir an, der Spielername ist die erste Spalte, und PlayerID ist verfügbar
                      if (headers[cellIdx] === 'PLAYER') {
                        const playerID = row[headers.indexOf('PlayerID')]; // Setze sicher, dass du die richtige Spalte für PlayerID verwendest
                        return (
                          <td key={cellIdx}>
                            <Link to={`/player/${playerID}`}>{cell}</Link> {/* Spielername wird klickbar */}
                          </td>
                        );
                      }
                      return <td key={cellIdx}>{cell || ''}</td>;
                    })}
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