// backend/routes/teams.js
const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teamsController');

router.get('/', teamsController.getTeamsData);

module.exports = router;
