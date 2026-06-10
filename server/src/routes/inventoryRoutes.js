const express = require('express');
const router = express.Router();

const controller = require('../controllers/inventoryController');

router.get('/balances', controller.getBalances);

router.get('/movements', controller.getMovements);

router.post('/receipt', controller.createReceipt);

router.post('/adjustment', controller.createAdjustment);

module.exports = router;