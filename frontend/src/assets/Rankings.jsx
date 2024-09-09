import React, { useState, useEffect, useMemo } from 'react';
import { fetchTeams } from '../api'; // API-Aufruf für TEAMS.csv
import Header from './Header';
import Footer from './Footer';
import './Rankings.css'; // Neue CSS-Datei für Rankings
import { columnHeaderMapping, ToolheadersMapping } from './MappingList.jsx'; // Überschriften und Tooltips Mapping

const Rankings = () => {
  const [allRankings, setAllRankings] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    season: '2023-2024',
    league: 'NBBL',
    division: 'NBBL A',
    seasonType: 'PLAYOFFS',
  });

  const [seasons, setSeasons] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [seasonTypes, setSeasonTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Definiere die Tabelle-Überschriften, die du anzeigen möchtest
  const tableHeaders = ['#', 'Team', 'GP', 'W', 'L', 'Win%', 'ORTG', 'DRTG', 'NRTG'];

  // Teams CSV laden und Filter-Dropdowns initialisieren
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTeams();
        if (data && data.length > 0) {
          setAllRankings(data);
          setFilteredData(data);

          // Einzigartige Filteroptionen (Seasons, Leagues, Divisions, SeasonTypes) initialisieren
          setSeasons([...new Set(data.map(item => formatSeason(item.SEASON_YEAR)))]);
          setLeagues([...new Set(data.map(item => item.LEAGUE))]);
          setDivisions([...new Set(data.map(item => item.DIV))]);
          setSeasonTypes([...new Set(data.map(item => item.SEASON_TYPE))]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Funktion, um SEASON_YEAR von "20222023" in "2022-2023" zu formatieren
  const formatSeason = (seasonYear) => {
    if (seasonYear.length === 8) {
      return `${seasonYear.slice(0, 4)}-${seasonYear.slice(4)}`;
    }
    return seasonYear;
  };

  // Filter anwenden
  const applyFilters = (data) => {
    return data.filter(team => {
      const seasonMatch = filters.season === 'All' || formatSeason(team.SEASON_YEAR) === filters.season;
      const leagueMatch = filters.league === 'All' || team.LEAGUE === filters.league;
      const divisionMatch = filters.division === 'All' || team.DIV === filters.division;
      const seasonTypeMatch = filters.seasonType === 'All' || team.SEASON_TYPE === filters.seasonType;

      return seasonMatch && leagueMatch && divisionMatch && seasonTypeMatch;
    });
  };

  useEffect(() => {
    setFilteredData(applyFilters(allRankings));
  }, [filters, allRankings]);

  // Berechnung und Sortierung nach Win%
  const displayedRankings = useMemo(() => {
    const filtered = applyFilters(filteredData);

    const sortedByWinPercentage = filtered
      .map((team) => ({
        ...team,
        losses: team.GP - team.WINS, // Berechne die Verluste
        winPercentage: team.GP ? (100 * team.WINS / team.GP).toFixed(1) : '0.00', // Berechne Win%
      }))
      .sort((a, b) => b.winPercentage - a.winPercentage); // Sortiere nach Win%

    return sortedByWinPercentage;
  }, [filteredData]);

  // Update Dropdown-Werte auf Basis der Filter
  useEffect(() => {
    const updateDropdownValues = () => {
      const filtered = applyFilters(allRankings);

      // Seasons Dropdown aktualisieren
      const uniqueSeasons = [...new Set(allRankings.map(team => formatSeason(team.SEASON_YEAR)))];
      setSeasons(uniqueSeasons);

      // Leagues Dropdown aktualisieren
      const uniqueLeagues = [...new Set(
        allRankings
          .filter(team => filters.season === 'All' || formatSeason(team.SEASON_YEAR) === filters.season)
          .map(team => team.LEAGUE)
      )];
      setLeagues(uniqueLeagues);

      // Divisions Dropdown aktualisieren
      const uniqueDivisions = [...new Set(
        allRankings
          .filter(team =>
            (filters.season === 'All' || formatSeason(team.SEASON_YEAR) === filters.season) &&
            (filters.league === 'All' || team.LEAGUE === filters.league)
          )
          .map(team => team.DIV)
      )];
      setDivisions(uniqueDivisions);

      // SeasonTypes Dropdown aktualisieren
      const uniqueSeasonTypes = [...new Set(
        allRankings
          .filter(team =>
            (filters.season === 'All' || formatSeason(team.SEASON_YEAR) === filters.season) &&
            (filters.league === 'All' || team.LEAGUE === filters.league) &&
            (filters.division === 'All' || team.DIV === filters.division)
          )
          .map(team => team.SEASON_TYPE)
      )];
      setSeasonTypes(uniqueSeasonTypes);
    };

    updateDropdownValues();
  }, [filters, allRankings]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="rankings-grid-container">
      <Header />
      <div className="rankings-filter-container">
        <div className="rankings-filters">
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
                  seasonType: 'All', // Setze Season Type zurück, wenn Season gewechselt wird
                })
              }
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
              onChange={e =>
                setFilters({
                  ...filters,
                  league: e.target.value,
                  division: 'All', // Setze Division zurück, wenn League gewechselt wird
                  seasonType: 'All', // Setze Season Type zurück, wenn League gewechselt wird
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
                  seasonType: 'All', // Setze Season Type zurück, wenn Division gewechselt wird
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
              <option value="All">All</option>
              {seasonTypes.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="rankings-container">
        <div className="rankings-table-wrapper">
          <table className="rankings-table-container">
            <thead>
              <tr>
                {tableHeaders.map((header, idx) => (
                  <th key={idx} title={ToolheadersMapping[header] || header}>
                    {columnHeaderMapping[header] || header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedRankings.map((team, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{team.TEAM}</td>
                  <td>{team.GP}</td>
                  <td>{team.WINS}</td>
                  <td>{team.losses}</td>
                  <td>{team.winPercentage}</td>
                  <td>{team.ORTG}</td>
                  <td>{team.DRTG}</td>
                  <td>{team.NRTG}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Rankings;
