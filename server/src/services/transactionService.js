const db = require('../../db');

class TransactionService {

    async getTransactionById(
        transactionId
    ) {

        const [headers] =
            await db.query(
                `
                SELECT *
                FROM transaction_headers
                WHERE id = ?
                `,
                [transactionId]
            );

        if (
            headers.length === 0
        ) {

            throw new Error(
                'Transaction not found'
            );

        }

        const [lines] =
            await db.query(
                `
                SELECT *
                FROM transaction_lines
                WHERE transaction_id = ?
                `,
                [transactionId]
            );

        return {
            header: headers[0],
            lines
        };

    }

    async getTransactionByNumber(
        transactionNo
    ) {

        const [rows] =
            await db.query(
                `
                SELECT id
                FROM transaction_headers
                WHERE transaction_no = ?
                `,
                [transactionNo]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Transaction not found'
            );

        }

        return this.getTransactionById(
            rows[0].id
        );

    }

    async getTransactionsBySession(
        sessionId
    ) {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM transaction_headers
                WHERE session_id = ?
                ORDER BY transaction_datetime DESC
                `,
                [sessionId]
            );

        return rows;

    }

}

module.exports = new TransactionService();