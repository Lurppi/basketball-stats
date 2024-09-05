const express = require('express');
const router = express.Router();
const playersController = require('../controllers/playersController');

// Route zur Abfrage von Spieldaten
router.get('/', async (req, res, next) => {
  try {
    await playersController.getPlayersData(req, res);
  } catch (error) {
    next(error); // Weiterleitung an die globale Fehlerbehandlung
  }
});

module.exports = router;
