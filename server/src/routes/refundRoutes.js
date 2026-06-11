const express = require('express');

const router =
    express.Router();

const refundController =
    require('../controllers/refundController');

router.post(
    '/:transactionId',
    refundController.refundTransaction
);

module.exports = router;