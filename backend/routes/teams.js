const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teamsController');

// Route zur Abfrage von Team-Daten
router.get('/', (req, res) => {
  teamsController.getTeamsData(req, res);
});

// Neue Route: Hole die Top 10 Teams basierend auf einem bestimmten Stat-Feld
router.get('/top10/:statField', (req, res) => {
  teamsController.getTopTeamsByStat(req, res);
});

module.exports = router;
