import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './assets/Header';
import Home from './assets/Home';
import Players from './assets/Players';
import Teams from './assets/Teams';
import Impressum from './assets/Impressum';
import Glossary from './assets/Glossary';  // Importiere die Glossary-Seite
import Footer from './assets/Footer';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<Players />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/glossary" element={<Glossary />} />  {/* Route für Glossary */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
