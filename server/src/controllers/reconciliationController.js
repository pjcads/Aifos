const reconciliationService =
    require('../services/reconciliationService');

exports.reconcileApproval =
    async (req, res) => {

        try {

            const result =
                await reconciliationService
                    .reconcileApproval(

                        req.body.approvalId,

                        req.body.quantity,

                        req.body.reconciliationType,

                        req.body.remarks,

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