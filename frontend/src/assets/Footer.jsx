import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <p>&copy; 2024 NBBL Stats Dashboard</p>
      <p><Link to="/impressum" className="footer-link">Impressum</Link></p>
    </footer>
  );
};

export default Footer;
