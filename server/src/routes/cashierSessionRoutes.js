const express = require('express');

const router = express.Router();

const controller =
    require('../controllers/cashierSessionController');

router.post(
    '/open',
    controller.openSession
);

router.post(
    '/:sessionId/close',
    controller.closeSession
);

router.get(
    '/active/:terminalId',
    controller.getActiveSession
);

router.get(
    '/:sessionId/report',
    controller.getSessionReport
);

router.get(
    '/:sessionId/summary',
    controller.getSessionSummary
);

module.exports = router;