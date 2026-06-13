const negativeInventoryApprovalService =
    require(
        '../services/negativeInventoryApprovalService'
    );

exports.createApproval =
    async (req, res) => {

        try {

            const approvalId =
                await negativeInventoryApprovalService
                    .createApproval(
                        req.body
                    );

            res.status(201).json({
                approvalId
            });

        } catch (err) {

            res.status(400).json({
                error: err.message
            });

        }

    };