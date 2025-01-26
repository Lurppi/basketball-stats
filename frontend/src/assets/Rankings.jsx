import React, { useState, useEffect, useMemo } from 'react';
import { fetchTeams } from '../api'; // API-Aufruf für TEAMS.csv
import Header from './Header';
import Footer from './Footer';
import './Rankings.css'; // Neue CSS-Datei für Rankings
import { columnHeaderMapping, ToolheadersMapping, teamImageMappings } from './MappingList.jsx'; // Überschriften und Tooltips Mapping

const Rankings = () => {
  const [allRankings, setAllRankings] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    season: '2024-2025',
    league: 'JBBL',
    division: 'JBBL',
    seasonType: 'QUALIFICATION',
  });

  const [seasons, setSeasons] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [seasonTypes, setSeasonTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Definiere die Tabelle-Überschriften, die du anzeigen möchtest
  const tableHeaders = ['#', '', 'TEAM', 'GP', 'W', 'L', 'WIN%', 'NRTG', 'ORTG', 'DRTG'];

  // Teams CSV laden und Filter-Dropdowns initialisieren
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTeams();
        if (data && data.length > 0) {
          // Filter: Nur Zeilen, bei denen SEASON_YEAR nicht leer ist
          const filteredData = data.filter(item => item.SEASON_YEAR && item.SEASON_YEAR.trim() !== "");

          setAllRankings(filteredData);
          setFilteredData(filteredData);

          // Einzigartige Filteroptionen (Seasons, Leagues, Divisions, SeasonTypes) initialisieren
          setSeasons([...new Set(filteredData.map(item => formatSeason(item.SEASON_YEAR)))]);
          setLeagues([...new Set(filteredData.map(item => item.LEAGUE))]);
          setDivisions([...new Set(filteredData.map(item => item.DIV))]);
          setSeasonTypes([...new Set(filteredData.map(item => item.SEASON_TYPE))]);
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
      const seasonMatch = !filters.season || formatSeason(team.SEASON_YEAR) === filters.season;
      const leagueMatch = !filters.league || team.LEAGUE === filters.league;
      const divisionMatch = !filters.division || team.DIV === filters.division;
      const seasonTypeMatch = !filters.seasonType || team.SEASON_TYPE === filters.seasonType;

      return seasonMatch && leagueMatch && divisionMatch && seasonTypeMatch;
    });
  };

  useEffect(() => {
    setFilteredData(applyFilters(allRankings));
  }, [filters, allRankings]);

  const displayedRankings = useMemo(() => {
    const filtered = applyFilters(filteredData);

    const sortedByWinPercentageAndNRTG = filtered
      .map((team) => ({
        ...team,
        losses: team.GP - team.WINS, // Berechne die Verluste
        winPercentage: team.GP ? (100 * team.WINS / team.GP).toFixed(1) : '0.00', // Berechne Win%
      }))
      .sort((a, b) => {
        // Vergleiche zuerst die Win%
        const winPercentageDifference = b.winPercentage - a.winPercentage;

        if (winPercentageDifference !== 0) {
          return winPercentageDifference; // Sortiere nach Win%, wenn es Unterschiede gibt
        }

        // Wenn Win% gleich ist, sortiere nach NRTG
        return b.NRTG - a.NRTG;
      });

    return sortedByWinPercentageAndNRTG;
  }, [filteredData]);

  useEffect(() => {
    const updateDropdownValues = () => {
      const filteredBySeason = allRankings.filter(team => formatSeason(team.SEASON_YEAR) === filters.season);

      // League aktualisieren und alphabetisch sortieren (A-Z)
      const uniqueLeagues = [...new Set(filteredBySeason.map(team => team.LEAGUE))].sort(); // Sortiere Leagues alphabetisch
      let updatedLeague = filters.league;
      if (!uniqueLeagues.includes(filters.league)) {
        updatedLeague = uniqueLeagues[0] || '';  // Setze auf erste gültige Option oder leer
      }
      setLeagues(uniqueLeagues);

      // Division aktualisieren und alphabetisch sortieren (A-Z)
      const filteredByLeague = filteredBySeason.filter(team => team.LEAGUE === updatedLeague);
      const uniqueDivisions = [...new Set(filteredByLeague.map(team => team.DIV))].sort(); // Sortiere Divisions alphabetisch
      let updatedDivision = filters.division;
      if (!uniqueDivisions.includes(filters.division)) {
        updatedDivision = uniqueDivisions[0] || '';  // Setze auf erste gültige Option oder leer
      }
      setDivisions(uniqueDivisions);

      // Season Type aktualisieren und alphabetisch sortieren (A-Z)
      const filteredByDivision = filteredByLeague.filter(team => team.DIV === updatedDivision);
      const uniqueSeasonTypes = [...new Set(filteredByDivision.map(team => team.SEASON_TYPE))].sort(); // Sortiere Season Types alphabetisch
      let updatedSeasonType = filters.seasonType;
      if (!uniqueSeasonTypes.includes(filters.seasonType)) {
        updatedSeasonType = uniqueSeasonTypes[0] || '';  // Setze auf erste gültige Option oder leer
      }
      setSeasonTypes(uniqueSeasonTypes);

      // Aktualisiere die Filter
      setFilters(filters => ({
        ...filters,
        league: updatedLeague,
        division: updatedDivision,
        seasonType: updatedSeasonType,
      }));
    };

    // Nur ausführen, wenn Season, League oder Division sich ändern
    updateDropdownValues();
  }, [filters.season, filters.league, filters.division, allRankings]);

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
                  league: '', // Setze League zurück, wenn Season gewechselt wird
                  division: '', // Setze Division zurück, wenn Season gewechselt wird
                  seasonType: '', // Setze Season Type zurück, wenn Season gewechselt wird
                })
              }
            >
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
                  division: '', // Setze Division zurück, wenn League gewechselt wird
                  seasonType: '', // Setze Season Type zurück, wenn League gewechselt wird
                })
              }
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
              value={filters.division}
              onChange={e => {
                setFilters({
                  ...filters,
                  division: e.target.value,
                  seasonType: '', // Setze Season Type zurück, wenn Division gewechselt wird
                });
              }}
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
              value={filters.seasonType}
              onChange={e => setFilters({ ...filters, seasonType: e.target.value })}
            >
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
                  <td>
                    <img
                      src={teamImageMappings[team.TEAM]}
                      alt={`${team.TEAM} logo`}
                      style={{ width: 'auto', height: '40px' }}
                    />
                  </td> {/* Logo-Spalte */}
                  <td>{team.TEAM1}</td>
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
