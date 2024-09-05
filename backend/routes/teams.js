const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teamsController');

// Route zur Abfrage von Teamdaten
router.get('/', async (req, res, next) => {
  try {
    await teamsController.getTeamsData(req, res);
  } catch (error) {
    next(error); // Weiterleitung an die globale Fehlerbehandlung
  }
});

module.exports = router;
