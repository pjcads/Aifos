const checkoutService = require('../services/checkoutService');

exports.createSale = async (req, res) => {

    try {

        const result =
            await checkoutService.createSale({

                customerId:
                    req.body.customerId,

                items:
                    req.body.items,

                cashierId:
                    req.user.id,

                terminalId:
                    req.body.terminalId,

                negativeInventoryApprovalId:
                    req.body.negativeInventoryApprovalId

            });

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