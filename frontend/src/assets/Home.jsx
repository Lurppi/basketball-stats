// Home.jsx - Fetch alle Spieler- oder Teamdaten und filtere im Frontend
import React, { useEffect, useState } from 'react';
import StatsTable from '../assets/StatsTable'; // Importiere die Tabellenkomponente
import './Home.css'; // Importiere CSS für die Home-Seite
import NBBLLogo from '../images/NBBL.png'; // Importiere NBBL-Logo
import JBBLLogo from '../images/JBBL.png'; // Importiere JBBL-Logo
import teamImageMappings from './MappingList';

const Home = () => {
  const [activeTab, setActiveTab] = useState('players'); // Umschaltung zwischen Players und Teams
  const [selectedLeague, setSelectedLeague] = useState('NBBL'); // State für die ausgewählte Liga
  const [statsData, setStatsData] = useState({}); // Daten für alle Tabellen

  // Definierte Tabellenüberschriften und API-Felder für Spieler
  const playerStatsConfig = [
    { title: 'Points per Game', apiField: 'PPG' },
    { title: 'Rebounds per Game', apiField: 'RPG' },
    { title: 'Assists per Game', apiField: 'APG' },
    { title: '3-Pointer Made', apiField: '3PM' },
    { title: 'Boxscore Plus/Minus', apiField: 'BPM' },
    { title: 'Player Efficiency Rating', apiField: 'PER' },
    { title: 'Player Impact Estimate', apiField: 'PIE' },
    { title: 'Win Shares', apiField: 'WS' },
  ];

  // Definierte Tabellenüberschriften und API-Felder für Teams
  const teamStatsConfig = [
    { title: 'Points per Game', apiField: 'PPG' },
    { title: 'Rebounds per Game', apiField: 'RPG' },
    { title: 'Assists per Game', apiField: 'APG' },
    { title: 'Efficiency per Game', apiField: 'EFPG' },
    { title: 'Offensive Rating', apiField: 'ORTG' },
    { title: 'Defensive Rating', apiField: 'DRTG' }, // Dieser Stat wird anders sortiert
    { title: 'Net Rating', apiField: 'NRTG' },
    { title: 'True Shooting', apiField: 'TS%' },
  ];

  // Dynamische URL basierend auf dem Tab (Players oder Teams)
  const getApiUrl = () => {
    return `/api/${activeTab}/rankings`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(getApiUrl());
      const data = await response.json();

      // Filtere nur die Spieler/Teams aus der ausgewählten Liga (NBBL/JBBL)
      const filteredData = data.filter(item => item.LEAGUE === selectedLeague);

      // Berechne die Top 10 für jede Statistik im Frontend
      const statsConfig = activeTab === 'players' ? playerStatsConfig : teamStatsConfig;

      const top10Data = statsConfig.reduce((acc, stat) => {
        const sorted = filteredData
          .sort((a, b) => stat.apiField === 'DRTG'
            ? parseFloat(a[stat.apiField]) - parseFloat(b[stat.apiField]) // Defensive Rating von klein nach groß
            : parseFloat(b[stat.apiField]) - parseFloat(a[stat.apiField]) // Andere Stats von groß nach klein
          )
          .slice(0, 10); // Top 10 filtern

        acc[stat.apiField] = sorted;
        return acc;
      }, {});

      setStatsData(top10Data);
    };

    fetchData();
  }, [activeTab, selectedLeague]); // Neu laden bei Wechsel von Tab oder Liga

  const statsConfig = activeTab === 'players' ? playerStatsConfig : teamStatsConfig;

  // Full List URL abhängig vom aktiven Tab (Players oder Teams)
  const fullListUrl = activeTab === 'players'
    ? 'https://www.nbbl-stats.de/players'
    : 'https://www.nbbl-stats.de/teams';

  return (
    <div className="home-container">
      {/* Umschaltbare Logos für Ligen */}
      <div className="league-switch">
        <img
          src={NBBLLogo}
          alt="NBBL"
          className={selectedLeague === 'NBBL' ? 'active-league' : ''}
          onClick={() => setSelectedLeague('NBBL')}
        />
        <img
          src={JBBLLogo}
          alt="JBBL"
          className={selectedLeague === 'JBBL' ? 'active-league' : ''}
          onClick={() => setSelectedLeague('JBBL')}
        />
      </div>

      {/* Umschaltknöpfe für Players / Teams */}
      <nav className="breadcrumb">
        <button
          className={activeTab === 'players' ? 'active-tab' : ''}
          onClick={() => setActiveTab('players')}
        >
          Players
        </button>
        <button
          className={activeTab === 'teams' ? 'active-tab' : ''}
          onClick={() => setActiveTab('teams')}
        >
          Teams
        </button>
      </nav>

      <div className="content">
        <div className="text-container">
          <p>Here are the current top 10 players and teams in various categories.</p>
          <h1>Top 10 Leaders</h1>
        </div>

        {/* 8 Tabellen: 4 pro Zeile */}
        <div className="table-grid">
          {statsConfig.map((stat, index) => (
            <StatsTable
              key={index}
              title={stat.title}
              data={statsData[stat.apiField] || []} // Daten für das spezifische Statfeld
              nameField={activeTab === 'players' ? 'PLAYER' : 'TEAM'} // Name-Feld: Spielername oder Teamname
              gamesField="GP" // Feld für gespielte Spiele
              statField={stat.apiField} // Das aktuelle Stat-Feld
              logoField="TEAM" // Verwende das "TEAM"-Feld für das Logo
              fullListUrl={fullListUrl} // Full List URL für Players oder Teams
              teamLogoMap={teamImageMappings} // Map für die Team-Logos
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
