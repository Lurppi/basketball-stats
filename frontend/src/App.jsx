import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './assets/Home';
import Players from './assets/Players';
import Teams from './assets/Teams';
import Impressum from './assets/Impressum';
import Glossary from './assets/Glossary';
import Policy from './assets/Policy';
import Rankings from './assets/Rankings'; // Rankings-Komponente importieren
import Header from './assets/Header';
import './assets/Header.css';

function App() {
  return (
    <Router>
      <Header /> {/* Falls du möchtest, dass der Header immer sichtbar ist */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<Players />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/standings" element={<Rankings />} /> {/* Neue Rankings-Route */}
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/privacy-policy" element={<Policy />} />
      </Routes>
    </Router>
  );
}

export default App;
