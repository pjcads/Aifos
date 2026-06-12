const db = require('../../db');
const idGenerator = require('../utils/idGenerator');

class TerminalService {

    async getTerminals() {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM terminals
                ORDER BY
                    terminal_code
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

        const terminalId =
            idGenerator.terminalId();

        await db.query(
            `
            INSERT INTO terminals
            (
                id,
                terminal_code,
                terminal_name,
                is_active
            )
            VALUES
            (
                ?, ?, ?, 1
            )
            `,
            [
                terminalId,
                terminalCode,
                terminalName
            ]
        );

        return {
            terminalId
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

}

module.exports = new TerminalService();