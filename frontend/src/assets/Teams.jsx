import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './Teams.css';

const Teams = () => {
  return (
    <div className="grid-container">
      <Header />
      <div className="grid-item">
        <div className="teams-container">
          {/* Hier können Sie Ihre Inhalte einfügen */}
          <h1>Teams Page</h1>
          <p>Dies ist eine leere Seite für Teams. Sie können hier Ihre Inhalte hinzufügen.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Teams;
