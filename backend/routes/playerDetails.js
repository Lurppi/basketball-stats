const express = require('express');
const router = express.Router();
const playerDetailsController = require('../controllers/playerDetailsController');

// Route für die letzten 10 Spiele eines Spielers
router.get('/last10games/:playerID', (req, res) => {
  playerDetailsController.getLast10Games(req, res);
});

// Neue Route für die Stats der letzten Saison eines Spielers
router.get('/stats/:playerID', (req, res) => {
  playerDetailsController.getPlayerSeasonStats(req, res);
});

module.exports = router;
