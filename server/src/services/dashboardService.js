const db = require('../../db');

class DashboardService {

    async getSummary() {

        const [[sales]] =
            await db.query(
                `
                SELECT
                    COALESCE(
                        SUM(total_amount),
                        0
                    ) total_sales,
                    COUNT(*) total_transactions
                FROM transaction_headers
                WHERE
                    transaction_type = 'SALE'
                AND DATE(transaction_datetime) = CURDATE()
                `
            );

        const [[refunds]] =
            await db.query(
                `
                SELECT
                    COALESCE(
                        SUM(total_amount),
                        0
                    ) total_refunds,
                    COUNT(*) total_refund_transactions
                FROM transaction_headers
                WHERE
                    transaction_type = 'REFUND'
                AND DATE(transaction_datetime) = CURDATE()
                `
            );

        const [[orders]] =
            await db.query(
                `
                SELECT
                    COUNT(*) total_orders
                FROM order_headers
                WHERE DATE(created_at) = CURDATE()
                `
            );

        const [[pending]] =
            await db.query(
                `
                SELECT COUNT(*) count
                FROM order_headers
                WHERE status = 'PENDING'
                `
            );

        const [[preparing]] =
            await db.query(
                `
                SELECT COUNT(*) count
                FROM order_headers
                WHERE status = 'PREPARING'
                `
            );

        const [[ready]] =
            await db.query(
                `
                SELECT COUNT(*) count
                FROM order_headers
                WHERE status = 'READY'
                `
            );

        const [[walletTopups]] =
            await db.query(
                `
                SELECT
                    COALESCE(
                        SUM(amount),
                        0
                    ) total_topups
                FROM wallet_transactions
                WHERE
                    transaction_type = 'TOPUP'
                AND DATE(created_at) = CURDATE()
                `
            );

        return {

            todaySales:
                Number(
                    sales.total_sales
                ),

            todayTransactions:
                Number(
                    sales.total_transactions
                ),

            todayRefunds:
                Number(
                    refunds.total_refunds
                ),

            todayRefundTransactions:
                Number(
                    refunds.total_refund_transactions
                ),

            todayOrders:
                Number(
                    orders.total_orders
                ),

            pendingOrders:
                Number(
                    pending.count
                ),

            preparingOrders:
                Number(
                    preparing.count
                ),

            readyOrders:
                Number(
                    ready.count
                ),

            walletTopupsToday:
                Number(
                    walletTopups.total_topups
                )

        };

    }

    async getTopProductsToday() {

        const [rows] =
            await db.query(
                `
                SELECT
                    tl.product_id,
                    tl.sku,
                    tl.product_name,

                    SUM(
                        tl.quantity
                    ) total_quantity,

                    SUM(
                        tl.line_total
                    ) total_sales

                FROM transaction_lines tl

                INNER JOIN transaction_headers th
                    ON th.id =
                        tl.transaction_id

                WHERE
                    th.transaction_type = 'SALE'
                AND DATE(
                    th.transaction_datetime
                ) = CURDATE()

                GROUP BY
                    tl.product_id,
                    tl.sku,
                    tl.product_name

                ORDER BY
                    total_quantity DESC,
                    total_sales DESC

                LIMIT 20
                `
            );

        return rows;

    }    

    async getSalesByPaymentMethod() {

        const [rows] =
            await db.query(
                `
                SELECT
                    payment_method,

                    COUNT(*) transaction_count,

                    COALESCE(
                        SUM(total_amount),
                        0
                    ) total_sales

                FROM transaction_headers

                WHERE
                    transaction_type = 'SALE'

                AND DATE(
                    transaction_datetime
                ) = CURDATE()

                GROUP BY
                    payment_method

                ORDER BY
                    total_sales DESC
                `
            );

        return rows;

    }    

    async getTopCustomers() {

        const [rows] =
            await db.query(
                `
                SELECT

                    c.id,
                    c.customer_code,
                    c.name,

                    COUNT(*) transaction_count,

                    SUM(
                        th.total_amount
                    ) total_sales

                FROM transaction_headers th

                INNER JOIN customers c
                    ON c.id =
                        th.customer_id

                WHERE
                    th.transaction_type = 'SALE'

                GROUP BY
                    c.id,
                    c.customer_code,
                    c.name

                ORDER BY
                    total_sales DESC

                LIMIT 20
                `
            );

        return rows;

    } 
    
    async getTopCreditUsers() {

        const [rows] =
            await db.query(
                `
                SELECT

                    c.id,
                    c.customer_code,
                    c.name,

                    c.credit_limit,

                    c.current_cycle_used_credit,

                    (
                        c.credit_limit
                        -
                        c.current_cycle_used_credit
                    ) available_credit

                FROM customers c

                WHERE
                    c.credit_limit > 0

                ORDER BY
                    c.current_cycle_used_credit DESC

                LIMIT 20
                `
            );

        return rows;

    } 
    
    async getTopWalletUsers() {

        const [rows] =
            await db.query(
                `
                SELECT

                    wa.id,
                    wa.account_name,

                    wa.current_balance,

                    COUNT(
                        wt.id
                    ) transaction_count

                FROM wallet_accounts wa

                LEFT JOIN
                    wallet_transactions wt
                        ON wt.wallet_id = wa.id

                GROUP BY
                    wa.id,
                    wa.account_name,
                    wa.current_balance

                ORDER BY
                    transaction_count DESC

                LIMIT 20
                `
            );

        return rows;

    }    

}

module.exports = new DashboardService();