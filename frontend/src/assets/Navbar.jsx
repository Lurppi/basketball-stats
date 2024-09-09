// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/players">Players</Link>
      <Link to="/teams">Teams</Link>
      <div className="dropdown">
        <button className="dropbtn">Teams</button>
        <div className="dropdown-content">
          <Link to="/teams/form">Form</Link>
        </div>
      </div>
      <Link to="/standings">Standings</Link>
    </nav>
  );
};

export default Navbar;
