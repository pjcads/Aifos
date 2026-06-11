const express = require('express');

const router =
    express.Router();

const reconciliationController =
    require('../controllers/reconciliationController');

router.post(
    '/',
    reconciliationController.reconcileApproval
);

module.exports = router;