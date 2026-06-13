const refundService =
    require('../services/refundService');

exports.refundTransaction =
    async (req, res) => {

        try {

            if (!req.params.transactionId) {

                return res.status(400).json({
                    success: false,
                    error: 'Transaction ID is required'
                });

            }            

            const result =
                await refundService
                    .refundTransaction(
                        req.params.transactionId,
                        req.body.refundReason,
                        req.user.id
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