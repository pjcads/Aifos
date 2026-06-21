const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.get('/', controller.getAllUsers);
router.get('/:id', controller.getUserById);
router.post('/', controller.createUser);
router.post(
    '/:id/reset-password',
    controller.resetPassword
);
router.put('/:id', controller.updateUser);

module.exports = router;