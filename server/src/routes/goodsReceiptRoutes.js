const express = require('express');

const router =
    express.Router();

const goodsReceiptController =
    require('../controllers/goodsReceiptController');

router.post(
    '/',
    goodsReceiptController.createReceipt
);

module.exports = router;