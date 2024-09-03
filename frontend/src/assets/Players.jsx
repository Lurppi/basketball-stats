import React, { useState, useEffect, useMemo } from 'react';
import { fetchPlayers } from '../api';
import Header from './Header';
import Footer from './Footer';
import './Players.css';

const columnMappings = {
  Totals: [0, 1, 2, 4, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 7],
  Averages: [0, 1, 2, 4, 6, 8, 20, 21, 22, 23, 24, 25, 26, 27, 28, 18, 19, 7],
  Shooting: [0, 1, 2, 4, 6, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 7],
  'Advanced 1': [0, 1, 2, 4, 6, 8, 9, 62, 29, 30, 43, 44, 45, 46, 47, 48, 49, 7],
  'Advanced 2': [0, 1, 2, 4, 6, 8, 9, 62, 64, 65, 66, 67, 63, 50, 51, 52, 53, 7],
  'Advanced 3': [0, 1, 2, 4, 6, 8, 9, 62, 54, 55, 56, 57, 58, 60, 61, 59, 29, 7],
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

const positionOrder = ["Point", "Combo", "Wing", "Forward", "Big"];

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    league: 'Regular',
    statsType: 'Totals',
    division: 'All',
    team: 'All',
    position: 'All',
    born: 'All',
    gamesPlayed: '',
    minutesPlayed: '',
    sortStat: '',
    sortDirection: 'desc',
  });
  const [divisions, setDivisions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [positions, setPositions] = useState([]);
  const [bornYears, setBornYears] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const league = filters.league === 'Regular' ? 'PLAYERS_RS' : 'PLAYERS_PO';
        const data = await fetchPlayers(league);

        if (data && data.length > 0) {
          const selectedColumns = columnMappings[filters.statsType];
          const rawHeaders = Object.keys(data[0])[0].split(';');
          const headers = selectedColumns.map(index => rawHeaders[index]);
          setHeaders(headers);

          const filteredData = data.map(entry => {
            const rowData = Object.values(entry)[0].split(';');
            if (rowData[1] in teamNameMapping) {
              rowData[1] = teamNameMapping[rowData[1]];
            }
            return selectedColumns.map(index => rowData[index]);
          }).filter(row => row.some(cell => cell !== null && cell !== ''));

          setPlayers(filteredData);

          const divisionsSet = new Set();
          const teamsSet = new Set();
          const positionsSet = new Set();
          const bornYearsSet = new Set();

          filteredData.forEach(row => {
            if (row[2]) divisionsSet.add(row[2]);
            if (row[1]) teamsSet.add(row[1]);
            if (row[3]) positionsSet.add(row[3]);
            if (row[17]) bornYearsSet.add(row[17]);
          });

          setDivisions([...divisionsSet].sort());
          setTeams([...teamsSet].sort());
          setPositions(positionOrder.filter(pos => positionsSet.has(pos)));
          setBornYears([...bornYearsSet].sort((a, b) => a - b));
        } else {
          setHeaders([]);
          setPlayers([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching player data:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.league, filters.statsType]);

  useEffect(() => {
    if (filters.sortStat) {
      const columnIndex = headers.indexOf(filters.sortStat);
      if (columnIndex !== -1) {
        handleSort(columnIndex);
      }
    }
  }, [filters.sortStat, filters.sortDirection, headers]);

  const handleSort = (key) => {
    const direction = filters.sortDirection;
    const sortedPlayers = [...players].sort((a, b) => {
      const valA = parseFloat(a[key]) || 0;
      const valB = parseFloat(b[key]) || 0;
      return direction === 'asc' ? valA - valB : valB - valA;
    });
    setPlayers(sortedPlayers);
  };

  const applyFilters = (data) => {
    return data.filter(row => {
      const divisionMatch = filters.division === 'All' || row[2] === filters.division;
      const teamMatch = filters.team === 'All' || row[1] === filters.team;
      const positionMatch = filters.position === 'All' || row[3] === filters.position;
      const bornMatch = filters.born === 'All' || row[17] === filters.born;
      const gamesPlayedMatch = !filters.gamesPlayed || parseInt(row[5], 10) >= parseInt(filters.gamesPlayed, 10);
      const minutesPlayedMatch = !filters.minutesPlayed || parseInt(row[6], 10) >= parseInt(filters.minutesPlayed, 10);

      return divisionMatch && teamMatch && positionMatch && bornMatch && gamesPlayedMatch && minutesPlayedMatch;
    });
  };

  const displayedPlayers = useMemo(() => {
    return applyFilters(players)
      .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
      .filter(row => row.some(cell => cell !== null && cell !== ''))
      .map((row, index) => [((currentPage - 1) * rowsPerPage) + index + 1, ...row]);
  }, [players, filters, currentPage, rowsPerPage]);

  const totalRows = useMemo(() => {
    return applyFilters(players).filter(row => row.some(cell => cell !== null && cell !== '')).length;
  }, [players, filters]);

  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const getTooltip = (header) => {
    return glossary[header] || 'No description available';
  };

  return (
    <div className="players-grid-container">
      <Header />
      <div className="players-grid-item">
        <div className="players-filter-container">
          <div className="players-filters">
            <label>
              Season Type:
              <select name="league" value={filters.league} onChange={e => setFilters({ ...filters, league: e.target.value })}>
                <option value="Regular">Regular Season</option>
                <option value="Playoffs">Playoffs</option>
              </select>
            </label>
            <label>
              Stats Type:
              <select name="statsType" value={filters.statsType} onChange={e => setFilters({ ...filters, statsType: e.target.value })}>
                <option value="Totals">Totals</option>
                <option value="Averages">Averages</option>
                <option value="Shooting">Shooting</option>
                <option value="Advanced 1">Advanced 1</option>
                <option value="Advanced 2">Advanced 2</option>
                <option value="Advanced 3">Advanced 3</option>
              </select>
            </label>
            <label>
              Division:
              <select name="division" value={filters.division} onChange={e => setFilters({ ...filters, division: e.target.value })}>
                <option value="All">All</option>
                {divisions.map((division, idx) => (
                  <option key={idx} value={division}>{division}</option>
                ))}
              </select>
            </label>
            <label>
              Team:
              <select name="team" value={filters.team} onChange={e => setFilters({ ...filters, team: e.target.value })}>
                <option value="All">All</option>
                {teams.map((team, idx) => (
                  <option key={idx} value={team}>{team}</option>
                ))}
              </select>
            </label>
            <label>
              Position:
              <select name="position" value={filters.position} onChange={e => setFilters({ ...filters, position: e.target.value })}>
                <option value="All">All</option>
                {positions.map((position, idx) => (
                  <option key={idx} value={position}>{position}</option>
                ))}
              </select>
            </label>
            <label>
              Born:
              <select name="born" value={filters.born} onChange={e => setFilters({ ...filters, born: e.target.value })}>
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
              Sort Stat:
              <select
                name="sortStat"
                value={filters.sortStat}
                onChange={e => setFilters({ ...filters, sortStat: e.target.value })}
              >
                <option value="">Select Stat</option>
                {headers.slice(5, 17).map((header, idx) => (
                  <option key={idx} value={header}>{header}</option>
                ))}
              </select>
            </label>
            <label>
              Sort Direction:
              <select
                name="sortDirection"
                value={filters.sortDirection}
                onChange={e => setFilters({ ...filters, sortDirection: e.target.value })}
              >
                <option value="asc">Up</option>
                <option value="desc">Down</option>
              </select>
            </label>
          </div>
        </div>

        <div className="players-container">
          <div className="players-pagination players-pagination-top-right">
            {totalRows} Player - Page {currentPage} of {totalPages}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="players-paginator-button"
            >
              {"<"}
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="players-paginator-button"
            >
              {">"}
            </button>
          </div>

          <div className="players-table-wrapper">
            <table className="players-table-container">
              <thead>
                <tr>
                  <th>#</th>
                  {headers.map((header, idx) => (
                    <th key={idx} className={idx === 17 || idx === 18 ? 'players-hidden-column' : ''}>
                      <abbr title={getTooltip(header)}>{header}</abbr>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedPlayers.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className={cellIdx === 17 ? 'players-hidden-column' : ''}>
                        {cell}
                      </td>
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
