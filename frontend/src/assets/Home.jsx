import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-header">NBBL Stats Dashboard</h1>
      <div className="button-container">
        <Link to="/players">
          <button className="windows-button">Players</button>
        </Link>
        <Link to="/teams">
          <button className="windows-button">Teams</button>
        </Link>
      </div>
      <div className="slider-container">
        {/* Slider-Komponente */}
      </div>
      <div className="stats-card">
        {/* Stats-Card-Inhalte */}
      </div>
      <div className="table-container">
        {/* Tabelleninhalte */}
      </div>
    </div>
  );
};

export default Home;
