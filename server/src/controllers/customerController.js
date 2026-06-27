const customerService = require('../services/customerService');
const creditService = require('../services/creditService');

const queryHelper =
    require('../utils/queryHelper');

const responseHelper =
    require('../utils/responseHelper');

const sortableColumns =
{
    customer_code:
        'customer_code',

    barcode:
        'barcode',

    name:
        'name',

    userid:
        'userid',

    department:
        'department',

    available_credit:
        'available_credit',

    status:
        'status'
};

const searchableColumns =
[
    'customer_code',
    'barcode',
    'name',
    'userid',
    'department'
];

exports.getAllCustomers =
    async (req, res) => {

        const query =
            queryHelper.build(
                req,
                sortableColumns
            );

        try {

            const result =
                await customerService
                    .getCustomers(
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

exports.getCustomerById =
    async (req, res) => {

        try {

            const customer =
                await customerService
                    .getCustomer(
                        req.params.id
                    );

            return responseHelper
                .success(
                    res,
                    {
                        customer
                    }
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err,
                    400
                );

        }

    };

exports.createCustomer =
    async (req, res) => {

        try {

            const result =
                await customerService
                    .createCustomer(
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
                    err,
                    400
                );

        }

    };

exports.updateCustomer =
    async (req, res) => {

        try {

            const result =
                await customerService
                    .updateCustomer(
                        req.params.id,
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
                    err,
                    400
                );

        }

    };

exports.getCustomerByBarcode =
    async (req, res) => {

        try {

            const customer =
                await customerService
                    .getCustomerByBarcode(
                        req.params.barcode
                    );

            return responseHelper
                .success(
                    res,
                    {
                        customer
                    }
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err,
                    400
                );

        }

    };

exports.deactivateCustomer =
    async (req, res) => {

        try {

            const result =
                await customerService
                    .deactivateCustomer(
                        req.params.id
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
                    err,
                    400
                );

        }

    };

exports.activateCustomer =
    async (req, res) => {

        try {

            const result =
                await customerService
                    .activateCustomer(
                        req.params.id
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
                    err,
                    400
                );

        }

    };

exports.consumeCredit =
    async (req, res) => {

        try {

            const {
                amount,
                remarks
            } = req.body;

            const transactionId =
                await creditService
                    .consumeCredit(
                        req.params.id,
                        amount,
                        null,
                        remarks,
                        req.user.id
                    );

            return responseHelper
                .success(
                    res,
                    {
                        transactionId
                    }
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err,
                    400
                );

        }

    };