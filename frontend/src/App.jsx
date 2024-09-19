// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './assets/Home';
import Players from './assets/Players';
import Teams from './assets/Teams';
import Form from './assets/Form';
import Impressum from './assets/Impressum';
import Glossary from './assets/Glossary';
import Policy from './assets/Policy';
import Rankings from './assets/Rankings';
import Header from './assets/Header';
import PlayerPage from './assets/PlayerPage';
import PlayersWithBadges from './assets/PlayersWithBadges'; // Neue Komponente

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<Players />} />
        <Route path="/players/badges" element={<PlayersWithBadges />} /> {/* Neue Route */}
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/form" element={<Form />} />
        <Route path="/standings" element={<Rankings />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/privacy-policy" element={<Policy />} />
        <Route path="/player/:id" element={<PlayerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
