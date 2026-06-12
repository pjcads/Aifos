const db = require('../../db');

class ReportService {

    async getProductSalesReport({
        fromDate,
        toDate
    }) {

        const [rows] =
            await db.query(
                `
                SELECT

                    tl.product_id,

                    tl.sku,

                    tl.product_name,

                    SUM(
                        tl.quantity
                    ) quantity_sold,

                    SUM(
                        tl.line_total
                    ) sales_amount

                FROM transaction_lines tl

                INNER JOIN
                    transaction_headers th
                        ON th.id =
                            tl.transaction_id

                WHERE
                    th.transaction_type =
                        'SALE'

                AND DATE(
                    th.transaction_datetime
                )
                BETWEEN ? AND ?

                GROUP BY

                    tl.product_id,
                    tl.sku,
                    tl.product_name

                ORDER BY

                    quantity_sold DESC,
                    sales_amount DESC
                `,
                [
                    fromDate,
                    toDate
                ]
            );

        return rows;

    }

    async getSalesSummaryReport({
        fromDate,
        toDate
    }) {

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
                    transaction_type = 'SALE'
                AND DATE(transaction_datetime)
                    BETWEEN ? AND ?
                `,
                [
                    fromDate,
                    toDate
                ]
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
                    transaction_type = 'REFUND'
                AND DATE(transaction_datetime)
                    BETWEEN ? AND ?
                `,
                [
                    fromDate,
                    toDate
                ]
            );

        return {

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
                ),

            netSales:
                Number(
                    sales.sales_amount
                )
                -
                Number(
                    refunds.refund_amount
                )

        };

    }    

    async getInventoryMovementReport({
        fromDate,
        toDate
    }) {

        const [rows] =
            await db.query(
                `
                SELECT

                    im.id,

                    p.sku,

                    p.name,

                    im.movement_type,

                    im.quantity_change,

                    im.reference_id,

                    im.remarks,

                    im.created_by,

                    im.approval_id,

                    im.movement_datetime

                FROM inventory_movements im

                INNER JOIN products p
                    ON p.id =
                        im.product_id

                WHERE DATE(
                    im.movement_datetime
                )
                BETWEEN ? AND ?

                ORDER BY
                    im.movement_datetime DESC
                `,
                [
                    fromDate,
                    toDate
                ]
            );

        return rows;

    }

    async getInventoryValuationReport() {

        const [rows] =
            await db.query(
                `
                SELECT

                    p.id,

                    p.sku,

                    p.name,

                    ib.quantity_on_hand,

                    pp.price,

                    (
                        ib.quantity_on_hand
                        *
                        pp.price
                    ) inventory_value

                FROM inventory_balances ib

                INNER JOIN products p
                    ON p.id =
                        ib.product_id

                INNER JOIN product_prices pp
                    ON pp.product_id =
                        p.id

                WHERE pp.is_active = 1

                ORDER BY
                    inventory_value DESC
                `
            );

        return rows;

    }

    async getPaymentMethodReport({
        fromDate,
        toDate
    }) {

        const [rows] =
            await db.query(
                `
                SELECT

                    payment_method,

                    COUNT(*) transaction_count,

                    COALESCE(
                        SUM(total_amount),
                        0
                    ) amount

                FROM transaction_headers

                WHERE
                    transaction_type = 'SALE'

                AND DATE(
                    transaction_datetime
                )
                BETWEEN ? AND ?

                GROUP BY
                    payment_method

                ORDER BY
                    amount DESC
                `,
                [
                    fromDate,
                    toDate
                ]
            );

        return rows;

    }

    async getOrderPerformanceReport({
        fromDate,
        toDate
    }) {

        const [[summary]] =
            await db.query(
                `
                SELECT

                    COUNT(*) total_orders,

                    SUM(
                        CASE
                            WHEN status = 'RELEASED'
                            THEN 1
                            ELSE 0
                        END
                    ) released_orders,

                    SUM(
                        CASE
                            WHEN status = 'CANCELLED'
                            THEN 1
                            ELSE 0
                        END
                    ) cancelled_orders,

                    AVG(
                        TIMESTAMPDIFF(
                            MINUTE,
                            prepared_at,
                            ready_at
                        )
                    )
                    average_preparation_minutes,

                    AVG(
                        TIMESTAMPDIFF(
                            MINUTE,
                            created_at,
                            released_at
                        )
                    )
                    average_release_minutes

                FROM order_headers

                WHERE DATE(created_at)
                BETWEEN ? AND ?
                `,
                [
                    fromDate,
                    toDate
                ]
            );

        return summary;

    }

}

module.exports = new ReportService();