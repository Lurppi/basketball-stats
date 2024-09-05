import React, { useState, useEffect, useMemo } from 'react';
import { fetchPlayers } from '../api';
import Header from './Header';
import Footer from './Footer';
import './Players.css';

const columnMappings = {
  Totals: [5, 4, 6, 7, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 11, 12, 13],
  Averages: [5, 4, 6, 7, 12, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 0, 1, 2, 3, 11, 12, 13],
  Shooting: [5, 4, 6, 7, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 0, 1, 2, 3, 11, 12, 13],
  'Advanced 1': [5, 4, 6, 7, 66, 33, 34, 58, 59, 47, 48, 49, 50, 51, 52, 53, 0, 1, 2, 3, 11, 12, 13],
  'Advanced 2': [5, 4, 6, 7, 66, 33, 34, 68, 69, 70, 71, 67, 54, 55, 56, 57, 0, 1, 2, 3, 11, 12, 13],
  'Advanced 3': [5, 4, 6, 7, 66, 33, 34, 60, 61, 62, 64, 65, 63, 47, 48, 49, 0, 1, 2, 3, 11, 12, 13],
};

const teamNameMapping = {
  "Alba Berlin": "Berlin",
  "ART Giants Düsseldorf": "Düsseldorf",
  "Bamberg freakcity academy": "Bamberg",
  "Basketball Löwen Erfurt": "Erfurt",
  "Baskets Juniors Oldenburg": "Oldenburg",
  "Baskets Paderborn": "Paderborn",
  "Bayer Giants Leverkusen": "Leverkusen",
  "BBA Giants Kornwestheim": "Kornwestheim",
  "BBA Hagen": "BBA Hagen",
  "Berlin Braves Baskets": "Braves Berlin",
  "Dresden Titans": "Dresden",
  "Eintracht Frankfurt": "Frankfurt",
  "Eisbären Bremerhaven": "Bremerhaven",
  "FC Bayern München": "Bayern München",
  "HAKRO Merlins Crailsheim": "Crailsheim",
  "Hamburg Towers": "Hamburg",
  "KICKZ IBAM": "IBAM",
  "Medipolis SC Jena": "Jena",
  "Metropol Baskets Ruhr": "Ruhrgebiet",
  "Niners Chemnitz Academy": "Chemnitz",
  "Orange Academy": "Orange",
  "Phoenix Hagen": "Phoenix Hagen",
  "Porsche BBA Ludwigsburg": "Ludwigsburg",
  "ratiopharm Ulm": "Ulm",
  "RheinStars Köln": "Köln",
  "Rostock Seawolves": "Rostock",
  "ROTH Energie BBA GIESSEN 46ers": "Gießen",
  "Sartorius Juniors": "Göttingen",
  "SG Junior Löwen Braunschweig": "Braunschweig",
  "Team Bonn/Rhöndorf": "Bonn-Rhöndorf",
  "Team Südhessen": "Südhessen",
  "Team Urspring": "Urspring",
  "TG Hanau": "Hanau",
  "Tornados Franken": "Nürnberg",
  "TS Jahn München": "Jahn München",
  "UBC Münster": "Münster",
  "USC Heidelberg": "Heidelberg",
  "VfL Kirchheim Knights": "Kirchheim",
  "Würzburg Baskets Akademie": "Würzburg",
  "Young Rasta Dragons": "Rasta Vechta"
};

const glossary = {
  "DIV": "Division",
  "POS": "Position",
  "﻿PLAYER": "Player",
  "TEAM": "Team",
  "BORN": "Year of Birth",
  "GP": "Games Played",
  "MP": "Minutes Played",
  "PT": "Points",
  "RB": "Rebounds",
  "OR": "Offensive Rebounds",
  "DR": "Defensive Rebounds",
  "AS": "Assists",
  "ST": "Steals",
  "BS": "Blocked Shots",
  "TO": "Turnovers",
  "PF": "Personal Fouls",
  "EF": "Efficiency",
  "EF/Gm": "Efficiency per Game",
  "DD": "Double Double",
  "TD": "Triple Double",
  "2PM": "2-Pointer Made",
  "2PA": "2-Point Attempts",
  "2P%": "2-Point Percentage",
  "3PM": "3-Pointer Made",
  "3PA": "3-Point Attempts",
  "3P%": "3-Point Percentage",
  "FGM": "Field Goals Made",
  "FGA": "Field Goal Attempts",
  "FG%": "Field Goal Percentage",
  "FTM": "Free Throws Made",
  "FTA": "Free Throw Attempts",
  "FT%": "Free Throw Percentage",
  "ORTG": "Offensive Rating",
  "DRTG": "Defensive Rating",
  "NRTG": "Net Rating",
  "OBPM": "Offensive Boxscore Plus/Minus",
  "DBPM": "Defensive Boxscore Plus/Minus",
  "BPM": "Boxscore Plus/Minus",
  "VORP": "Value over Replacement Player",
  "OWS": "Offensive Win Shares",
  "DWS": "Defensive Win Shares",
  "WS": "Win Shares",
  "WS/40": "Win Shares per 40 Minutes",
  "PER": "Player Efficiency Rating",
  "FIC": "Floor Impact Counter",
  "FIC/Gm": "Floor Impact Counter per Game",
  "PIE": "Player Impact Estimate",
  "AS RATIO": "Assist Ratio (Assists per 100 Possessions)",
  "AS RATE": "Assist Rate (High Value = High Passing Tendency)",
  "AS/TO": "Assist to Turnover Ratio",
  "REB%": "Rebound Percentage",
  "ST%": "Steal Percentage",
  "BS%": "Block Percentage",
  "USAGE": "Usage Rate",
  "TS%": "True Shooting Percentage",
  "EFG%": "Effective Field Goal Percentage",
  "TOV%": "Turnover Percentage",
  "ORB%": "Offensive Rebound Percentage",
  "FT-RATE": "Free Throw Rate",
  "OPP EFG%": "Opponent Effective Field Goal Percentage",
  "OPP TOV%": "Opponent Turnover Percentage",
  "OPP ORB%": "Opponent Offensive Rebound Percentage",
  "OPP FT-RATE": "Opponent Free Throw Rate",
  "PPP": "Points per Possession",
  "ROLE": "Offensive Role",
  "WINS": "Game Wins",
  "PACE": "Team Pace (Possessions per Game)",
};

const Players = () => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [filters, setFilters] = useState({
    season: '20232024', // Standardmäßige Saison
    league: 'All', // League nur für Filterung in der Tabelle
    statsType: 'Totals', // Auswahl für die Metriken
    division: 'All',
    team: 'All',
    position: 'All',
    offensiveRole: 'All',
    seasonType: 'All', // Neuer Season Type Filter
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

  // Daten von der API laden, basierend auf Season und Stats Type
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPlayers({
          season: filters.season !== 'All' ? filters.season : undefined,
        });

        if (data && data.length > 0) {
          // Header verarbeiten
          const rawHeaders = Object.keys(data[0])[0].split(';').map(header => header.trim());
          const selectedColumns = columnMappings[filters.statsType];
          const headers = selectedColumns.map(index => rawHeaders[index]);
          setHeaders(headers);

          // Daten verarbeiten
          const processedData = data.map(entry => {
            const rowValues = Object.values(entry)[0].split(';').map(value => value.trim());
            return selectedColumns.map(index => rowValues[index]);
          });

          setAllPlayers(processedData);
          setFilteredData(processedData);

          // Filteroptionen dynamisch extrahieren
          const seasonsSet = new Set();
          const leaguesSet = new Set();
          const divisionsSet = new Set();
          const teamsSet = new Set();
          const positionsSet = new Set();
          const offensiveRolesSet = new Set();
          const bornYearsSet = new Set();
          const seasonTypesSet = new Set();

          processedData.forEach(row => {
            seasonsSet.add(row[16]);
            leaguesSet.add(row[17]);
            divisionsSet.add(row[18]);
            teamsSet.add(row[1]);
            positionsSet.add(row[2]);
            offensiveRolesSet.add(row[3]);
            bornYearsSet.add(row[20]);
            seasonTypesSet.add(row[19]);
          });

          setSeasons([...seasonsSet].sort().map(s => `${s.slice(0, 4)}-${s.slice(4)}`)); // Format zu '2022-2023'
          setLeagues([...leaguesSet].filter(l => l).sort()); // Leere Werte entfernen
          setDivisions([...divisionsSet].filter(d => d).sort());
          setTeams([...teamsSet].filter(t => t).sort());
          setPositions([...positionsSet].filter(p => p).sort());
          setOffensiveRoles([...offensiveRolesSet].filter(o => o).sort());
          setBornYears([...bornYearsSet].filter(b => b).sort((a, b) => a - b));
          setSeasonTypes([...seasonTypesSet].filter(s => s).sort());
        }

        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.season, filters.statsType]);

  // Lokale Filter anwenden
  const applyFilters = (data) => {
    return data.filter(row => {
      const leagueMatch = filters.league === 'All' || row[17] === filters.league;
      const divisionMatch = filters.division === 'All' || row[18] === filters.division;
      const teamMatch = filters.team === 'All' || row[1] === filters.team;
      const positionMatch = filters.position === 'All' || row[2] === filters.position;
      const offensiveRoleMatch = filters.offensiveRole === 'All' || row[3] === filters.offensiveRole;
      const seasonTypeMatch = filters.seasonType === 'All' || row[19] === filters.seasonType; // Season Type Filter
      const bornMatch = filters.born === 'All' || row[20] === filters.born;
      const gamesPlayedMatch = !filters.gamesPlayed || parseInt(row[21], 10) >= parseInt(filters.gamesPlayed, 10);
      const minutesPlayedMatch = !filters.minutesPlayed || parseInt(row[22], 10) >= parseInt(filters.minutesPlayed, 10);

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

  // Daten sortieren
  const sortData = (data) => {
    if (!filters.sortStat) return data;

    return data.sort((a, b) => {
      const statA = a[headers.indexOf(filters.sortStat)];
      const statB = b[headers.indexOf(filters.sortStat)];

      return filters.sortDirection === 'asc' ? (statA > statB ? 1 : -1) : statA < statB ? 1 : -1;
    });
  };

  // Angezeigte Daten berechnen
  const displayedPlayers = useMemo(() => {
    const filtered = applyFilters(filteredData);
    const sorted = sortData(filtered);
    return sorted
      .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
      .filter(row => row.some(cell => cell !== null && cell !== ''))
      .map((row, index) => [((currentPage - 1) * rowsPerPage) + index + 1, ...row]);
  }, [filteredData, filters, currentPage, rowsPerPage]);

  const totalRows = useMemo(() => applyFilters(filteredData).length, [filteredData, filters]);
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  return (
    <div className="players-grid-container">
      <Header />
      <div className="players-grid-item">
        <div className="players-filter-container">
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

        <div className="players-container">
          <div className="players-pagination players-pagination-top-right">
            {totalRows} Player - Page {currentPage} of {totalPages}
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
                    <th key={idx}>
                      <abbr title={header}>{header}</abbr>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedPlayers.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx}>{cell}</td>
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
