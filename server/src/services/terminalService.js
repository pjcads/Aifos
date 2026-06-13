const db = require('../../db');
const idGenerator = require('../utils/idGenerator');
const crypto = require('crypto');

class TerminalService {

    async getTerminals() {

        const [rows] =
            await db.query(
                `
                SELECT
                    *,
                    CASE
                        WHEN
                            is_active = 0
                        THEN
                            'DISABLED'

                        WHEN
                            last_seen_at IS NOT NULL
                            AND
                            last_seen_at >=
                                DATE_SUB(
                                    NOW(),
                                    INTERVAL 5 MINUTE
                                )
                        THEN
                            'ONLINE'

                        ELSE
                            'OFFLINE'

                    END
                    AS computed_status
                FROM terminals
                ORDER BY terminal_code
                `
            );

        return rows;

    }

    async getTerminal(
        terminalId
    ) {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM terminals
                WHERE id = ?
                `,
                [terminalId]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Terminal not found'
            );

        }

        return rows[0];

    }

    async createTerminal({
        terminalCode,
        terminalName
    }) {


        const [existing] =
            await db.query(
                `
                SELECT id
                FROM terminals
                WHERE terminal_code = ?
                `,
                [terminalCode]
            );

        if (
            existing.length > 0
        ) {

            throw new Error(
                'Terminal code already exists'
            );

        }

        const terminalId = idGenerator.terminalId();
        const apiKey = crypto.randomUUID();

        await db.query(
            `
            INSERT INTO terminals
            (
                id,
                terminal_code,
                terminal_name,
                api_key,
                is_active
            )
            VALUES
            (
                ?, ?, ?, ?, 1
            )
            `,
            [
                terminalId,
                terminalCode,
                terminalName,
                apiKey
            ]
        );

        return {
            terminalId,
            apiKey
        };

    }

    async updateTerminal(
        terminalId,
        {
            terminalName,
            isActive
        }
    ) {

        const [rows] =
            await db.query(
                `
                SELECT id
                FROM terminals
                WHERE id = ?
                `,
                [terminalId]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Terminal not found'
            );

        }

        await db.query(
            `
            UPDATE terminals
            SET
                terminal_name = ?,
                is_active = ?
            WHERE id = ?
            `,
            [
                terminalName,
                isActive,
                terminalId
            ]
        );

        return {
            terminalId
        };

    }

    async heartbeat({
        terminalId,
        appVersion,
        machineName,
        ipAddress
    }) {

        const [rows] =
            await db.query(
                `
                SELECT id,
                    is_active
                FROM terminals
                WHERE id = ?
                `,
                [terminalId]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Terminal not found'
            );

        }

        if (
            !rows[0].is_active
        ) {

            throw new Error(
                'Terminal is disabled'
            );

        }

        await db.query(
            `
            UPDATE terminals
            SET
                last_seen_at = NOW(),
                app_version = ?,
                machine_name = ?,
                ip_address = ?,
                terminal_status = 'ONLINE'
            WHERE id = ?
            `,
            [
                appVersion,
                machineName,
                ipAddress,
                terminalId
            ]
        );

        return {
            terminalId
        };

    }

}

module.exports = new TerminalService();