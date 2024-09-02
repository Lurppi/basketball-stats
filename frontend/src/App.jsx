import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './assets/Home';
import Players from './assets/Players';
import Teams from './assets/Teams';
import Impressum from './assets/Impressum';
import Glossary from './assets/Glossary'; 
import Footer from './assets/Footer';
import Policy from './assets/Policy';
import Header from './assets/Header'; // Header importieren
import './assets/Header.css'; // Header CSS importieren


function App() {
  return (
    <Router>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<Players />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/glossary" element={<Glossary />} />  
        <Route path="/privacy-policy" element={<Policy />} />  
      </Routes>
     </Router>
  );
}

export default App;
