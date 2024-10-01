// src/assets/StatsTable.jsx
import React from 'react';
import './StatsTable.css'; // Importiere die spezifischen Stile

const StatsTable = ({ title, data, nameField, gamesField, statField, fullListUrl }) => {
  return (
    <div className="leaderboard-table">
      <div className="table-header">
        <span>{title}</span>
        <a href={fullListUrl} className="full-list-link">Full List</a>
      </div>
      <div className="leaderboard-content">
        {data.length === 0 ? (
          <div>No data available</div>
        ) : (
          data.map((item, index) => (
            <div key={index} className={`leader-item ${index === 0 ? 'leader-highlight' : ''}`}>
              <div className="leader-info">
                <img src={item.image || 'https://via.placeholder.com/30'} alt={item[nameField]} className="leader-image" />
                <div className="leader-name">
                  {item[nameField]} {/* Dynamisch gesetztes Feld für den Namen */}
                </div>
              </div>
              <div className="leader-stats">
                <div className="games">{item[gamesField]}</div> {/* Dynamisch gesetztes Feld für die Spiele */}
                <div className="average">{item[statField]}</div> {/* Dynamisch gesetztes Feld für die Stat-Felder */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StatsTable;
