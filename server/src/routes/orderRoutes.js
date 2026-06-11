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

module.exports = router;