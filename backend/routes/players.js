const express = require('express');
const router = express.Router();
const playersController = require('../controllers/playersController');

// Route zur Abfrage von Spieler-Daten
router.get('/', (req, res) => {
  playersController.getPlayersData(req, res);
});

module.exports = router;
