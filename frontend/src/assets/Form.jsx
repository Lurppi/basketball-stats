import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchForm } from '../api';
import Header from './Header';
import Footer from './Footer';
import './Form.css';

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

  const [team2, setTeam2] = useState('All'); // State für den "Team 2"-Filter
  const [showTeam2Filter, setShowTeam2Filter] = useState(false); // Steuert die Sichtbarkeit des "Team 2"-Filters

  const [seasons, setSeasons] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [seasonTypes, setSeasonTypes] = useState([]);
  const [teams, setTeams] = useState([]);

  // Füge dies hinzu:
  const [teamsForTeam2, setTeamsForTeam2] = useState([]); // State für die Teams in "Team 2"

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchForm();
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

  // Filterlogik zur Anwendung auf die Dropdown-Optionen
  const applyFilters = (data) => {
    return data.filter((game) => {
      const seasonMatch = filters.season === 'All' || game.Season === filters.season;
      const leagueMatch = filters.league === 'All' || game.League === filters.league;
      const divisionMatch = filters.division === 'All' || game.Division === filters.division;
      const seasonTypeMatch = filters.seasonType === 'All' || game['Season_Type'] === filters.seasonType;

      // Hier kombinieren wir die Logik von "Team" und "Team 2":
      const teamMatch = filters.team === 'All' || game.Team === filters.team || game.Team === team2;

      return seasonMatch && leagueMatch && divisionMatch && seasonTypeMatch && teamMatch;
    });
  };

  useEffect(() => {
    const updateDropdownValues = () => {
      const filtered = applyFilters(formData);

      const uniqueSeasons = [...new Set(formData.map(game => game.Season))];
      setSeasons(uniqueSeasons);

      const uniqueLeagues = [...new Set(
        formData
          .filter(game => filters.season === 'All' || game.Season === filters.season)
          .map(game => game.League)
      )];
      setLeagues(uniqueLeagues);

      const uniqueDivisions = [...new Set(
        formData
          .filter(game =>
            (filters.season === 'All' || game.Season === filters.season) &&
            (filters.league === 'All' || game.League === filters.league)
          )
          .map(game => game.Division)
      )];
      setDivisions(uniqueDivisions);

      const uniqueSeasonTypes = [...new Set(
        formData
          .filter(game =>
            (filters.season === 'All' || game.Season === filters.season) &&
            (filters.league === 'All' || game.League === filters.league) &&
            (filters.division === 'All' || game.Division === filters.division)
          )
          .map(game => game['Season_Type'])
      )];
      setSeasonTypes(uniqueSeasonTypes);

      const uniqueTeams = [...new Set(
        formData
          .filter(game =>
            (filters.season === 'All' || game.Season === filters.season) &&
            (filters.league === 'All' || game.League === filters.league) &&
            (filters.division === 'All' || game.Division === filters.division)
          )
          .map(game => game.Team)
      )];
      setTeams(uniqueTeams);

      // Hier filtern wir alle Teams, die nach der aktuellen Kaskadenlogik übrig bleiben, mit Ausnahme des Teams, das in "Team" ausgewählt wurde.
      const availableTeamsForTeam2 = uniqueTeams.filter(team => team !== filters.team);
      // Jetzt kannst du "availableTeamsForTeam2" für das Dropdown von "Team 2" verwenden
      setTeamsForTeam2(availableTeamsForTeam2);  // Setze den State für Team 2
      setFilteredData(filtered);
    };

    updateDropdownValues();
  }, [filters, formData]);

  // Team 2-Filter Sichtbarkeit steuern
  useEffect(() => {
    if (filters.team !== 'All') {
      setShowTeam2Filter(true);
    } else {
      setShowTeam2Filter(false);
      setTeam2('All');
    }
  }, [filters.team]);

  const getLocationLabel = (homeValue) => {
    switch (homeValue) {
      case '1':
        return 'Home';
      case '0':
        return 'Road';
      case '2':
        return 'Neutral';
      default:
        return 'Unknown';
    }
  };

  const chartData = useMemo(() => {
    // Wähle beide Teams aus, wenn vorhanden
    const selectedTeams = filters.team === 'All' ? [...new Set(formData.map((game) => game.Team))] : [filters.team];

    // Füge Team 2 hinzu, wenn es ausgewählt ist
    if (team2 !== 'All') {
      selectedTeams.push(team2);
    }

    const dates = [...new Set(filteredData.map((game) => game.Date))].sort();

    const datasets = selectedTeams.map((team) => {
      let cumulativeWins = 0;

      const teamData = dates.map((date) => {
        const gameOnDate = filteredData.find(
          (game) => game.Team === team && game.Date === date
        );
        if (gameOnDate) {
          const teamPoints = parseInt(gameOnDate.PTS, 10);
          const opponentPoints = parseInt(gameOnDate.OPP_PTS, 10);
          const win = teamPoints > opponentPoints;
          cumulativeWins += win ? 1 : 0;
        }
        return cumulativeWins;
      });

      return {
        label: team,
        data: teamData,
        fill: false,
        borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
        tension: 0.1,
      };
    });

    return {
      labels: dates,
      datasets,
    };
  }, [filteredData, filters.team, team2]);

  const options = {
    animation: {
      duration: 1000,
      easing: 'linear',
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 10, // Begrenze die Anzahl der angezeigten Ticks auf der X-Achse
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      tooltip: {
        mode: 'nearest',
        intersect: false,
        callbacks: {
          label: function (tooltipItem) {
            const game = filteredData.find(
              (game) => game.Team === tooltipItem.dataset.label && game.Date === tooltipItem.label
            );
            if (!game) return ''; // Verhindere Fehler, falls kein passendes Spiel gefunden wird

            const location = getLocationLabel(game.Home); // Bestimme Location
            const vsOrAt = game.Home === '1' || game.Home === '2' ? 'vs' : '@'; // Bestimme "vs" oder "@"
            const opponent = game.Opponent || 'undefined'; // Gegnerteam aus Spalte "Opponent"

            // Füge einen Zeilenumbruch für "Total Wins" ein
            return [
              `${game.Team} ${vsOrAt} ${opponent} ${game.PTS}-${game.OPP_PTS}`,
              `Total Wins: ${tooltipItem.raw}`,
            ];
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="form-grid-container">
      <Header />
      <div className="filters-container">
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
              onChange={(e) => {
                setFilters({ ...filters, team: e.target.value });
                setTeam2('All'); // Setze "Team 2" zurück, wenn "Team" geändert wird
              }}
            >
              <option value="All">All</option>
              {teams.map((team, idx) => (
                <option key={idx} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </label>

          {showTeam2Filter && (
            <label>
              Team 2:
              <select
                name="team2"
                value={team2}
                onChange={(e) => setTeam2(e.target.value)}
              >
                <option value="All">All</option>
                {teams
                  .filter((team) => team !== filters.team) // Schließe das in "Team" ausgewählte Team aus
                  .map((team, idx) => (
                    <option key={idx} value={team}>
                      {team}
                    </option>
                  ))}
              </select>
            </label>
          )}
        </div>
      </div>

      <div className="form-chart-container">
        <div className="chart-container">
          <Line data={chartData} options={options} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Form;