import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './Glossary.css';

const Glossary = () => {
  return (
    <div className="glossary-container">
      <Header />
      
      <main>
        <h1>Glossary</h1>
        <table className="glossary-table">
          <thead>
            <tr>
              <th>Abbreviation</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>#</td><td>Rank</td></tr>
            <tr><td>DIV</td><td>Division</td></tr>
            <tr><td>POS</td><td>Position</td></tr>
            <tr><td>BORN</td><td>Year of Birth</td></tr>
            <tr><td>GP</td><td>Games Played</td></tr>
            <tr><td>MP</td><td>Minutes Played</td></tr>
            <tr><td>PT</td><td>Points</td></tr>
            <tr><td>RB</td><td>Rebounds</td></tr>
            <tr><td>AS</td><td>Assists</td></tr>
            <tr><td>ST</td><td>Steals</td></tr>
            <tr><td>BS</td><td>Blocked Shots</td></tr>
            <tr><td>TO</td><td>Turnovers</td></tr>
            <tr><td>PF</td><td>Personal Fouls</td></tr>
            <tr><td>EF</td><td>Efficiency</td></tr>
            <tr><td>EF/Gm</td><td>Efficiency per Game</td></tr>
            <tr><td>DD</td><td>Double Double</td></tr>
            <tr><td>TD</td><td>Triple Double</td></tr>
            <tr><td>2PM</td><td>2-Pointer Made</td></tr>
            <tr><td>2PA</td><td>2-Point Attempts</td></tr>
            <tr><td>2P%</td><td>2-Point Percentage</td></tr>
            <tr><td>3PM</td><td>3-Pointer Made</td></tr>
            <tr><td>3PA</td><td>3-Point Attempts</td></tr>
            <tr><td>3P%</td><td>3-Point Percentage</td></tr>
            <tr><td>FGM</td><td>Field Goals Made</td></tr>
            <tr><td>FGA</td><td>Field Goal Attempts</td></tr>
            <tr><td>FG%</td><td>Field Goal Percentage</td></tr>
            <tr><td>FTM</td><td>Free Throws Made</td></tr>
            <tr><td>FTA</td><td>Free Throw Attempts</td></tr>
            <tr><td>FT%</td><td>Free Throw Percentage</td></tr>
            <tr><td>ORTG</td><td>Offensive Rating</td></tr>
            <tr><td>DRTG</td><td>Defensive Rating</td></tr>
            <tr><td>NRTG</td><td>Net Rating</td></tr>
            <tr><td>OBPM</td><td>Offensive Boxscore Plus/Minus</td></tr>
            <tr><td>DBPM</td><td>Defensive Boxscore Plus/Minus</td></tr>
            <tr><td>BPM</td><td>Boxscore Plus/Minus</td></tr>
            <tr><td>VORP</td><td>Value over Replacement Player</td></tr>
            <tr><td>OWS</td><td>Offensive Win Shares</td></tr>
            <tr><td>DWS</td><td>Defensive Win Shares</td></tr>
            <tr><td>WS</td><td>Win Shares</td></tr>
            <tr><td>WS/40</td><td>Win Shares per 40 Minutes</td></tr>
            <tr><td>PER</td><td>Player Efficiency Rating</td></tr>
            <tr><td>FIC</td><td>Floor Impact Counter</td></tr>
            <tr><td>FIC/Gm</td><td>Floor Impact Counter per Game</td></tr>
            <tr><td>PIE</td><td>Player Impact Estimate</td></tr>
            <tr><td>AS Ratio</td><td>Assist Ratio (Assists per 100 Possessions)</td></tr>
            <tr><td>AS Rate</td><td>Assist Rate (High Value = High Passing Tendency)</td></tr>
            <tr><td>AS/TO</td><td>Assist to Turnover Ratio</td></tr>
            <tr><td>REB%</td><td>Rebound Percentage</td></tr>
            <tr><td>ST%</td><td>Steal Percentage</td></tr>
            <tr><td>BS%</td><td>Block Percentage</td></tr>
            <tr><td>USAGE</td><td>Usage Rate</td></tr>
            <tr><td>TS%</td><td>True Shooting Percentage</td></tr>
            <tr><td>EFG%</td><td>Effective Field Goal Percentage</td></tr>
            <tr><td>TOV%</td><td>Turnover Percentage</td></tr>
            <tr><td>ORB%</td><td>Offensive Rebound Percentage</td></tr>
            <tr><td>FT-RATE</td><td>Free Throw Rate</td></tr>
            <tr><td>OPP EFG%</td><td>Opponent Effective Field Goal Percentage</td></tr>
            <tr><td>OPP TOV%</td><td>Opponent Turnover Percentage</td></tr>
            <tr><td>OPP ORB%</td><td>Opponent Offensive Rebound Percentage</td></tr>
            <tr><td>OPP FT-RATE</td><td>Opponent Free Throw Rate</td></tr>
            <tr><td>PPP</td><td>Points per Possession</td></tr>
            <tr><td>PACE</td><td>Team Pace (Possessions per Game)</td></tr>
            <tr><td>DRPG</td><td>Defensive Rebounds per Game</td></tr>
            <tr><td>ORPG</td><td>Offensive Rebounds per Game</td></tr>
          </tbody>
        </table>
      </main>

      <Footer />
    </div>
  );
};

export default Glossary;
