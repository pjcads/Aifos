const productService =
    require('../services/productService');

const responseHelper =
    require('../utils/responseHelper');    

exports.getProducts =
    async (req, res) => {

        try {

            const result =
                await productService
                    .getProducts(req);

            responseHelper.successPaged(
                res,
                result
            );

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };

exports.getProduct =
    async (req, res) => {

        try {

            const product =
                await productService
                    .getProduct(
                        req.params.id
                    );

            res.json({
                success: true,
                product
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };

exports.createProduct =
    async (req, res) => {

        try {

            const result =
                await productService
                    .createProduct(
                        req.body
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

exports.updateProduct =
    async (req, res) => {

        try {

            const result =
                await productService
                    .updateProduct(
                        req.params.id,
                        req.body
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

exports.uploadProductImage =
    async (req, res) => {

        try {

            const result =
                await productService
                    .uploadProductImage(
                        req.params.id,
                        req.file
                    );

            return responseHelper
                .success(
                    res,
                    result
                );

        } catch (err) {

            return responseHelper
                .error(
                    res,
                    err,
                    400
                );

        }

    };    