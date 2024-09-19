import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './assets/Home';
import Players from './assets/Players';
import Teams from './assets/Teams';
import Form from './assets/Form';  // Import der neuen Form-Komponente
import Impressum from './assets/Impressum';
import Glossary from './assets/Glossary';
import Policy from './assets/Policy';
import Rankings from './assets/Rankings'; // Rankings-Komponente importieren
import Header from './assets/Header';
import PlayerPage from './assets/PlayerPage'; // Importiere PlayerPage
import './assets/Header.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<Players />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/form" element={<Form />} /> {/* Neue Form-Route */}
        <Route path="/standings" element={<Rankings />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/privacy-policy" element={<Policy />} />

        {/* Neue Route für dynamische Spielerprofile */}
        <Route path="/player/:id" element={<PlayerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
