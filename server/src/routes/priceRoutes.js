const express =
    require('express');

const router =
    express.Router();

const controller =
    require('../controllers/priceController');

router.get(
    '/:productId',
    controller.getPrices
);

router.post(
    '/',
    controller.createPrice
);

module.exports =
    router;