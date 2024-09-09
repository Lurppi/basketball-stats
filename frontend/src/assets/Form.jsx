import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2'; // Für das Diagramm
import { fetchForm } from '../api'; // API-Aufruf für Matchdata
import Header from './Header';
import Footer from './Footer';
import './Form.css';

// Chart.js registration (added)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Form = () => {
  const [formData, setFormData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    season: 'All',
    league: 'All',
    division: 'All',
    seasonType: 'All',
    team: 'All',
  });

  const [seasons, setSeasons] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [seasonTypes, setSeasonTypes] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchForm(); // Hole die Spieldaten
        if (data && data.length > 0) {
          setFormData(data);

          // Initiale Dropdown-Werte setzen
          setSeasons([...new Set(data.map((item) => item.Season))]);
          setLeagues([...new Set(data.map((item) => item.League))]);
          setDivisions([...new Set(data.map((item) => item.Division))]);
          setSeasonTypes([...new Set(data.map((item) => item['Season_Type']))]);
          setTeams([...new Set(data.map((item) => item.Team))]);

          setFilteredData(data);
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

  const applyFilters = (data) => {
    return data.filter((game) => {
      const seasonMatch = filters.season === 'All' || game.Season === filters.season;
      const leagueMatch = filters.league === 'All' || game.League === filters.league;
      const divisionMatch = filters.division === 'All' || game.Division === filters.division;
      const seasonTypeMatch = filters.seasonType === 'All' || game['Season_Type'] === filters.seasonType;
      const teamMatch = filters.team === 'All' || game.Team === filters.team;

      return seasonMatch && leagueMatch && divisionMatch && seasonTypeMatch && teamMatch;
    });
  };

  useEffect(() => {
    const updateDropdownValues = () => {
      const filtered = applyFilters(formData);

      const uniqueLeagues = [...new Set(filtered.map((game) => game.League))];
      setLeagues(uniqueLeagues);

      const uniqueDivisions = [...new Set(filtered.map((game) => game.Division))];
      setDivisions(uniqueDivisions);

      const uniqueSeasonTypes = [...new Set(filtered.map((game) => game['Season_Type']))];
      setSeasonTypes(uniqueSeasonTypes);

      const uniqueTeams = [...new Set(filtered.map((game) => game.Team))];
      setTeams(uniqueTeams);

      setFilteredData(filtered);
    };

    updateDropdownValues();
  }, [filters, formData]);

  // Funktion zum Vorbereiten der Daten für das Diagramm
  const chartData = useMemo(() => {
    const teams = [...new Set(filteredData.map((game) => game.Team))]; // Alle einzigartigen Teams
    const dates = [...new Set(filteredData.map((game) => game.Date))]; // Alle Spieltage

    const datasets = teams.map((team) => {
      let cumulativeWins = 0;

      const teamData = dates.map((date) => {
        const gameOnDate = filteredData.find(
          (game) => game.Team === team && game.Date === date
        );
        if (gameOnDate) {
          const win = gameOnDate.PTS > gameOnDate.OPP_PTS;
          cumulativeWins += win ? 1 : 0;
        }
        return cumulativeWins;
      });

      return {
        label: team,
        data: teamData,
        fill: false,
        borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16), // Zufällige Farbe für jedes Team
        tension: 0.1,
      };
    });

    return {
      labels: dates,
      datasets,
    };
  }, [filteredData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="form-container">
      <Header />
      <div className="form-filters">
        <label>
          Season:
          <select
            name="season"
            value={filters.season}
            onChange={(e) => setFilters({ ...filters, season: e.target.value })}
          >
            <option value="All">All</option>
            {seasons.map((season, idx) => (
              <option key={idx} value={season}>
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
            onChange={(e) => setFilters({ ...filters, league: e.target.value })}
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
            onChange={(e) => setFilters({ ...filters, division: e.target.value })}
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
            onChange={(e) => setFilters({ ...filters, seasonType: e.target.value })}
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
          Team:
          <select
            name="team"
            value={filters.team}
            onChange={(e) => setFilters({ ...filters, team: e.target.value })}
          >
            <option value="All">All</option>
            {teams.map((team, idx) => (
              <option key={idx} value={team}>
                {team}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="chart-container">
        <Line data={chartData} />
      </div>

      <Footer />
    </div>
  );
};

export default Form;
