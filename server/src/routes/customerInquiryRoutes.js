const express = require('express');

const router = express.Router();

const controller =
    require('../controllers/customerInquiryController');

router.get(
    '/barcode/:barcode',
    controller.getCustomerInquiryByBarcode
);

router.get(
    '/:customerId/inquiry',
    controller.getCustomerInquiry
);

router.get(
    '/:customerId/transactions',
    controller.getCustomerTransactions
);

router.get(
    '/:customerId/credit-transactions',
    controller.getCustomerCreditTransactions
);

router.get(
    '/:customerId/wallet-transactions',
    controller.getCustomerWalletTransactions
);

module.exports = router;