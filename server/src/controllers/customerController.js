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

            res.json({
                success: true,
                customer
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

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

            res.json({
                success: true,
                ...result
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

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

            res.json({
                success: true,
                ...result
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

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

            res.json({
                success: true,
                customer
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

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

            res.json({
                success: true,
                ...result
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

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

            res.json({
                success: true,
                ...result
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };    

exports.consumeCredit = async (req, res) => {

    try {

        const { amount, remarks } = req.body;

        const transactionId =
            await creditService.consumeCredit(
                req.params.id,
                amount,
                null,
                remarks,
                req.user.id
            );

        res.json({
            success: true,
            transactionId
        });

    } catch (err) {

        res.status(400).json({
            error: err.message
        });

    }
};