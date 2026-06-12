const db = require('../../db');
const idGenerator = require('../utils/idGenerator');

class CashierSessionService {

    async openSession({
        terminalId,
        cashierId,
        openingNotes = null
    }) {

        const [existing] =
            await db.query(
                `
                SELECT id
                FROM cashier_sessions
                WHERE terminal_id = ?
                AND status = 'OPEN'
                `,
                [terminalId]
            );

        if (
            existing.length > 0
        ) {

            throw new Error(
                'Terminal already has an active session'
            );

        }

        const sessionId =
            idGenerator.cashierSessionId();

        await db.query(
            `
            INSERT INTO
            cashier_sessions
            (
                id,
                terminal_id,
                cashier_id,
                opened_at,
                status,
                opening_notes
            )
            VALUES
            (
                ?,
                ?,
                ?,
                NOW(),
                'OPEN',
                ?
            )
            `,
            [
                sessionId,
                terminalId,
                cashierId,
                openingNotes
            ]
        );

        return {
            sessionId
        };

    }

        async closeSession(
            sessionId,
            closingNotes = null,
            closedBy
        ) {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM cashier_sessions
                WHERE id = ?
                `,
                [sessionId]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Session not found'
            );

        }

        const session =
            rows[0];

        if (
            session.status !==
            'OPEN'
        ) {

            throw new Error(
                'Session is already closed'
            );

        }

        const summary =
            await this.getSessionSummary(
                sessionId
            );

        await db.query(
            `
            UPDATE cashier_sessions
            SET
                status = 'CLOSED',
                closed_at = NOW(),
                closing_notes = ?,
                closed_by = ?,

                sales_count = ?,
                sales_amount = ?,

                refund_count = ?,
                refund_amount = ?

            WHERE id = ?
            `,
            [
                closingNotes,
                closedBy,
                summary.salesCount,
                summary.salesAmount,

                summary.refundCount,
                summary.refundAmount,

                sessionId
            ]
        );

        return {
            sessionId,
            salesCount:
                summary.salesCount,
            salesAmount:
                summary.salesAmount,
            refundCount:
                summary.refundCount,
            refundAmount:
                summary.refundAmount
        };

    }

    async getActiveSession(
        terminalId
    ) {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM cashier_sessions
                WHERE terminal_id = ?
                AND status = 'OPEN'
                LIMIT 1
                `,
                [terminalId]
            );

        if (
            rows.length === 0
        ) {

            return null;

        }

        return rows[0];

    }

    async getSessionSummary(
        sessionId
    ) {

        const [sessionRows] =
            await db.query(
                `
                SELECT *
                FROM cashier_sessions
                WHERE id = ?
                `,
                [sessionId]
            );

        if (
            sessionRows.length === 0
        ) {

            throw new Error(
                'Session not found'
            );

        }

        const [rows] =
            await db.query(
                `
                SELECT
                    transaction_type,
                    payment_method,
                    COUNT(*) transaction_count,
                    COALESCE(
                        SUM(total_amount),
                        0
                    ) total_amount
                FROM transaction_headers
                WHERE session_id = ?
                GROUP BY
                    transaction_type,
                    payment_method
                `,
                [sessionId]
            );

        const summary = {

            sessionId,

            salesCount: 0,
            salesAmount: 0,

            refundCount: 0,
            refundAmount: 0,

            creditSales: 0,
            walletSales: 0,
            cashSales: 0

        };

        for (const row of rows) {

            if (
                row.transaction_type ===
                'SALE'
            ) {

                summary.salesCount +=
                    Number(
                        row.transaction_count
                    );

                summary.salesAmount +=
                    Number(
                        row.total_amount
                    );

                if (
                    row.payment_method ===
                    'CUSTOMER_CREDIT'
                ) {

                    summary.creditSales +=
                        Number(
                            row.total_amount
                        );

                }

                if (
                    row.payment_method ===
                    'XEMCO_WALLET'
                ) {

                    summary.walletSales +=
                        Number(
                            row.total_amount
                        );

                }

                if (
                    row.payment_method ===
                    'CASH'
                ) {

                    summary.cashSales +=
                        Number(
                            row.total_amount
                        );

                }

            }

            if (
                row.transaction_type ===
                'REFUND'
            ) {

                summary.refundCount +=
                    Number(
                        row.transaction_count
                    );

                summary.refundAmount +=
                    Number(
                        row.total_amount
                    );

            }

        }

        return summary;

    }    

    async getSessionReport(
        sessionId
    ) {

        const [sessionRows] =
            await db.query(
                `
                SELECT *
                FROM cashier_sessions
                WHERE id = ?
                `,
                [sessionId]
            );

        if (
            sessionRows.length === 0
        ) {

            throw new Error(
                'Session not found'
            );

        }

        const session =
            sessionRows[0];

        const [[sales]] =
            await db.query(
                `
                SELECT
                    COUNT(*) sales_count,

                    COALESCE(
                        SUM(total_amount),
                        0
                    ) sales_amount

                FROM transaction_headers

                WHERE
                    session_id = ?

                AND transaction_type =
                    'SALE'
                `,
                [sessionId]
            );

        const [[refunds]] =
            await db.query(
                `
                SELECT
                    COUNT(*) refund_count,

                    COALESCE(
                        SUM(total_amount),
                        0
                    ) refund_amount

                FROM transaction_headers

                WHERE
                    session_id = ?

                AND transaction_type =
                    'REFUND'
                `,
                [sessionId]
            );

        const [[creditSales]] =
            await db.query(
                `
                SELECT
                    COALESCE(
                        SUM(total_amount),
                        0
                    ) amount

                FROM transaction_headers

                WHERE
                    session_id = ?

                AND transaction_type =
                    'SALE'

                AND payment_method =
                    'CUSTOMER_CREDIT'
                `,
                [sessionId]
            );

        const [[walletSales]] =
            await db.query(
                `
                SELECT
                    COALESCE(
                        SUM(total_amount),
                        0
                    ) amount

                FROM transaction_headers

                WHERE
                    session_id = ?

                AND transaction_type =
                    'SALE'

                AND payment_method =
                    'XEMCO_WALLET'
                `,
                [sessionId]
            );

        const [[cashSales]] =
            await db.query(
                `
                SELECT
                    COALESCE(
                        SUM(total_amount),
                        0
                    ) amount

                FROM transaction_headers

                WHERE
                    session_id = ?

                AND transaction_type =
                    'SALE'

                AND payment_method =
                    'CASH'
                `,
                [sessionId]
            );

        const [[orders]] =
            await db.query(
                `
                SELECT
                    COUNT(*) released_orders

                FROM order_headers

                WHERE
                    session_id = ?

                AND status =
                    'RELEASED'
                `,
                [sessionId]
            );

        const [topProducts] =
            await db.query(
                `
                SELECT

                    tl.product_name,

                    SUM(
                        tl.quantity
                    ) quantity,

                    SUM(
                        tl.line_total
                    ) sales

                FROM transaction_lines tl

                INNER JOIN
                    transaction_headers th
                        ON th.id =
                            tl.transaction_id

                WHERE
                    th.session_id = ?

                AND th.transaction_type =
                    'SALE'

                GROUP BY
                    tl.product_name

                ORDER BY
                    quantity DESC,
                    sales DESC

                LIMIT 10
                `,
                [sessionId]
            );

        return {

            session: {

                sessionId:
                    session.id,

                terminalId:
                    session.terminal_id,

                cashierId:
                    session.cashier_id,

                openedAt:
                    session.opened_at,

                closedAt:
                    session.closed_at,

                status:
                    session.status

            },

            totals: {

                salesCount:
                    Number(
                        sales.sales_count
                    ),

                salesAmount:
                    Number(
                        sales.sales_amount
                    ),

                refundCount:
                    Number(
                        refunds.refund_count
                    ),

                refundAmount:
                    Number(
                        refunds.refund_amount
                    )

            },

            payments: {

                creditSales:
                    Number(
                        creditSales.amount
                    ),

                walletSales:
                    Number(
                        walletSales.amount
                    ),

                cashSales:
                    Number(
                        cashSales.amount
                    )

            },

            orders: {

                releasedOrders:
                    Number(
                        orders.released_orders
                    )

            },

            topProducts

        };

    }

    async getOpenSessionByTerminal(
        terminalId
    ) {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM cashier_sessions
                WHERE terminal_id = ?
                AND status = 'OPEN'
                ORDER BY opened_at DESC
                LIMIT 1
                `,
                [terminalId]
            );

        return rows[0] || null;

    }

}

module.exports =  new CashierSessionService();