const express =
    require('express');

const router =
    express.Router();

const controller =
    require('../controllers/reportController');

router.get(
    '/',
    controller.getReports
);

router.post(
    '/run',
    controller.runReport
);

module.exports =
    router;