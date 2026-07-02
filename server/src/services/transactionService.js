const db = require('../../db');

const queryHelper =
    require('../utils/queryHelper');

const searchHelper =
    require('../utils/searchHelper');

const sortableColumns =
{
    transaction_no:
        'th.transaction_no',

    transaction_datetime:
        'th.transaction_datetime',

    payment_method:
        'th.payment_method',

    total_amount:
        'th.total_amount',

    customer_name:
        'c.name',

    cashier_name:
        'u.username'
};

const searchableColumns =
[
    'th.transaction_no',
    'c.name',
    'u.username'
];    

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
                SELECT
                    th.*,
                    c.name AS customer_name,
                    u.username AS cashier_name
                FROM transaction_headers th

                LEFT JOIN customers c
                    ON c.id = th.customer_id

                LEFT JOIN users u
                    ON u.id = th.cashier_id

                WHERE th.session_id = ?

                ORDER BY
                    th.transaction_datetime DESC
                `,
                [sessionId]
            );

        return rows;

    }

    async getTransactions(req) {

        const query =
            queryHelper.build(
                req,
                sortableColumns,
                'transaction_datetime'
            );

        const search =
            searchHelper.build(
                query.search,
                searchableColumns
            );

        const [rows] =
            await db.query(
                `
                SELECT
                    th.*,
                    c.name AS customer_name,
                    u.username AS cashier_name

                FROM transaction_headers th

                LEFT JOIN customers c
                    ON c.id = th.customer_id

                LEFT JOIN users u
                    ON u.id = th.cashier_id

                ${search.where}

                ${query.orderBy}

                LIMIT ?
                OFFSET ?
                `,
                [
                    ...search.params,
                    query.pageSize,
                    query.offset
                ]
            );

        const [[{ total }]] =
            await db.query(
                `
                SELECT
                    COUNT(*) AS total

                FROM transaction_headers th

                LEFT JOIN customers c
                    ON c.id = th.customer_id

                LEFT JOIN users u
                    ON u.id = th.cashier_id

                ${search.where}
                `,
                search.params
            );

        return {

            rows,

            total,

            page:
                query.page,

            pageSize:
                query.pageSize

        };

    }    

}

module.exports = new TransactionService();