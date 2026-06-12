const express = require('express');

const router = express.Router();

const controller =
    require('../controllers/orderController');

router.post(
    '/',
    controller.createOrder
);

router.get(
    '/',
    controller.getOrders
);

router.get(
    '/status/:status',
    controller.getOrdersByStatus
);

router.get(
    '/:orderId',
    controller.getOrder
);

router.patch(
    '/:orderId/status',
    controller.updateStatus
);

router.post(
    '/:orderId/release',
    controller.releaseOrder
);

router.post(
    '/:orderId/cancel',
    controller.cancelOrder
);

router.post(
    '/barcode',
    controller.createOrderByBarcode
);

module.exports = router;