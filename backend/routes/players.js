const express = require('express');
const router = express.Router();
const playersController = require('../controllers/playersController');

// Route zur Abfrage von Spieler-Daten
router.get('/', (req, res, next) => {
  playersController.getPlayersData(req, res)
    .catch((error) => next(error)); // Fehler an globale Fehlerbehandlung weiterleiten
});

module.exports = router;
