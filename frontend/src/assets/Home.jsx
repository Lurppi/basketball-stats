import React, { useEffect, useState } from 'react';
import StatsTable from '../assets/StatsTable'; // Importiere die Tabellenkomponente
import './Home.css'; // Importiere CSS für die Home-Seite
import Header from './Header';
import Footer from './Footer';
import NBBLLogo from '../images/NBBL.png'; // Importiere NBBL-Logo
import JBBLLogo from '../images/JBBL.png'; // Importiere JBBL-Logo
import teamImageMappings from './MappingList';

const Home = () => {
  const [activeTab, setActiveTab] = useState('players'); // Umschaltung zwischen Players und Teams
  const [selectedLeague, setSelectedLeague] = useState('NBBL'); // State für die ausgewählte Liga
  const [statsData, setStatsData] = useState({}); // Daten für alle Tabellen

  // Definierte Tabellenüberschriften und API-Felder für Spieler
  const playerStatsConfig = [
    { title: 'POINTS PER GAME', apiField: 'PPG' },
    { title: 'OFF. REBOUNDS PER GAME', apiField: 'ORPG' },
    { title: 'REBOUNDS PER GAME', apiField: 'RPG' },
    { title: 'ASSISTS PER GAME', apiField: 'APG' },
    { title: 'BOXSCORE PLUS/MINUS', apiField: 'BPM' },
    { title: 'PLAYER EFFICIENCY RATING', apiField: 'PER' },
    { title: 'PLAYER IMPACT ESTIMATE', apiField: 'PIE' },
    { title: 'WIN SHARES / 40 MIN', apiField: 'WS_40' },
  ];

  // Definierte Tabellenüberschriften und API-Felder für Teams
  const teamStatsConfig = [
    { title: 'POINTS PER GAME', apiField: 'PPG' },
    { title: 'REBOUNDS PER GAME', apiField: 'RPG' },
    { title: 'ASSISTS PER GAME', apiField: 'APG' },
    { title: 'EFFICIENCY PER GAME', apiField: 'EFPG' },
    { title: 'OFFENSIVE RATING', apiField: 'ORTG' },
    { title: 'DEFENSIVE RATING', apiField: 'DRTG' }, // Dieser Stat wird anders sortiert
    { title: 'NET RATING', apiField: 'NRTG' },
    { title: 'TRUE SHOOTING', apiField: 'TS%' },
  ];

  const getApiUrl = () => {
    return activeTab === 'players'
      ? 'https://backend-sandy-rho.vercel.app/api/players/rankings'
      : 'https://backend-sandy-rho.vercel.app/api/teams/rankings';
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(getApiUrl());
      if (!response.ok) {
        console.error('API response error:', response.status);
        return;
      }
      const data = await response.json();

      // Filtere die Daten nach der ausgewählten Liga
      const filteredData = data.filter(item => item.LEAGUE === selectedLeague);

      // Sortiere die Statistiken wie zuvor beschrieben
      const statsConfig = activeTab === 'players' ? playerStatsConfig : teamStatsConfig;

      const top10Data = statsConfig.reduce((acc, stat) => {
        const sorted = filteredData
          .sort((a, b) => stat.apiField === 'DRTG'
            ? parseFloat(a[stat.apiField]) - parseFloat(b[stat.apiField])
            : parseFloat(b[stat.apiField]) - parseFloat(a[stat.apiField])
          )
          .slice(0, 10); // Top 10 filtern

        acc[stat.apiField] = sorted;
        return acc;
      }, {});

      setStatsData(top10Data);
    };

    fetchData();
  }, [activeTab, selectedLeague]);

  const statsConfig = activeTab === 'players' ? playerStatsConfig : teamStatsConfig;

  // Full List URL abhängig vom aktiven Tab (Players oder Teams)
  const fullListUrl = activeTab === 'players'
    ? 'https://www.nbbl-stats.de/players'
    : 'https://www.nbbl-stats.de/teams';

  return (
    <div className="home-container">
      <Header />
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
      <Footer />
    </div>
  );
};

export default Home;
