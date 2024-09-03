import React, { useState, useEffect, useMemo } from 'react';
import { fetchTeams } from '../api';
import Header from './Header';
import Footer from './Footer';
import './Teams.css';

const columnMappings = {
  Totals: [0, 1, 2, 46, 47, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 49],
  Averages: [0, 1, 2, 46, 47, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 48],
  Shooting: [0, 1, 2, 46, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 53],
  Opponent: [0, 1, 2, 46, 37, 38, 39, 40, 41, 42, 43, 44, 45, 60, 61, 62, 63],
  Advanced: [0, 1, 2, 46, 47, 50, 51, 52, 56, 57, 58, 59, 60, 61, 62, 63, 55],
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
  "Metropol Baskets Ruhr": "Baskets Ruhr",
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
  "﻿TEAM": "Team",
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

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    league: 'Regular',
    statsType: 'Totals',
    division: 'All',
    sortStat: '',
    sortDirection: 'desc',
  });
  const [divisions, setDivisions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const league = filters.league === 'Regular' ? 'TEAMS_RS' : 'TEAMS_PO';
        const data = await fetchTeams(league);

        if (data && data.length > 0) {
          const selectedColumns = columnMappings[filters.statsType];
          const rawHeaders = Object.keys(data[0])[0].split(';');
          const headers = selectedColumns.map(index => rawHeaders[index]);
          setHeaders(headers);

          const filteredData = data.map(entry => {
            const rowData = Object.values(entry)[0].split(';');
            if (rowData[0] in teamNameMapping) {
              rowData[0] = teamNameMapping[rowData[0]];
            }
            return selectedColumns.map(index => rowData[index]);
          }).filter(row => row.some(cell => cell !== null && cell !== ''));

          setTeams(filteredData);

          // Create unique division options based on index 1 (Division)
          const divisionsSet = new Set();
          filteredData.forEach(row => {
            if (row[1]) divisionsSet.add(row[1]);  // Bezug auf Spalte 1 (Index 1 in der CSV-Datei)
          });
          setDivisions([...divisionsSet].sort());
        } else {
          setHeaders([]);
          setTeams([]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching team data:', error);
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
    const sortedTeams = [...teams].sort((a, b) => {
      const valA = parseFloat(a[key]) || 0;
      const valB = parseFloat(b[key]) || 0;
      return direction === 'asc' ? valA - valB : valB - valA;
    });
    setTeams(sortedTeams);
  };

  const applyFilters = (data) => {
    return data.filter(row => {
      const divisionMatch = filters.division === 'All' || row[1] === filters.division;  // Filtern nach Division (Index 1)
      return divisionMatch;
    });
  };

  const displayedTeams = useMemo(() => {
    return applyFilters(teams)
      .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
      .filter(row => row.some(cell => cell !== null && cell !== ''));
  }, [teams, filters, currentPage, rowsPerPage]);

  const totalRows = useMemo(() => {
    return applyFilters(teams).filter(row => row.some(cell => cell !== null && cell !== '')).length;
  }, [teams, filters]);

  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const getTooltip = (header) => {
    return glossary[header] || 'No description available';
  };

  const sortOptions = useMemo(() => {
    // Überschriften ab der vierten Spalte (Index 3) als Optionen anbieten
    return headers.slice(3).map((header, idx) => (
      <option key={idx} value={header}>{header}</option>
    ));
  }, [headers]);

  return (
    <div className="teams-grid-container">
      <Header />
      <div className="teams-grid-item">
        <div className="teams-filter-container">
          <div className="teams-filters">
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
                <option value="Opponent">Opponent</option>
                <option value="Advanced">Advanced</option>
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
              Sort Stat:
              <select
                name="sortStat"
                value={filters.sortStat}
                onChange={e => setFilters({ ...filters, sortStat: e.target.value })}
              >
                <option value="">Select Stat</option>
                {sortOptions}
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

        <div className="teams-container">
          <div className="teams-pagination teams-pagination-top-right">
            {totalRows} Teams - Page {currentPage} of {totalPages}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="teams-paginator-button"
            >
              {"<"}
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="teams-paginator-button"
            >
              {">"}
            </button>
          </div>

          <div className="teams-table-wrapper">
            <table className="teams-table-container">
              <thead>
                <tr>
                  <th>#</th> {/* Zeilennummerierung hinzufügen */}
                  {headers.map((header, idx) => (
                    <th key={idx} className={idx === 17 ? 'teams-hidden-column' : ''}>
                      <abbr title={getTooltip(header)}>{header}</abbr>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedTeams.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    <td>{(currentPage - 1) * rowsPerPage + rowIdx + 1}</td> {/* Zeilennummerierung */}
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx}>
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

export default Teams;
