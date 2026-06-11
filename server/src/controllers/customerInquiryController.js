const customerInquiryService =
    require('../services/customerInquiryService');

exports.getCustomerInquiry =
    async (req, res) => {

        try {

            const result =
                await customerInquiryService
                    .getCustomerInquiry(
                        req.params.customerId
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

exports.getCustomerInquiryByBarcode =
    async (req, res) => {

        try {

            const result =
                await customerInquiryService
                    .getCustomerInquiryByBarcode(
                        req.params.barcode
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
    
exports.getCustomerTransactions =
    async (req, res) => {

        try {

            const rows =
                await customerInquiryService
                    .getCustomerTransactions(
                        req.params.customerId
                    );

            res.json({
                success: true,
                transactions: rows
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };    

exports.getCustomerCreditTransactions =
    async (req, res) => {

        try {

            const rows =
                await customerInquiryService
                    .getCustomerCreditTransactions(
                        req.params.customerId
                    );

            res.json({
                success: true,
                transactions: rows
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };    

exports.getCustomerWalletTransactions =
    async (req, res) => {

        try {

            const rows =
                await customerInquiryService
                    .getCustomerWalletTransactions(
                        req.params.customerId
                    );

            res.json({
                success: true,
                transactions: rows
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };    