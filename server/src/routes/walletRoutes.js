const express = require('express');

const router =
    express.Router();

const walletController =
    require('../controllers/walletController');

router.post(
    '/',
    walletController.createWallet
);

router.post(
    '/topup',
    walletController.topupWallet
);

router.get(
    '/barcode/:barcode',
    walletController.getWalletByBarcode
);

router.post(
    '/:walletId/barcodes',
    walletController.addBarcode
);

module.exports = router;