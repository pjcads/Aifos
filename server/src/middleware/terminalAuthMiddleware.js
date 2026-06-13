const db = require('../../db');

module.exports =
    async (
        req,
        res,
        next
    ) => {

        try {

            const apiKey =
                req.header(
                    'X-Terminal-Key'
                );

            if (!apiKey) {

                return res
                    .status(401)
                    .json({
                        success: false,
                        error:
                            'Terminal API key is required'
                    });

            }

            const [rows] =
                await db.query(
                    `
                    SELECT *
                    FROM terminals
                    WHERE api_key = ?
                    `,
                    [apiKey]
                );

            if (
                rows.length === 0
            ) {

                return res
                    .status(401)
                    .json({
                        success: false,
                        error:
                            'Invalid terminal API key'
                    });

            }

            const terminal =
                rows[0];

            if (
                !terminal.is_active
            ) {

                return res
                    .status(403)
                    .json({
                        success: false,
                        error:
                            'Terminal is disabled'
                    });

            }

            req.terminal =
                terminal;

            next();

        } catch (err) {

            return res
                .status(500)
                .json({
                    success: false,
                    error:
                        err.message
                });

        }

    };