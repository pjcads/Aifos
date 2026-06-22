const priceService =
    require('../services/priceService');

exports.getPrices =
    async (req, res) => {

        try {

            const rows =
                await priceService
                    .getPrices(
                        req.params.productId
                    );

            res.json({
                success: true,
                prices: rows
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };

exports.createPrice =
    async (req, res) => {

        try {

            const result =
                await priceService
                    .createPrice({

                        productId:
                            req.body.productId,

                        priceType:
                            req.body.priceType,

                        price:
                            req.body.price,

                        effectiveFrom:
                            req.body.effectiveFrom,

                        effectiveTo:
                            req.body.effectiveTo,

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
                error: err.message
            });

        }

    };