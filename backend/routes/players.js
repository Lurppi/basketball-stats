// backend/routes/players.js
const express = require('express');
const router = express.Router();
const playersController = require('../controllers/playersController');

router.get('/', playersController.getPlayersData);

module.exports = router;
