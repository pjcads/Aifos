const terminalService =
    require('../services/terminalService');

exports.getTerminals =
    async (req, res) => {

        try {

            const rows =
                await terminalService
                    .getTerminals();

            res.json({
                success: true,
                terminals: rows
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };

exports.getTerminal =
    async (req, res) => {

        try {

            const terminal =
                await terminalService
                    .getTerminal(
                        req.params.id
                    );

            res.json({
                success: true,
                terminal
            });

        } catch (err) {

            res.status(400).json({
                success: false,
                error: err.message
            });

        }

    };

exports.createTerminal =
    async (req, res) => {

        try {

            const result =
                await terminalService
                    .createTerminal({
                        terminalCode:
                            req.body.terminalCode,
                        terminalName:
                            req.body.terminalName
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

exports.updateTerminal =
    async (req, res) => {

        try {

            const result =
                await terminalService
                    .updateTerminal(
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