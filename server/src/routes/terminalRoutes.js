const express = require('express');

const router =
    express.Router();

const controller =
    require('../controllers/terminalController');

const terminalAuth =
    require('../middleware/terminalAuthMiddleware');

router.get(
    '/',
    controller.getTerminals
);

router.post(
    '/heartbeat',
    terminalAuth,
    controller.heartbeat
);

router.get(
    '/:id',
    controller.getTerminal
);

router.post(
    '/',
    controller.createTerminal
);

router.put(
    '/:id',
    controller.updateTerminal
);

module.exports = router;