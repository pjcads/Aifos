const express = require('express');

const router = express.Router();

const controller =
    require('../controllers/transactionController');

router.get(
    '/id/:transactionId',
    controller.getTransaction
);

router.get(
    '/number/:transactionNo',
    controller.getTransactionByNumber
);

router.get(
    '/session/:sessionId',
    controller.getSessionTransactions
);

module.exports = router;