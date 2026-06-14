const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');

router.get('/', controller.getAllCustomers);
router.get('/:id', controller.getCustomerById);
router.post('/', controller.createCustomer);
router.put('/:id', controller.updateCustomer);
router.get('/barcode/:barcode', controller.getCustomerByBarcode);
router.put('/:id/deactivate',controller.deactivateCustomer);
router.put('/:id/activate',controller.activateCustomer);
router.post('/:id/consume-credit', controller.consumeCredit);

module.exports = router;