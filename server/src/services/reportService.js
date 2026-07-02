const db = require('../../db');

class ReportService {

    constructor()
    {

        this.reportHandlers =
        {
            SALES_SUMMARY:
                this.getSalesSummaryReport.bind(
                    this
                ),

            PRODUCT_SALES:
                this.getProductSalesReport.bind(
                    this
                ),

            INVENTORY_MOVEMENT:
                this.getInventoryMovementReport.bind(
                    this
                ),

            INVENTORY_VALUATION:
                this.getInventoryValuationReport.bind(
                    this
                ),

            PAYMENT_METHOD:
                this.getPaymentMethodReport.bind(
                    this
                ),

            ORDER_PERFORMANCE:
                this.getOrderPerformanceReport.bind(
                    this
                )
        };

    }

    async getReportMetadata(
        reportCode
    ) {

        const [rows] =
            await db.query(
                `
                SELECT
                    report.code,
                    report.name,
                    parent.code AS group_code,
                    parent.name AS group_name
                FROM
                    configuration_dropdown_values report

                INNER JOIN
                    configuration_dropdown_types dt
                        ON dt.id =
                            report.dropdown_type_id

                LEFT JOIN
                    configuration_dropdown_values parent
                        ON parent.id =
                            report.parent_dropdown_value_id

                WHERE
                    dt.code = 'REPORTS'
                    AND report.code = ?

                LIMIT 1
                `,
                [
                    reportCode
                ]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                `Report '${reportCode}' is not registered.`
            );

        }

        return rows[0];

    }    

    async getReports()
    {

        const [rows] =
            await db.query(
                `
                SELECT
                    dv.id,
                    dv.code,
                    dv.name,
                    dv.description,
                    parent.code AS report_group_code,
                    parent.name AS report_group_name,
                    dv.sort_order
                FROM
                    configuration_dropdown_values dv

                INNER JOIN
                    configuration_dropdown_types dt
                        ON dt.id =
                            dv.dropdown_type_id

                LEFT JOIN
                    configuration_dropdown_values parent
                        ON parent.id =
                            dv.parent_dropdown_value_id

                WHERE
                    dt.code = 'REPORTS'
                    AND dv.is_active = 1

                ORDER BY
                    parent.sort_order,
                    dv.sort_order,
                    dv.name
                `
            );

        return rows;

    }

    async runReport(
        request
    ) {

        const handler =
            this.reportHandlers[
                request.reportCode
            ];

        if (
            !handler
        ) {

            throw new Error(
                `Unknown report '${request.reportCode}'.`
            );

        }

        const metadata =
            await this.getReportMetadata(
                request.reportCode
            );

        const result =
            await handler(
                request.filters
            );

        return {

            code:
                metadata.code,

            title:
                metadata.name,

            group:
            {
                code:
                    metadata.group_code,

                title:
                    metadata.group_name
            },

            columns:
                result.columns,

            rows:
                result.rows,

            summary:
                result.summary ?? {}

        };

    }

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

        const summary =
        {
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

        return {

            columns:
            [
                {
                    field: "metric",
                    caption: "Metric"
                },
                {
                    field: "value",
                    caption: "Value"
                }
            ],

            rows:
            [
                {
                    metric: "Sales Count",
                    value: summary.salesCount
                },
                {
                    metric: "Sales Amount",
                    value: summary.salesAmount
                },
                {
                    metric: "Refund Count",
                    value: summary.refundCount
                },
                {
                    metric: "Refund Amount",
                    value: summary.refundAmount
                },
                {
                    metric: "Net Sales",
                    value: summary.netSales
                }
            ],

            summary

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