import React, { useState, useEffect } from 'react';
import { fetchTeams } from '../api';
import './Teams-desktop.css'; // Desktop-Styling
import './Teams-mobile.css';  // Mobile-Styling

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [sortedTeams, setSortedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('desc'); // Standardmäßig auf absteigend
  const [filters, setFilters] = useState({
    league: 'Regular',
    statsType: 'Totals',
    division: '',
  });

  
  const glossary = {
    "#": "Rank",
    "DIV": "Division",
    "POS": "Position",
    "BORN": "Year of Birth",
    "GP": "Games Played",
    "MP": "Minutes Played",
    "PT": "Points",
    "RB": "Rebounds",
    "AS": "Assists",
    "ST": "Steals",
    "BS": "Blocked Shots",
    "TO": "Turnovers",
    "PF": "Personal Fouls",
    "EF": "Efficiency",
    "EF/Gm": "Efficiency per Game",
    "DD": "Double Doubles",
    "TD": "Triple Doubles",
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
    "PACE": "Team Pace (Possessions per Game)"
  };

  useEffect(() => {
    const loadTeams = async () => {
      setLoading(true);
      try {
        const teamsData = await fetchTeams(filters.league, filters.statsType);
        const filteredTeamsData = teamsData.filter(team => Object.values(team).some(value => value !== ''));
        setTeams(filteredTeamsData);
        setSortedTeams(filteredTeamsData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch teams data');
      }
      setLoading(false);
    };

    loadTeams();
  }, [filters.league, filters.statsType]);

  useEffect(() => {
    let filteredData = [...teams];

    if (filters.division) {
      filteredData = filteredData.filter(team => team.DIV === filters.division);
    }

    if (sortColumn) {
      filteredData.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        const isNumericColumn = !isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue));

        if (sortDirection === 'asc') {
          return isNumericColumn ? parseFloat(aValue) - parseFloat(bValue) : String(aValue).localeCompare(String(bValue));
        } else {
          return isNumericColumn ? parseFloat(bValue) - parseFloat(aValue) : String(bValue).localeCompare(String(aValue));
        }
      });
    }

    setSortedTeams(filteredData);
  }, [sortColumn, sortDirection, filters.division, teams]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSortColumnChange = (e) => {
    const selectedColumn = e.target.value;
    setSortColumn(selectedColumn);
    if (!sortDirection) {
      setSortDirection('desc'); // Wenn keine Sortierrichtung ausgewählt ist, standardmäßig auf absteigend setzen
    }
  };

  const handleSortDirectionChange = (e) => {
    setSortDirection(e.target.value);
  };

  const tableHeaders = teams.length > 0 ? Object.keys(teams[0]) : [];
  const sortOptions = tableHeaders.slice(2).filter(header => header !== 'TEAM' && header !== 'DIV');
  const divisionOptions = [...new Set(teams.map(team => team.DIV))].sort();

  return (
    <div className="teams-container">
      <div className="filters">
        <div className="filter-row">
          <label>
            League:
            <select name="league" value={filters.league} onChange={handleFilterChange}>
              <option value="Regular">Regular Season</option>
              <option value="Playoffs">Playoffs</option>
            </select>
          </label>
          <label>
            Stats Type:
            <select name="statsType" value={filters.statsType} onChange={handleFilterChange}>
              <option value="Totals">Totals</option>
              <option value="Averages">Averages</option>
              <option value="Shooting">Shooting</option>
              <option value="Opponent">Opponent</option>
              <option value="Advanced">Advanced</option>
              <option value="FourFactors">Four Factors</option>
            </select>
          </label>
          <label>
            Division:
            <select name="division" value={filters.division} onChange={handleFilterChange}>
              <option value="">All Divisions</option>
              {divisionOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            Sort Column:
            <select name="sortColumn" value={sortColumn} onChange={handleSortColumnChange}>
              <option value="">Select column to sort</option>
              {sortOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            Sort Direction:
            <select name="sortDirection" value={sortDirection} onChange={handleSortDirectionChange}>
              <option value="asc">Up</option>
              <option value="desc">Down</option>
            </select>
          </label>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th className="row-number">#</th>
              {tableHeaders.map((header, index) => (
                <th key={index} title={glossary[header] || ''}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedTeams.length > 0 ? (
              sortedTeams.map((team, index) => (
                <tr key={index}>
                  <td className="row-number">{index + 1}</td>
                  {tableHeaders.map((header, idx) => (
                    <td key={idx}>{team[header]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={tableHeaders.length + 1}>No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Teams;
