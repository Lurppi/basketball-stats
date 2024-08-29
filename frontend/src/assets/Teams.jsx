import React, { useState, useEffect } from 'react';
import { fetchTeams } from '../api';
import './Teams-desktop.css'; // Desktop-Styling
import './Teams-mobile.css';  // Mobile-Styling

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [sortedTeams, setSortedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    league: 'Regular', 
    statsType: 'Totals', 
    division: '', 
    sortColumn: ''
  });
  
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

    if (filters.sortColumn) {
      filteredData = filteredData.sort((a, b) => {
        const aValue = a[filters.sortColumn];
        const bValue = b[filters.sortColumn];

        const aNumber = isNaN(aValue) ? aValue : parseFloat(aValue);
        const bNumber = isNaN(bValue) ? bValue : parseFloat(bValue);

        if (aNumber < bNumber) return 1;
        if (aNumber > bNumber) return -1;
        return 0;
      });
    }

    setSortedTeams(filteredData);
  }, [filters.sortColumn, filters.division, teams]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
            <select name="sortColumn" value={filters.sortColumn} onChange={handleFilterChange}>
              <option value="">Select column to sort</option>
              {sortOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
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
                <th key={index} className={index >= 2 ? 'uniform-width' : ''}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedTeams.length > 0 ? (
              sortedTeams.map((team, index) => (
                <tr key={index}>
                  <td className="row-number">{index + 1}</td>
                  {tableHeaders.map((header, idx) => (
                    <td key={idx} className={idx >= 2 ? 'uniform-width' : ''}>{team[header]}</td>
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
