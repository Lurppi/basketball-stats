const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teamsController');

// Route zur Abfrage von Team-Daten
router.get('/', (req, res, next) => {
  teamsController.getTeamsData(req, res)
    .catch((error) => next(error));  // Fehler weiterleiten
});

module.exports = router;
