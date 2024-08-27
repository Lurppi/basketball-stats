import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the NBBL Stats Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link to="/players">Players Stats</Link>
          </li>
          <li>
            <Link to="/teams">Teams Stats</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
