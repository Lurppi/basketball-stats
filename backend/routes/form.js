// backend/routes/form.js
const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

router.get('/', (req, res) => {
  formController.getFormData(req, res);
});

module.exports = router;
