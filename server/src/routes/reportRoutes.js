const express = require('express');

const router =
    express.Router();

const controller =
    require('../controllers/reportController');

router.get(
    '/products/export',
    controller.exportProductSalesReport
);
    
router.get(
    '/products',
    controller.getProductSalesReport
);

router.get(
    '/sales',
    controller.getSalesSummaryReport
);

router.get(
    '/inventory/movement',
    controller.getInventoryMovementReport
);

router.get(
    '/inventory/valuation',
    controller.getInventoryValuationReport
);

router.get(
    '/payments',
    controller.getPaymentMethodReport
);

router.get(
    '/orders/performance',
    controller.getOrderPerformanceReport
);

module.exports = router;