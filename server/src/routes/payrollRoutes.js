const express = require('express');
const router = express.Router();

const controller =
    require('../controllers/payrollController');

router.post(
    '/generate',
    controller.generateBatch
);

router.post(
    '/:id/endorse',
    controller.endorseBatch
);

module.exports = router;