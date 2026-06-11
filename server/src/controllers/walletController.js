const walletService =
    require('../services/walletService');

exports.createWallet =
    async (req, res) => {

        try {

            const result =
                await walletService
                    .createWallet({

                        customerId:
                            req.body.customerId,

                        accountName:
                            req.body.accountName,

                        accountType:
                            req.body.accountType,

                        barcode:
                            req.body.barcode,

                        barcodeType:
                            req.body.barcodeType

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

exports.topupWallet =
    async (req, res) => {

        try {

            await walletService
                .topupWallet(

                    req.body.barcode,

                    req.body.amount,

                    req.body.remarks,

                    req.user.id

                );

            res.json({
                success: true
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };

exports.getWalletByBarcode =
    async (req, res) => {

        try {

            const wallet =
                await walletService
                    .getWalletByBarcode(
                        req.params.barcode
                    );

            res.json(wallet);

        } catch (err) {

            res.status(404).json({
                error: err.message
            });

        }

    };

exports.addBarcode =
    async (req, res) => {

        try {

            await walletService
                .addBarcode(

                    req.params.walletId,

                    req.body.barcode,

                    req.body.barcodeType

                );

            res.json({
                success: true
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };    