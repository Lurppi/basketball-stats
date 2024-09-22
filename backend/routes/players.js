const express = require('express');
const router = express.Router();
const playersController = require('../controllers/playersController');

// Route für die PLAYERS.csv
router.get('/', (req, res) => {
  playersController.getPlayersData(req, res);
});

// Route für die Stats der letzten Saison eines Spielers
router.get('/stats/:playerID', (req, res) => {
  playersController.getPlayerSeasonStats(req, res);
});

// Route für die Stats eines Spielers basierend auf PlayerID und Season Type
router.get('/stats/:playerID/season', (req, res) => {
  playersController.getPlayerStatsBySeasonType(req, res);
});

// Route für den Abruf der validierten Saison-Statistiken
router.get('/stats/:playerID/valid', (req, res) => {
  playersController.getValidPlayerStats(req, res);
});

// Neue Route: Spieler-Daten nach Saison filtern
router.get('/season/:seasonYear', (req, res) => {
  playersController.getPlayersBySeason(req, res);
});

module.exports = router;
