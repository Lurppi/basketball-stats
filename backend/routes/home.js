// backend/routes/home.js
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Route für wöchentliche Top 3 Performer
router.get('/weekly/:category', homeController.getWeeklyTop3);

// Route für saisonale (regular) oder Playoff Top 3 Performer
router.get('/:type/:category', homeController.getSeasonOrPlayoffsTop3);

module.exports = router;
