// routes/sitemap.js
const express = require('express');
const router = express.Router();
const playersController = require('../controllers/playersController');

// Route für die Sitemap
router.get('/sitemap.xml', playersController.generateSitemap);

module.exports = router;
