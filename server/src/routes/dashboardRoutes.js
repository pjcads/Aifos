const express = require('express');

const router = express.Router();

const controller =
    require('../controllers/dashboardController');

router.get(
    '/summary',
    controller.getSummary
);

router.get(
    '/top-products/today',
    controller.getTopProductsToday
);

router.get(
    '/sales-by-payment-method',
    controller.getSalesByPaymentMethod
);

router.get(
    '/top-customers',
    controller.getTopCustomers
);

router.get(
    '/top-credit-users',
    controller.getTopCreditUsers
);

router.get(
    '/top-wallet-users',
    controller.getTopWalletUsers
);

module.exports = router;