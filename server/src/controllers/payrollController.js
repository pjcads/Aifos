const payrollService =
    require('../services/payrollService');

exports.generateBatch =
    async (req, res) => {

    try {

        const {
            periodFrom,
            periodTo
        } = req.body;

        const batchId =
            await payrollService.generateBatch(
                periodFrom,
                periodTo,
                req.user.id
            );

        res.json({
            success: true,
            batchId
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

exports.endorseBatch =
    async (req, res) => {

    try {

        await payrollService.endorseBatch(
            req.params.id
        );

        res.json({
            success: true
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};