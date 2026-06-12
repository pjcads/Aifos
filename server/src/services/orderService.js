const db = require('../../db');
const idGenerator = require('../utils/idGenerator');
const priceService = require('./priceService');
const numberGeneratorService = require('./numberGeneratorService');
const checkoutService = require('./checkoutService');
const cashierSessionService = require('./cashierSessionService');

class OrderService {

    async createOrder({
        customerId,
        paymentMethod,
        items,
        remarks = null,
        createdBy = null
    }) {

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

            const [customerRows] =
                await connection.query(
                    `
                    SELECT id
                    FROM customers
                    WHERE id = ?
                    `,
                    [customerId]
                );

            if (
                customerRows.length === 0
            ) {

                throw new Error(
                    'Customer not found'
                );

            }

            const productIds =
                items.map(
                    x => x.productId
                );

            const [productRows] =
                await connection.query(
                    `
                    SELECT
                        id,
                        sku,
                        name
                    FROM products
                    WHERE id IN (?)
                    `,
                    [productIds]
                );

            const productMap = {};

            for (const row of productRows) {

                productMap[row.id] = row;

            }

            const priceMap =
                await priceService
                    .getCurrentPrices(
                        productIds
                    );

            let subtotal = 0;

            const orderLines = [];

            for (const item of items) {

                const product =
                    productMap[
                        item.productId
                    ];

                if (!product) {

                    throw new Error(
                        `Product not found: ${item.productId}`
                    );

                }

                const unitPrice =
                    priceMap[
                        item.productId
                    ];

                if (!unitPrice) {

                    throw new Error(
                        `No active price found for ${item.productId}`
                    );

                }

                const lineTotal =
                    Number(unitPrice)
                    *
                    Number(item.quantity);

                subtotal +=
                    lineTotal;

                orderLines.push({
                    productId:
                        product.id,
                    sku:
                        product.sku,
                    productName:
                        product.name,
                    quantity:
                        Number(
                            item.quantity
                        ),
                    unitPrice,
                    lineTotal
                });

            }

            const orderId =
                idGenerator.orderId();

            const orderNo =
                await numberGeneratorService
                    .generateOrderNo();

            await connection.query(
                `
                INSERT INTO order_headers
                (
                    id,
                    order_no,
                    customer_id,
                    payment_method,
                    subtotal,
                    total_amount,
                    remarks,
                    created_by
                )
                VALUES
                (
                    ?, ?, ?, ?,
                    ?, ?, ?, ?
                )
                `,
                [
                    orderId,
                    orderNo,
                    customerId,
                    paymentMethod,
                    subtotal,
                    subtotal,
                    remarks,
                    createdBy
                ]
            );

            for (
                const line
                of orderLines
            ) {

                await connection.query(
                    `
                    INSERT INTO order_lines
                    (
                        id,
                        order_id,
                        product_id,
                        sku,
                        product_name,
                        quantity,
                        unit_price,
                        line_total
                    )
                    VALUES
                    (
                        ?, ?, ?, ?, ?,
                        ?, ?, ?
                    )
                    `,
                    [
                        idGenerator
                            .orderLineId(),
                        orderId,
                        line.productId,
                        line.sku,
                        line.productName,
                        line.quantity,
                        line.unitPrice,
                        line.lineTotal
                    ]
                );

            }

            await connection.commit();

            return {
                orderId,
                orderNo,
                totalAmount:
                    subtotal,
                status:
                    'PENDING'
            };

        } catch (err) {

            await connection.rollback();
            throw err;

        } finally {

            connection.release();

        }

    }

    async getOrder(
        orderId
    ) {

        const [headers] =
            await db.query(
                `
                SELECT *
                FROM order_headers
                WHERE id = ?
                `,
                [orderId]
            );

        if (
            headers.length === 0
        ) {

            throw new Error(
                'Order not found'
            );

        }

        const [lines] =
            await db.query(
                `
                SELECT *
                FROM order_lines
                WHERE order_id = ?
                `,
                [orderId]
            );

        return {
            header: headers[0],
            lines
        };

    }    

    async getOrders() {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM order_headers
                ORDER BY
                    created_at DESC
                `
            );

        return rows;

    }    

    async updateStatus(
        orderId,
        newStatus
    ) {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM order_headers
                WHERE id = ?
                `,
                [orderId]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Order not found'
            );

        }

        const order =
            rows[0];

        const currentStatus =
            order.status;

        const validTransitions = {

            PENDING: [
                'PREPARING',
                'CANCELLED'
            ],

            PREPARING: [
                'READY',
                'CANCELLED'
            ],

            READY: [
                'RELEASED',
                'CANCELLED'
            ]

        };

        if (
            !validTransitions[
                currentStatus
            ]?.includes(
                newStatus
            )
        ) {

            throw new Error(
                `Cannot change order status from ${currentStatus} to ${newStatus}`
            );

        }

        let preparedAt = null;
        let readyAt = null;

        if (
            newStatus ===
            'PREPARING'
        ) {

            preparedAt =
                new Date();

        }

        if (
            newStatus ===
            'READY'
        ) {

            readyAt =
                new Date();

        }

        await db.query(
            `
            UPDATE order_headers
            SET
                status = ?,
                prepared_at =
                    COALESCE(
                        ?,
                        prepared_at
                    ),
                ready_at =
                    COALESCE(
                        ?,
                        ready_at
                    )
            WHERE id = ?
            `,
            [
                newStatus,
                preparedAt,
                readyAt,
                orderId
            ]
        );

        return {
            orderId,
            previousStatus:
                currentStatus,
            currentStatus:
                newStatus
        };

    }

    async releaseOrder({
        orderId,
        terminalId,
        releasedBy,
        walletBarcode = null,
        negativeInventoryApprovalId = null,
        amountTendered = null
    }) {

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

            const [headerRows] =
                await connection.query(
                    `
                    SELECT *
                    FROM order_headers
                    WHERE id = ?
                    `,
                    [orderId]
                );

            if (
                headerRows.length === 0
            ) {

                throw new Error(
                    'Order not found'
                );

            }

            const order =
                headerRows[0];

            if (
                order.status === 'RELEASED'
            ) {

                throw new Error(
                    'Order already released'
                );

            }

            if (
                order.status === 'CANCELLED'
            ) {

                throw new Error(
                    'Cancelled order cannot be released'
                );

            }            

            if (
                order.status !== 'READY'
            ) {

                throw new Error(
                    'Only READY orders can be released'
                );

            }

            const [lineRows] =
                await connection.query(
                    `
                    SELECT
                        product_id,
                        quantity
                    FROM order_lines
                    WHERE order_id = ?
                    `,
                    [orderId]
                );

            const items =
                lineRows.map(
                    x => ({
                        productId:
                            x.product_id,
                        quantity:
                            Number(
                                x.quantity
                            )
                    })
                );

            await connection.commit();

            const sale =
                await checkoutService
                    .createSale({

                        paymentMethod:
                            order.payment_method,

                        customerId:
                            order.customer_id,

                        walletBarcode,

                        items,

                        cashierId:
                            releasedBy,

                        terminalId,

                        negativeInventoryApprovalId,

                        amountTendered

                    });

            const activeSession =
                await cashierSessionService
                    .getOpenSessionByTerminal(
                        terminalId
                    );

            await db.query(
                `
                UPDATE order_headers
                SET
                    status = 'RELEASED',
                    session_id = ?,
                    released_transaction_id = ?,
                    released_at = NOW(),
                    released_by = ?
                WHERE id = ?
                `,
                [
                    activeSession.id,
                    sale.transactionId,
                    releasedBy,
                    orderId
                ]
            );

            return {
                orderId,
                orderNo:
                    order.order_no,

                transactionId:
                    sale.transactionId,

                transactionNo:
                    sale.transactionNo,

                status:
                    'RELEASED'
            };

        } catch (err) {

            await connection.rollback();
            throw err;

        } finally {

            connection.release();

        }

    }    

    async cancelOrder(
        orderId
    ) {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM order_headers
                WHERE id = ?
                `,
                [orderId]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Order not found'
            );

        }

        const order =
            rows[0];

        if (
            [
                'RELEASED',
                'CANCELLED'
            ].includes(
                order.status
            )
        ) {

            throw new Error(
                `Cannot cancel ${order.status} order`
            );

        }

        await db.query(
            `
            UPDATE order_headers
            SET status = 'CANCELLED'
            WHERE id = ?
            `,
            [orderId]
        );

        return {
            orderId,
            previousStatus:
                order.status,
            currentStatus:
                'CANCELLED'
        };

    }

    async getOrdersByStatus(
        status
    ) {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM order_headers
                WHERE status = ?
                ORDER BY
                    created_at DESC
                `,
                [status]
            );

        return rows;

    }    

    async createOrderByBarcode({
        barcode,
        paymentMethod,
        items,
        remarks = null,
        createdBy = null
    }) {

        const [rows] =
            await db.query(
                `
                SELECT
                    w.customer_id
                FROM wallet_account_barcodes wb
                INNER JOIN wallet_accounts w
                    ON w.id = wb.wallet_id
                WHERE wb.barcode = ?
                AND wb.is_active = 1
                `,
                [barcode]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Barcode not found'
            );

        }

        if (
            !rows[0].customer_id
        ) {

            throw new Error(
                'Barcode is not linked to a customer'
            );

        }

        return await this.createOrder({

            customerId:
                rows[0].customer_id,

            paymentMethod,

            items,

            remarks,

            createdBy

        });

    }

}

module.exports = new OrderService();