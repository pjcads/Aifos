const express =
    require('express');

const router =
    express.Router();

const configurationController =
    require('../controllers/configurationController');

router.get(
    '/dropdown-types',
    configurationController.getDropdownTypes
);

router.get(
    '/dropdown-types/:id',
    configurationController.getDropdownType
);

router.post(
    '/dropdown-types',
    configurationController.createDropdownType
);

router.put(
    '/dropdown-types/:id',
    configurationController.updateDropdownType
);

router.put(
    '/dropdown-types/:id/activate',
    configurationController.activateDropdownType
);

router.put(
    '/dropdown-types/:id/deactivate',
    configurationController.deactivateDropdownType
);

router.get(
    '/dropdown-types/:dropdownTypeId/values',
    configurationController.getDropdownValues
);

router.post(
    '/dropdown-values',
    configurationController.createDropdownValue
);

router.get(
    '/dropdown-values/:id',
    configurationController.getDropdownValue
);

router.put(
    '/dropdown-values/:id',
    configurationController.updateDropdownValue
);

router.put(
    '/dropdown-values/:id/activate',
    configurationController.activateDropdownValue
);

router.put(
    '/dropdown-values/:id/deactivate',
    configurationController.deactivateDropdownValue
);

router.get(
    '/business-actions',
    configurationController.getBusinessActions
);

router.get(
    '/business-actions/:id',
    configurationController.getBusinessAction
);

router.post(
    '/business-actions',
    configurationController.createBusinessAction
);

router.put(
    '/business-actions/:id',
    configurationController.updateBusinessAction
);

router.put(
    '/business-actions/:id/activate',
    configurationController.activateBusinessAction
);

router.put(
    '/business-actions/:id/deactivate',
    configurationController.deactivateBusinessAction
);

router.get(
    '/dropdown-values/:dropdownValueId/business-actions',
    configurationController.getDropdownValueBusinessActions
);

router.put(
    '/dropdown-values/:dropdownValueId/business-actions',
    configurationController.saveDropdownValueBusinessActions
);

module.exports =
    router;