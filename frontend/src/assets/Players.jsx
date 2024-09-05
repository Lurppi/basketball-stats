import React, { useState, useEffect, useMemo } from 'react';
import { fetchPlayers } from '../api';
import Header from './Header';
import Footer from './Footer';
import './Players.css';

const columnMappings = {
  Totals: [5, 4, 6, 7, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
  Averages: [5, 4, 6, 7, 12, 20, 21, 22, 23, 24, 25, 26, 27, 28, 18, 19],
  Shooting: [5, 4, 6, 7, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
  'Advanced 1': [5, 4, 6, 7, 66, 33, 34, 58, 59, 47, 48, 49, 50, 51, 52, 53],
  'Advanced 2': [5, 4, 6, 7, 66, 33, 34, 68, 69, 70, 71, 67, 54, 55, 56, 57],
  'Advanced 3': [5, 4, 6, 7, 66, 33, 34, 60, 61, 62, 64, 65, 63, 47, 48, 49],
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
  // Zustand für Spieler und Filteroptionen
  const [allPlayers, setAllPlayers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [filters, setFilters] = useState({
    season: '20232024',
    league: 'NBBL',
    seasonType: 'Regular',
    statsType: 'Totals',
    division: 'All',
    team: 'All',
    position: 'All',
    offensiveRole: 'All',
    born: 'All',
    gamesPlayed: '',
    minutesPlayed: '',
    sortStat: '',
    sortDirection: 'desc',
  });

  const [seasons, setSeasons] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [positions, setPositions] = useState([]);
  const [offensiveRoles, setOffensiveRoles] = useState([]);
  const [bornYears, setBornYears] = useState([]);

  const rowsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPlayers('PLAYERS'); // CSV-Daten abrufen
    
        if (data && data.length > 0) {
          const processedData = data.map(entry => {
            const row = Object.values(entry)[0]; // CSV-Zeile als Zeichenkette
            return row.split(';'); // Zeile in Spalten aufteilen
          });

          const rawHeaders = processedData[0]; // Erste Zeile als Header
          const selectedColumns = columnMappings[filters.statsType];
          const headers = selectedColumns.map(index => rawHeaders[index]);
          setHeaders(headers); // Kopfzeilen festlegen

          const filteredData = processedData.slice(1).map(row => {
            return selectedColumns.map(index => row[index]);
          });

          setAllPlayers(filteredData);
          setFilteredData(filteredData);

          const seasonsSet = new Set();
          const leaguesSet = new Set();
          const divisionsSet = new Set();
          const teamsSet = new Set();
          const positionsSet = new Set();
          const offensiveRolesSet = new Set();
          const bornYearsSet = new Set();

          filteredData.forEach(row => {
            seasonsSet.add(row[0]);
            leaguesSet.add(row[1]);
            divisionsSet.add(row[2]);
            teamsSet.add(row[4]);
            positionsSet.add(row[6]);
            offensiveRolesSet.add(row[7]);
            bornYearsSet.add(row[11]);
          });

          setSeasons([...seasonsSet].sort());
          setLeagues([...leaguesSet].sort());
          setDivisions([...divisionsSet].sort());
          setTeams([...teamsSet].sort());
          setPositions([...positionsSet].sort());
          setOffensiveRoles([...offensiveRolesSet].sort());
          setBornYears([...bornYearsSet].sort((a, b) => a - b));
        }

        setLoading(false); // Ladezustand deaktivieren
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData(); // Daten abrufen
  }, [filters.statsType]);

  // Handle filter change and reset dependent filters if necessary
  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };

    // Reset filters when season or league changes
    if (name === 'season' || name === 'league') {
      newFilters.division = 'All';
      newFilters.team = 'All';
      newFilters.position = 'All';
      newFilters.offensiveRole = 'All'; 
      newFilters.born = 'All';
      newFilters.gamesPlayed = '';
      newFilters.minutesPlayed = '';
    }

    setFilters(newFilters);
  };

  const applyFilters = (data) => {
    return data.filter(row => {
      const divisionMatch = filters.division === 'All' || row[2] === filters.division;
      const teamMatch = filters.team === 'All' || row[4] === filters.team;
      const positionMatch = filters.position === 'All' || row[6] === filters.position;
      const offensiveRoleMatch = filters.offensiveRole === 'All' || row[7] === filters.offensiveRole;
      const bornMatch = filters.born === 'All' || row[11] === filters.born;
      const gamesPlayedMatch = !filters.gamesPlayed || parseInt(row[12], 10) >= parseInt(filters.gamesPlayed, 10);
      const minutesPlayedMatch = !filters.minutesPlayed || parseInt(row[13], 10) >= parseInt(filters.minutesPlayed, 10);

      return divisionMatch && teamMatch && positionMatch && offensiveRoleMatch && bornMatch && gamesPlayedMatch && minutesPlayedMatch;
    });
  };

  const displayedPlayers = useMemo(() => {
    return applyFilters(filteredData)
      .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
      .filter(row => row.some(cell => cell !== null && cell !== ''))
      .map((row, index) => [((currentPage - 1) * rowsPerPage) + index + 1, ...row]);
  }, [filteredData, filters, currentPage, rowsPerPage]);

  const totalRows = useMemo(() => applyFilters(filteredData).length, [filteredData, filters]);
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const getTooltip = (header) => glossary[header] || 'No description available';

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
                onChange={e => handleFilterChange('season', e.target.value)}
              >
                {seasons.map((season, idx) => (
                  <option key={idx} value={season.replace('-', '')}>{season}</option>
                ))}
              </select>
            </label>

            {/* League Dropdown */}
            <label>
              League:
              <select
                name="league"
                value={filters.league}
                onChange={e => handleFilterChange('league', e.target.value)}
              >
                <option value="All">All</option>
                {leagues.map((league, idx) => (
                  <option key={idx} value={league}>{league}</option>
                ))}
              </select>
            </label>

            {/* Division Dropdown */}
            <label>
              Division:
              <select
                name="division"
                value={filters.division}
                onChange={e => handleFilterChange('division', e.target.value)}
              >
                <option value="All">All</option>
                {divisions.map((division, idx) => (
                  <option key={idx} value={division}>{division}</option>
                ))}
              </select>
            </label>

            {/* Team Dropdown */}
            <label>
              Team:
              <select
                name="team"
                value={filters.team}
                onChange={e => handleFilterChange('team', e.target.value)}
              >
                <option value="All">All</option>
                {teams.map((team, idx) => (
                  <option key={idx} value={team}>{team}</option>
                ))}
              </select>
            </label>

            {/* Position Dropdown */}
            <label>
              Position:
              <select
                name="position"
                value={filters.position}
                onChange={e => handleFilterChange('position', e.target.value)}
              >
                <option value="All">All</option>
                {positions.map((position, idx) => (
                  <option key={idx} value={position}>{position}</option>
                ))}
              </select>
            </label>

            {/* Offensive Role Dropdown */}
            <label>
              Offensive Role:
              <select
                name="offensiveRole"
                value={filters.offensiveRole}
                onChange={e => handleFilterChange('offensiveRole', e.target.value)}
              >
                <option value="All">All</option>
                {offensiveRoles.map((role, idx) => (
                  <option key={idx} value={role}>{role}</option>
                ))}
              </select>
            </label>

            {/* Born Year Dropdown */}
            <label>
              Born:
              <select
                name="born"
                value={filters.born}
                onChange={e => handleFilterChange('born', e.target.value)}
              >
                <option value="All">All</option>
                {bornYears.map((year, idx) => (
                  <option key={idx} value={year}>{year}</option>
                ))}
              </select>
            </label>

            {/* Weitere Filter wie Games Played, Minutes Played */}
          </div>
        </div>

        <div className="players-container">
          {/* Paginierung */}
          <div className="players-pagination players-pagination-top-right">
            {totalRows} Player - Page {currentPage} of {totalPages}
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              {"<"}
            </button>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              {">"}
            </button>
          </div>

          {/* Tabelle */}
          <div className="players-table-wrapper">
            <table className="players-table-container">
              <thead>
                <tr>
                  <th>#</th>
                  {headers.map((header, idx) => (
                    <th key={idx}>
                      <abbr title={getTooltip(header)}>{header}</abbr>
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
