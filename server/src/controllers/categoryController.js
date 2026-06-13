const categoryService =
    require('../services/categoryService');

exports.getCategories =
    async (req, res) => {

        try {

            const rows =
                await categoryService
                    .getCategories();

            res.json({
                success: true,
                categories: rows
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };

exports.getCategory =
    async (req, res) => {

        try {

            const category =
                await categoryService
                    .getCategory(
                        req.params.id
                    );

            res.json({
                success: true,
                category
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };

exports.createCategory =
    async (req, res) => {

        try {

            const result =
                await categoryService
                    .createCategory({

                        categoryCode:
                            req.body.categoryCode,

                        categoryName:
                            req.body.categoryName

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

exports.updateCategory =
    async (req, res) => {

        try {

            const result =
                await categoryService
                    .updateCategory(
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