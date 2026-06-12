const orderService = require('../services/orderService');

exports.createOrder =
    async (req, res) => {

        try {

            const result =
                await orderService
                    .createOrder({
                        ...req.body,
                        createdBy:
                            req.user.id
                    });

            res.json({
                success: true,
                ...result
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error:
                    err.message
            });

        }

    };

exports.getOrder =
    async (req, res) => {

        try {

            const result =
                await orderService
                    .getOrder(
                        req.params.orderId
                    );

            res.json({
                success: true,
                ...result
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error:
                    err.message
            });

        }

    };    

exports.getOrders =
    async (req, res) => {

        try {

            const rows =
                await orderService
                    .getOrders();

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

exports.updateStatus =
    async (req, res) => {

        try {

            const result =
                await orderService
                    .updateStatus(
                        req.params.orderId,
                        req.body.status
                    );

            res.json({
                success: true,
                ...result
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error:
                    err.message
            });

        }

    };    

exports.releaseOrder =
    async (req, res) => {

        try {

            const result =
                await orderService
                    .releaseOrder({

                        orderId:
                            req.params.orderId,

                        terminalId:
                            req.body.terminalId,

                        walletBarcode:
                            req.body.walletBarcode,

                        negativeInventoryApprovalId:
                            req.body.negativeInventoryApprovalId,

                        amountTendered:
                            req.body.amountTendered,

                        releasedBy:
                            req.user.id

                    });

            res.json({
                success: true,
                ...result
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error:
                    err.message
            });

        }

    };
    
exports.cancelOrder =
    async (req, res) => {

        try {

            const result =
                await orderService
                    .cancelOrder(
                        req.params.orderId
                    );

            res.json({
                success: true,
                ...result
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error:
                    err.message
            });

        }

    };    

exports.getOrdersByStatus =
    async (req, res) => {

        try {

            const rows =
                await orderService
                    .getOrdersByStatus(
                        req.params.status
                    );

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
    
exports.createOrderByBarcode =
    async (req, res) => {

        try {

            const result =
                await orderService
                    .createOrderByBarcode({

                        barcode:
                            req.body.barcode,

                        paymentMethod:
                            req.body.paymentMethod,

                        items:
                            req.body.items,

                        remarks:
                            req.body.remarks,

                        createdBy:
                            req.user.id

                    });

            res.json({
                success: true,
                ...result
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error:
                    err.message
            });

        }

    };    