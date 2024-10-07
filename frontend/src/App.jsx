import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './assets/Header';
import './assets/Header.css';

// Lazy load der Komponenten
const Home = lazy(() => import('./assets/Home'));
const Players = lazy(() => import('./assets/Players'));
const Teams = lazy(() => import('./assets/Teams'));
const Form = lazy(() => import('./assets/Form'));
const Impressum = lazy(() => import('./assets/Impressum'));
const Glossary = lazy(() => import('./assets/Glossary'));
const Policy = lazy(() => import('./assets/Policy'));
const Rankings = lazy(() => import('./assets/Rankings'));
const PlayerPage = lazy(() => import('./assets/PlayerPage'));

function App() {
  return (
    <Router>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/players" element={<Players />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/form" element={<Form />} />
          <Route path="/standings" element={<Rankings />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/privacy-policy" element={<Policy />} />
          <Route path="/player/:id" element={<PlayerPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;