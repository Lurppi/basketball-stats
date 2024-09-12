const express = require('express');
const router = express.Router();
const playerDetailsController = require('../controllers/playerDetailsController');

// Route für die letzten 10 Spiele eines Spielers
router.get('/last10games/:playerID', (req, res) => {
  playerDetailsController.getLast10Games(req, res);
});

module.exports = router;
