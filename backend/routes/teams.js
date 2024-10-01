const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teamsController');

// Route zur Abfrage von Team-Daten
router.get('/', (req, res) => {
  teamsController.getTeamsData(req, res);
});

// Neue Route: Hole die Daten für alle Teams der aktuellen Saison
router.get('/rankings', (req, res) => {
  teamsController.getAllTeamsByStat(req, res);
});

module.exports = router;
