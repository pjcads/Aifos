const configurationService =
    require('../services/configurationService');

const responseHelper =
    require('../utils/responseHelper');

const queryHelper =
    require('../utils/queryHelper');

const sortableColumns =
{
    code: 'code',
    name: 'name',
    domain: 'domain',
    is_system: 'is_system',
    is_active: 'is_active'
};

const searchableColumns =
[
    'code',
    'name',
    'description',
    'domain'
];  

const dropdownValueSortableColumns =
{
    code: 'code',
    name: 'name',
    description: 'description',
    sort_order: 'sort_order',
    is_default: 'is_default',
    is_system: 'is_system',
    is_active: 'is_active'
};

const dropdownValueSearchableColumns =
[
    'code',
    'name',
    'description'
];

exports.getDropdownTypes =
    async (req, res) => {

        const query =
            queryHelper.build(
                req,
                sortableColumns
            );

        try {

            const result =
                await configurationService
                    .getDropdownTypes(
                        query,
                        searchableColumns
                    );

            return responseHelper
                .successPaged(
                    res,
                    result
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.getDropdownType =
    async (req, res) => {

        try {

            const dropdownType =
                await configurationService
                    .getDropdownType(
                        req.params.id
                    );

            return responseHelper
                .success(
                    res,
                    {
                        dropdownType
                    }
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.createDropdownType =
    async (req, res) => {

        try {

            const result =
                await configurationService
                    .createDropdownType(
                        req.body
                    );

            return responseHelper
                .success(
                    res,
                    result
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.updateDropdownType =
    async (req, res) => {

        try {

            await configurationService
                .updateDropdownType(
                    req.params.id,
                    req.body
                );

            return responseHelper
                .success(
                    res
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.activateDropdownType =
    async (req, res) => {

        try {

            await configurationService
                .activateDropdownType(
                    req.params.id
                );

            return responseHelper
                .success(
                    res
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.deactivateDropdownType =
    async (req, res) => {

        try {

            await configurationService
                .deactivateDropdownType(
                    req.params.id
                );

            return responseHelper
                .success(
                    res
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.getDropdownValues =
    async (req, res) => {

        const query =
            queryHelper.build(
                req,
                dropdownValueSortableColumns
            );

        try {

            const result =
                await configurationService
                    .getDropdownValues(
                        req.params.dropdownTypeId,
                        query,
                        dropdownValueSearchableColumns
                    );

            return responseHelper
                .successPaged(
                    res,
                    result
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };
    
exports.createDropdownValue =
    async (req, res) => {

        try {

            const result =
                await configurationService
                    .createDropdownValue(
                        req.body
                    );

            return responseHelper
                .success(
                    res,
                    result
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.getDropdownValue =
    async (req, res) => {

        try {

            const dropdownValue =
                await configurationService
                    .getDropdownValue(
                        req.params.id
                    );

            return responseHelper
                .success(
                    res,
                    {
                        dropdownValue
                    }
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };
    
exports.updateDropdownValue =
    async (req, res) => {

        try {

            await configurationService
                .updateDropdownValue(
                    req.params.id,
                    req.body
                );

            return responseHelper
                .success(
                    res
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.activateDropdownValue =
    async (req, res) => {

        try {

            await configurationService
                .activateDropdownValue(
                    req.params.id
                );

            return responseHelper
                .success(
                    res
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.deactivateDropdownValue =
    async (req, res) => {

        try {

            await configurationService
                .deactivateDropdownValue(
                    req.params.id
                );

            return responseHelper
                .success(
                    res
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.setDefaultDropdownValue =
    async (req, res) => {

        try {

            await configurationService
                .setDefaultDropdownValue(
                    req.params.id
                );

            return responseHelper
                .success(
                    res
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };  
    
exports.moveUpDropdownValue =
    async (req, res) => {

        try {

            await configurationService
                .moveUpDropdownValue(
                    req.params.id
                );

            return responseHelper
                .success(
                    res
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.moveDownDropdownValue =
    async (req, res) => {

        try {

            await configurationService
                .moveDownDropdownValue(
                    req.params.id
                );

            return responseHelper
                .success(
                    res
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };    

exports.getBusinessActions =
    async (req, res) => {

        const query =
            queryHelper.build(
                req,
                sortableColumns
            );

        try {

            const result =
                await configurationService
                    .getBusinessActions(
                        query,
                        searchableColumns
                    );

            return responseHelper
                .successPaged(
                    res,
                    result
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.getBusinessAction =
    async (req, res) => {

        try {

            const businessAction =
                await configurationService
                    .getBusinessAction(
                        req.params.id
                    );

            return responseHelper
                .success(
                    res,
                    {
                        businessAction
                    }
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.createBusinessAction =
    async (req, res) => {

        try {

            const result =
                await configurationService
                    .createBusinessAction(
                        req.body
                    );

            return responseHelper
                .success(
                    res,
                    result
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.updateBusinessAction =
    async (req, res) => {

        try {

            await configurationService
                .updateBusinessAction(
                    req.params.id,
                    req.body
                );

            return responseHelper
                .success(
                    res
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.activateBusinessAction =
    async (req, res) => {

        try {

            await configurationService
                .activateBusinessAction(
                    req.params.id
                );

            return responseHelper
                .success(
                    res
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.deactivateBusinessAction =
    async (req, res) => {

        try {

            await configurationService
                .deactivateBusinessAction(
                    req.params.id
                );

            return responseHelper
                .success(
                    res
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.getDropdownValueBusinessActions =
    async (req, res) => {

        try {

            const rows =
                await configurationService
                    .getDropdownValueBusinessActions(
                        req.params.dropdownValueId
                    );

            return responseHelper
                .success(
                    res,
                    {
                        rows
                    }
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };

exports.saveDropdownValueBusinessActions =
    async (req, res) => {

        try {

            await configurationService
                .saveDropdownValueBusinessActions(
                    req.params.dropdownValueId,
                    req.body.businessActionIds
                );

            return responseHelper
                .success(
                    res
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err
                );

        }

    };