// backend/routes/teams.js
const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teamsController');

// Route zum Abrufen der Teams-Daten
router.get('/:type/:category', teamsController.getTeamsData);

module.exports = router;
