import React, { useState, useEffect } from 'react';
import { fetchPlayers } from '../api';
import './Players.css';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [sortedPlayers, setSortedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState('GP');
  const [filters, setFilters] = useState({
    league: 'Regular',
    statsType: 'Totals',
    team: '',
    division: '',
    position: '',
    born: '',
    gp: '',
    mp: ''
  });
  const [currentPage, setCurrentPage] = useState(0);
  const playersPerPage = 25;
  const [filterOptions, setFilterOptions] = useState({
    teams: [],
    divisions: [],
    positions: [],
    borns: []
  });
  const [sortOptions, setSortOptions] = useState([]);
  const [showingPlayersCount, setShowingPlayersCount] = useState(playersPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPlayers(filters.league, filters.statsType);
        setPlayers(data);

        const uniqueTeams = [...new Set(data.map(player => player.TEAM).filter(team => team))].sort();
        const uniqueDivisions = [...new Set(data.map(player => player.DIV).filter(div => div))].sort();
        const uniquePositions = [...new Set(data.map(player => player.POS).filter(pos => pos))].sort();
        const uniqueBorns = [...new Set(data.map(player => player.BORN).filter(born => born))].sort();

        setFilterOptions({
          teams: uniqueTeams,
          divisions: uniqueDivisions,
          positions: uniquePositions,
          borns: uniqueBorns,
        });

        if (data.length > 0) {
          const headerKeys = Object.keys(data[0]);
          const gpIndex = headerKeys.indexOf('GP');
          if (gpIndex > -1) {
            setSortOptions(headerKeys.slice(gpIndex + 1));
          }
        }

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  useEffect(() => {
    let filtered = [...players];

    if (filters.team) {
      filtered = filtered.filter(player => player.TEAM === filters.team);
    }
    if (filters.division) {
      filtered = filtered.filter(player => player.DIV === filters.division);
    }
    if (filters.position) {
      filtered = filtered.filter(player => player.POS === filters.position);
    }
    if (filters.born) {
      filtered = filtered.filter(player => player.BORN === filters.born);
    }
    if (filters.gp) {
      const gpValue = parseInt(filters.gp, 10);
      filtered = filtered.filter(player => parseInt(player.GP, 10) >= gpValue);
    }
    if (filters.mp) {
      const mpValue = parseInt(filters.mp, 10);
      filtered = filtered.filter(player => parseInt(player.MP, 10) >= mpValue);
    }

    let sorted = [...filtered];

    if (sortColumn) {
      sorted.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        const isNumericColumn = !isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue));

        if (isNumericColumn) {
          return parseFloat(bValue) - parseFloat(aValue);
        } else {
          return String(bValue).localeCompare(String(aValue));
        }
      });
    }

    setSortedPlayers(sorted);
    setShowingPlayersCount(playersPerPage); // Reset the showing players count
  }, [players, sortColumn, filters]);

  const handleSortColumnChange = (e) => {
    setSortColumn(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(0); // Reset page number on filter change
    setShowingPlayersCount(playersPerPage); // Reset showing players count
  };

  const handleShowMore = () => {
    setShowingPlayersCount(prevCount => prevCount + playersPerPage);
  };

  const filteredPlayers = sortedPlayers.filter(player => Object.values(player).some(value => value !== null && value !== ''));

  const displayPlayers = filteredPlayers.slice(0, showingPlayersCount);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <div className="container">
      {/* Überschrift entfernt */}
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
              <option value="Advanced1">Advanced1</option>
              <option value="Advanced2">Advanced2</option>
              <option value="FourFactors">Four Factors</option>
            </select>
          </label>
          <label>
            Division:
            <select name="division" value={filters.division} onChange={handleFilterChange}>
              <option value="">All</option>
              {filterOptions.divisions.map((division, index) => (
                <option key={index} value={division}>{division}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="filter-row">
          <label>
            Team:
            <select name="team" value={filters.team} onChange={handleFilterChange}>
              <option value="">All</option>
              {filterOptions.teams.map((team, index) => (
                <option key={index} value={team}>{team}</option>
              ))}
            </select>
          </label>
          <label>
            Position:
            <select name="position" value={filters.position} onChange={handleFilterChange}>
              <option value="">All</option>
              {filterOptions.positions.map((position, index) => (
                <option key={index} value={position}>{position}</option>
              ))}
            </select>
          </label>
          <label>
            Born:
            <select name="born" value={filters.born} onChange={handleFilterChange}>
              <option value="">All</option>
              {filterOptions.borns.map((born, index) => (
                <option key={index} value={born}>{born}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="filter-row">
          <label>
            Games Played:
            <input
              type="number"
              name="gp"
              value={filters.gp}
              onChange={handleFilterChange}
              placeholder="Min GP"
            />
          </label>
          <label>
            Minutes Played:
            <input
              type="number"
              name="mp"
              value={filters.mp}
              onChange={handleFilterChange}
              placeholder="Min MP"
            />
          </label>
          <label>
            Sort Column:
            <select name="sortColumn" value={sortColumn} onChange={handleSortColumnChange}>
              <option value="">Select column to sort</option>
              {sortOptions.map((column, index) => (
                <option key={index} value={column}>{column}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              {Object.keys(players[0] || {}).map((key, index) => (
                <th key={index}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayPlayers.map((player, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                {Object.values(player).map((value, subIndex) => (
                  <td key={subIndex} className={subIndex === 2 ? "team-column" : ""}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {showingPlayersCount < filteredPlayers.length && (
          <button className="show-more-button" onClick={handleShowMore}>
            Show More
          </button>
        )}
      </div>
    </div>
  );
};

export default Players;
