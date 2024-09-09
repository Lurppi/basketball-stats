import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">HOME</Link>
      <Link to="/players">PLAYERS</Link>

      {/* Dropdown for Teams */}
      <div className="dropdown">
        <button className="dropbtn">TEAMS</button>
        <div className="dropdown-content">
          <Link to="/teams">DASHBOARD</Link>
          <Link to="/teams/form">FORM</Link>
        </div>
      </div>

      <Link to="/standings">STANDINGS</Link>
    </nav>
  );
};

export default Navbar;
