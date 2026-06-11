const db = require('../../db');
const creditService = require('./creditService');
const idGenerator = require('../utils/idGenerator');
const priceService = require('./priceService');
const inventoryService = require('./inventoryService');
const negativeInventoryApprovalService = require('./negativeInventoryApprovalService');

class CheckoutService {

        async createSale({
            customerId,
            items,
            cashierId,
            terminalId,
            negativeInventoryApprovalId = null
        })    {

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

            let subtotal = 0;

            const products = [];

            /**
             * ====================================
             * LOAD PRODUCTS
             * ====================================
             */
            const productIds =
                items.map(x => x.productId);

            const [productRows] =
                await connection.query(
                    `
                    SELECT
                        p.id,
                        p.sku,
                        p.name,
                        COALESCE(
                            ib.quantity_on_hand,
                            0
                        ) quantity_on_hand
                    FROM products p
                    LEFT JOIN inventory_balances ib
                        ON ib.product_id = p.id
                    WHERE p.id IN (?)
                    `,
                    [productIds]
                );

            const productMap = {};

            for (const row of productRows) {

                productMap[row.id] = row;

            }

            /**
             * ====================================
             * LOAD PRICES
             * ====================================
             */
            const priceMap =
                await priceService.getCurrentPrices(
                    productIds
                );

            /**
             * ====================================
             * BUILD CART
             * ====================================
             */
            for (const item of items) {

                const product =
                    productMap[item.productId];

                if (!product) {

                    throw new Error(
                        `Product not found: ${item.productId}`
                    );

                }

                const unitPrice =
                    priceMap[item.productId];

                if (!unitPrice) {

                    throw new Error(
                        `No active price found for ${item.productId}`
                    );

                }

                const lineTotal =
                    unitPrice *
                    Number(item.quantity);

                subtotal += lineTotal;

                const availableQty =
                    Number(product.quantity_on_hand);

                const requestedQty =
                    Number(item.quantity);

                if (
                    availableQty <
                    requestedQty
                ) {

                    if (
                        !negativeInventoryApprovalId
                    ) {

                        throw new Error(
                            `Manager approval required for negative inventory sale of ${product.name}`
                        );

                    }

                    await negativeInventoryApprovalService
                        .validateApproval(
                            negativeInventoryApprovalId,
                            product.id,
                            requestedQty
                        );
                }

                products.push({
                    ...product,
                    quantity:
                        Number(item.quantity),
                    unitPrice,
                    lineTotal
                });

            }

            /**
             * ====================================
             * CREATE HEADER
             * ====================================
             */
            const transactionId =
                idGenerator.transactionId();

            const transactionNo =
                `TXN-${Date.now()}`;

            await connection.query(
                `
                INSERT INTO transaction_headers
                (
                    id,
                    transaction_no,
                    transaction_type,
                    payment_method,
                    customer_id,
                    subtotal,
                    total_amount,
                    transaction_datetime,
                    terminal_id,
                    cashier_id,
                    sync_status
                )
                VALUES
                (
                    ?, ?, 'SALE',
                    'CUSTOMER_CREDIT',
                    ?, ?, ?, NOW(),
                    ?, ?, 'SYNCED'
                )
                `,
                [
                    transactionId,
                    transactionNo,
                    customerId,
                    subtotal,
                    subtotal,
                    terminalId,
                    cashierId
                ]
            );

            /**
             * ====================================
             * CREATE LINES
             * INVENTORY MOVEMENTS
             * ====================================
             */
            for (const product of products) {

                await connection.query(
                    `
                    INSERT INTO transaction_lines
                    (
                        id,
                        transaction_id,
                        product_id,
                        sku,
                        product_name,
                        quantity,
                        unit_price,
                        line_total
                    )
                    VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        idGenerator.transactionLineId(),
                        transactionId,
                        product.id,
                        product.sku,
                        product.name,
                        product.quantity,
                        product.unitPrice,
                        product.lineTotal
                    ]
                );

                await inventoryService
                    .deductInventoryInTransaction(
                        connection,
                        product.id,
                        product.quantity,
                        transactionId,
                        cashierId,
                        negativeInventoryApprovalId
                    );

                if (
                    negativeInventoryApprovalId
                ) {

                    await negativeInventoryApprovalService
                        .consumeApproval(
                            connection,
                            negativeInventoryApprovalId,
                            product.quantity
                        );

                }
            }

            /**
             * ====================================
             * CONSUME CREDIT
             * ====================================
             */
            await creditService
                .consumeCreditInTransaction(
                    connection,
                    customerId,
                    subtotal,
                    transactionId,
                    'POS Sale',
                    cashierId
                );

            await connection.commit();

            return {
                transactionId,
                transactionNo,
                totalAmount:
                    subtotal
            };

        } catch (err) {

            await connection.rollback();
            throw err;

        } finally {

            connection.release();

        }

    }

}

module.exports = new CheckoutService();