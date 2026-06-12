const express = require('express');

const router = express.Router();

const controller = require('../controllers/syncController');

router.get(
    '/master-data',
    controller.getMasterData
);

router.post(
    '/upload-sale',
    controller.uploadSale
);

router.post(
    '/upload-transactions',
    controller.uploadTransactions
);

module.exports = router;