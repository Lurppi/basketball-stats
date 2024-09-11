// backend/routes/playerDetails.js
const express = require('express');
const router = express.Router();
const playerDetailsController = require('../controllers/playerDetailsController');

router.get('/', (req, res) => {
  playerDetailsController.getPlayerDetailsData(req, res);
});

module.exports = router;
