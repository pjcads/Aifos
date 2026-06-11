const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');

router.get('/', controller.getAllCustomers);
router.get('/:id', controller.getCustomerById);
router.post('/', controller.createCustomer);
router.put('/:id', controller.updateCustomer);
router.delete('/:id', controller.deleteCustomer);
router.get('/barcode/:barcode', controller.getCustomerByBarcode);
router.post('/:id/consume-credit', controller.consumeCredit);

module.exports = router;