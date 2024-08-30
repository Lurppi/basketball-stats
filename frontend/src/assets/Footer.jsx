import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <p>&copy; 2024 NBBL Stats Dashboard</p>
      <p>
        <Link to="/impressum" className="footer-link">Impressum</Link> | {/* Trennzeichen hinzufügen */}
        <Link to="/glossary" className="footer-link">Glossary</Link> | {/* Trennzeichen hinzufügen */}
        <Link to="/privacy-policy" className="footer-link">Policy</Link> {/* Link zur Datenschutzerklärung */}
      </p>
    </footer>
  );
};

export default Footer;
