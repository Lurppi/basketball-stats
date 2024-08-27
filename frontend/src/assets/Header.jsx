// src/assets/Header.jsx
import React from 'react';
import './Header.css';

function Header() {
  return (
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/players">Players</a>
        <a href="/teams">Teams</a>
      </nav>
    </header>
  );
}

export default Header;
