const goodsReceiptService =
    require('../services/goodsReceiptService');

exports.createReceipt =
    async (req, res) => {

        try {

            const result =
                await goodsReceiptService
                    .createReceipt({

                        supplierName:
                            req.body.supplierName,

                        receiptDate:
                            req.body.receiptDate,

                        remarks:
                            req.body.remarks,

                        receivedBy:
                            req.user.id,

                        items:
                            req.body.items

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