const express = require('express');

const router =
    express.Router();

const controller =
    require(
        '../controllers/negativeInventoryApprovalController'
    );

router.post(
    '/',
    controller.createApproval
);

module.exports = router;