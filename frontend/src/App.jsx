import React from 'react';
import Header from './assets/Header';
import Home from './assets/Home';
import Players from './assets/Players';
import Teams from './assets/Teams';
import Impressum from './assets/Impressum';  // Importiere die Impressum-Seite
import Footer from './assets/Footer';  // Importiere den Footer
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<Players />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/impressum" element={<Impressum />} />  {/* Route für Impressum */}
      </Routes>
      <Footer />  {/* Footer am Ende */}
    </Router>
  );
}

export default App;
