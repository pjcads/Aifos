const express = require('express');

const router =
    express.Router();

const controller =
    require('../controllers/terminalController');

router.get(
    '/',
    controller.getTerminals
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