const reportService = require('../services/reportService');
const exportService = require('../services/exportService');

exports.getProductSalesReport =
    async (req, res) => {

        try {

            const rows =
                await reportService
                    .getProductSalesReport({

                        fromDate:
                            req.query.fromDate,

                        toDate:
                            req.query.toDate

                    });

            res.json({
                success: true,
                products: rows
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error:
                    err.message
            });

        }

    };

exports.getSalesSummaryReport =
    async (req, res) => {

        try {

            const rows =
                await reportService
                    .getSalesSummaryReport({

                        fromDate:
                            req.query.fromDate,

                        toDate:
                            req.query.toDate

                    });

            res.json({
                success: true,
                sales: rows
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error:
                    err.message
            });

        }

    };

exports.getInventoryMovementReport =
    async (req, res) => {

        try {

            const rows =
                await reportService
                    .getInventoryMovementReport({

                        fromDate:
                            req.query.fromDate,

                        toDate:
                            req.query.toDate

                    });

            res.json({
                success: true,
                inventory: rows
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error:
                    err.message
            });

        }

    };


exports.getInventoryValuationReport =
    async (req, res) => {

        try {

            const rows =
                await reportService
                    .getInventoryValuationReport();

            res.json({
                success: true,
                inventory: rows
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error:
                    err.message
            });

        }

    };

exports.getPaymentMethodReport =
    async (req, res) => {

        try {

            const rows =
                await reportService
                    .getPaymentMethodReport({

                        fromDate:
                            req.query.fromDate,

                        toDate:
                            req.query.toDate

                    });

            res.json({
                success: true,
                payments: rows
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error:
                    err.message
            });

        }

    };

exports.getOrderPerformanceReport =
    async (req, res) => {

        try {

            const rows =
                await reportService
                    .getOrderPerformanceReport({

                        fromDate:
                            req.query.fromDate,

                        toDate:
                            req.query.toDate

                    });

            res.json({
                success: true,
                orders: rows
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error:
                    err.message
            });

        }

    };

exports.exportProductSalesReport =
    async (req, res) => {

        try {

            const rows =
                await reportService
                    .getProductSalesReport({

                        fromDate:
                            req.query.fromDate,

                        toDate:
                            req.query.toDate

                    });

            const csv =
                exportService
                    .convertToCsv(
                        rows
                    );

            res.setHeader(
                'Content-Type',
                'text/csv'
            );

            res.setHeader(
                'Content-Disposition',
                'attachment; filename=product-sales-report.csv'
            );

            res.send(
                csv
            );

        } catch (err) {

            res.status(400).json({
                success: false,
                error:
                    err.message
            });

        }

    };    