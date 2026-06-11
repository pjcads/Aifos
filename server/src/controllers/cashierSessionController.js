const cashierSessionService =
    require('../services/cashierSessionService');

exports.openSession =
    async (req, res) => {

        try {

            const result =
                await cashierSessionService
                    .openSession({

                        terminalId:
                            req.body.terminalId,

                        cashierId:
                            req.user.id,

                        openingNotes:
                            req.body.openingNotes

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

exports.closeSession =
    async (req, res) => {

        try {

        const result =
            await cashierSessionService
                .closeSession(
                    req.params.sessionId,
                    req.body.closingNotes,
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

exports.getActiveSession =
    async (req, res) => {

        try {

            const session =
                await cashierSessionService
                    .getActiveSession(
                        req.params.terminalId
                    );

            res.json({
                success: true,
                session
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };

exports.getSessionSummary =
    async (req, res) => {

        try {

            const summary =
                await cashierSessionService
                    .getSessionSummary(
                        req.params.sessionId
                    );

            res.json({
                success: true,
                summary
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };    