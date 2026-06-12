const syncService = require('../services/syncService');

exports.getMasterData =
    async (req, res) => {

        try {

            const data =
                await syncService
                    .getMasterData();

            res.json({
                success: true,
                ...data
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error:
                    err.message
            });

        }

    };

exports.uploadSale =
    async (req, res) => {

        try {

            const result =
                await syncService
                    .uploadSale(
                        req.body
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

exports.uploadTransactions =
    async (req, res) => {

        try {

            const result =
                await syncService
                    .uploadTransactions(
                        req.body
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