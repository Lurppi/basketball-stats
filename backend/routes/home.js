// backend/routes/home.js
const express = require('express');
const router = express.Router();

// Beispielroute für zukünftige Implementierungen
router.get('/', (req, res) => {
  res.send('Welcome to the home route');
});

module.exports = router;
