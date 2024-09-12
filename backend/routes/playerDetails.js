const express = require('express');
const router = express.Router();
const playerDetailsController = require('../controllers/playerDetailsController');

// Neue Route für die letzten 10 Spiele eines Spielers
router.get('/last10games/:playerID', (req, res) => {
  playerDetailsController.getLast10Games(req, res);
});

// Neue Route für die 5 Stats der letzten Saison
router.get('/stats/:playerID', (req, res) => {
  playerDetailsController.getLastSeasonStats(req, res);
});

module.exports = router;
