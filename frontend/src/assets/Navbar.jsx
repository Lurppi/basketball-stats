import React, { useState, useId } from 'react'; // useId importieren
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId(); // Eindeutige ID generieren

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Verwende die dynamische ID hier */}
        <input
          type="checkbox"
          id={`menu-toggle-${uniqueId}`} // Dynamisch generierte eindeutige ID
          className="checkbox"
          checked={isOpen}
          onChange={handleToggle}
        />
        <div className="hamburger-lines" onClick={handleToggle}>
          <span className="line line1"></span>
          <span className="line line2"></span>
          <span className="line line3"></span>
        </div>

        <div className="logo">
          {/* Hier könnte das Logo hinzugefügt werden */}
        </div>

        <div className={`menu-items ${isOpen ? 'open' : ''}`}>
          <Link to="/">HOME</Link>
          <Link to="/standings">STANDINGS</Link>

          <div className="dropdown">
            <button className="dropbtn">TEAMS</button>
            <div className="dropdown-content">
              <Link to="/teams">DASHBOARD</Link>
              <Link to="/teams/form">FORM</Link>
            </div>
          </div>

          <Link to="/players">PLAYERS</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
