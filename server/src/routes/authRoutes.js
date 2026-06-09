// server/src/routes/authRoutes.js
const express = require('express');
const router = express.Router(); // We use the standard name 'router'
const authController = require('../controllers/authController');

// All routes must use the 'router' variable defined above
router.post('/login', authController.login);

module.exports = router;
