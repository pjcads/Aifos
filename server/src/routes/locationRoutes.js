const express =
    require('express');

const router =
    express.Router();

const controller =
    require('../controllers/locationController');

router.get(
    '/',
    controller.getAllLocations
);

router.get(
    '/:id',
    controller.getLocationById
);

module.exports =
    router;