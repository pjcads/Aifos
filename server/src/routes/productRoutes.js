const express = require('express');

const router =
    express.Router();

const controller =
    require('../controllers/productController');

const uploadProductImage =
    require('../middleware/uploadProductImage');    

router.get(
    '/',
    controller.getProducts
);

router.get(
    '/:id',
    controller.getProduct
);

router.post(
    '/',
    controller.createProduct
);

router.put(
    '/:id',
    controller.updateProduct
);

router.post(
    '/:id/image',
    uploadProductImage.single(
        'image'
    ),
    controller.uploadProductImage
);

module.exports = router;