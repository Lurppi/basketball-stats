import React, { useEffect, useState } from 'react';
import StatsTable from '../assets/StatsTable'; // Importiere die Tabellenkomponente
import './Home.css'; // Importiere CSS für die Home-Seite
import Header from './Header';
import Footer from './Footer';
import NBBLLogo from '../images/NBBL.png'; // Importiere NBBL-Logo
import JBBLLogo from '../images/JBBL.png'; // Importiere JBBL-Logo
import { nbblTeams, jbblTeams, teamImageMappings } from './MappingList';

const Home = () => {
  const [activeTab, setActiveTab] = useState('players'); // Umschaltung zwischen Players und Teams
  const [selectedLeague, setSelectedLeague] = useState('NBBL'); // State für die ausgewählte Liga
  const [statsData, setStatsData] = useState({}); // Daten für alle Tabellen

  // Definierte Tabellenüberschriften und API-Felder für Spieler
  const playerStatsConfig = [
    { title: 'POINTS PER GAME', apiField: 'PPG' },
    { title: 'REBOUNDS PER GAME', apiField: 'RPG' },
    { title: 'ASSISTS PER GAME', apiField: 'APG' },
    { title: 'EFFICIENCY PER GAME', apiField: 'EFPG' },
    { title: 'BOXSCORE PLUS/MINUS', apiField: 'BPM' },
    { title: 'PLAYER EFFICIENCY RATING', apiField: 'PER' },
    { title: 'PLAYER IMPACT ESTIMATE', apiField: 'PIE' },
    { title: 'WIN SHARES / 40 MIN', apiField: 'WS_40' },
  ];

  // Definierte Tabellenüberschriften und API-Felder für Teams
  const teamStatsConfig = [
    { title: 'POINTS PER GAME', apiField: 'PPG' },
    { title: 'OFFENSIVE RATING', apiField: 'ORTG' },
    { title: 'DEFENSIVE RATING', apiField: 'DRTG' },
    { title: 'NET RATING', apiField: 'NRTG' },
    { title: 'EFFECTIVE FIELD GOAL PCT', apiField: 'EFG%' },
    { title: 'TURNOVER PCT', apiField: 'TOV%' },
    { title: 'OFFENSIVE REBOUND PCT', apiField: 'ORB%' },
    { title: 'FREE THROW RATE', apiField: 'FT_RATE' },
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
          .sort((a, b) =>
            (stat.apiField === 'DRTG' || stat.apiField === 'TOV%') // Überprüfen, ob es "DRTG" oder "TOV%" ist
              ? parseFloat(a[stat.apiField]) - parseFloat(b[stat.apiField]) // Aufsteigende Sortierung
              : parseFloat(b[stat.apiField]) - parseFloat(a[stat.apiField]) // Absteigende Sortierung für andere Felder
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

  // Funktion zur Auswahl der richtigen Teams basierend auf der ausgewählten Liga
  const getTeamsForLeague = (league) => {
    return league === 'NBBL' ? nbblTeams : jbblTeams;
  };

  // Ausgewählte Teams und deren Logos
  const currentTeams = getTeamsForLeague(selectedLeague);

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

      {/* Team-Logos für die ausgewählte Liga */}
      <div className="team-logos">
        {currentTeams.map((team, index) => (
          <img
            key={index}
            src={teamImageMappings[team]} // Mapping des Teams zum Logo
            alt={team}
            className="team-logo"
          />
        ))}
      </div>

      <div className="content">
        <div className="text-container">
          <p>Here are the current top 10 players and teams in various categories, like Points per Game, Rebounds per Game or Assists per Game. Players with 150+ total minutes are qualified for the ranking. Choose between NBBL or JBBL and Players or Teams. </p>
          <h1>Top 10 Leaders</h1>
        </div>

        {/* 8 Tabellen: 4 pro Zeile */}
        <div className="table-grid">
          {statsConfig.map((stat, index) => (
            <StatsTable
              key={index}
              title={stat.title}
              data={statsData[stat.apiField] || []}
              nameField={activeTab === 'players' ? 'PLAYER' : 'TEAM'}
              gamesField="GP"
              statField={stat.apiField}
              logoField="TEAM"
              fullListUrl={fullListUrl}
              teamLogoMap={teamImageMappings}
            />
          ))}
        </div>

        {/* Text unterhalb der Tabellen */}
        <div className="text-container">
          <p>Feel free to use any stats from this site in articles, on podcasts, or on social media, as long as you say where you got them from.</p>
          <p>Any problems using the site? Ideas to improve it? Random interesting thoughts? Email dennis.uhlig@icloud.com</p>
          <p>The match data is sourced from www.nbbl-basketball.de</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;