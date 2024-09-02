import React from 'react';
import Navbar from './Navbar';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      {/* Hier kannst du auch andere Komponenten hinzufügen, wie ein Logo oder eine Suche */}
      <Navbar />
    </header>
  );
};

export default Header;
