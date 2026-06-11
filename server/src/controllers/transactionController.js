const transactionService =
    require('../services/transactionService');

exports.getTransaction =
    async (req, res) => {

        try {

            const result =
                await transactionService
                    .getTransactionById(
                        req.params.transactionId
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

exports.getTransactionByNumber =
    async (req, res) => {

        try {

            const result =
                await transactionService
                    .getTransactionByNumber(
                        req.params.transactionNo
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

exports.getSessionTransactions =
    async (req, res) => {

        try {

            const rows =
                await transactionService
                    .getTransactionsBySession(
                        req.params.sessionId
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