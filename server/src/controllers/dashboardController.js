const dashboardService =
    require('../services/dashboardService');

exports.getSummary =
    async (req, res) => {

        try {

            const summary =
                await dashboardService
                    .getSummary();

            res.json({
                success: true,
                summary
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error:
                    err.message
            });

        }

    };

exports.getTopProductsToday =
    async (req, res) => {

        try {

            const rows =
                await dashboardService
                    .getTopProductsToday();

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
    
exports.getSalesByPaymentMethod =
    async (req, res) => {

        try {

            const rows =
                await dashboardService
                    .getSalesByPaymentMethod();

            res.json({
                success: true,
                payments: rows
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };  
    
exports.getTopCustomers =
    async (req, res) => {

        try {

            const rows =
                await dashboardService
                    .getTopCustomers();

            res.json({
                success: true,
                customers: rows
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };
    
exports.getTopCreditUsers =
    async (req, res) => {

        try {

            const rows =
                await dashboardService
                    .getTopCreditUsers();

            res.json({
                success: true,
                customers: rows
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };
    
exports.getTopWalletUsers =
    async (req, res) => {

        try {

            const rows =
                await dashboardService
                    .getTopWalletUsers();

            res.json({
                success: true,
                wallets: rows
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };    