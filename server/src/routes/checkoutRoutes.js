const express = require('express');

const router = express.Router();

const checkoutController =
    require('../controllers/checkoutController');

router.post(
    '/sale',
    checkoutController.createSale
);

module.exports = router;