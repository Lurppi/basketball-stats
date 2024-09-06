const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teamsController');

// Route zur Abfrage von Team-Daten
router.get('/', (req, res) => {
  teamsController.getTeamsData(req, res);
});

module.exports = router;
