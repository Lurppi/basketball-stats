// backend/routes/players.js
const express = require('express');
const router = express.Router();
const playersController = require('../controllers/playersController');

// Route zum Abrufen von Spieldaten
router.get('/:type/:category', playersController.getPlayersData);

module.exports = router;
