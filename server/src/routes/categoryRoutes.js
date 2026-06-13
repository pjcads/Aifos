const express = require('express');

const router =
    express.Router();

const controller =
    require('../controllers/categoryController');

router.get(
    '/',
    controller.getCategories
);

router.get(
    '/:id',
    controller.getCategory
);

router.post(
    '/',
    controller.createCategory
);

router.put(
    '/:id',
    controller.updateCategory
);

module.exports = router;