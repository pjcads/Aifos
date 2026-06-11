const db = require('../../db');
const creditService = require('./creditService');
const idGenerator = require('../utils/idGenerator');
const priceService = require('./priceService');
const inventoryService = require('./inventoryService');
const negativeInventoryApprovalService = require('./negativeInventoryApprovalService');
const numberGeneratorService = require('./numberGeneratorService');
const walletService = require('./walletService');
const cashierSessionService = require('./cashierSessionService');

class CheckoutService {

        async createSale({
            paymentMethod,
            customerId = null,
            walletBarcode = null,
            items,
            cashierId,
            terminalId,
            negativeInventoryApprovalId = null,
            amountTendered = null
        })   {

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

            /**
             * ====================================
             * VALIDATE ACTIVE SESSION
             * ====================================
             */
            const activeSession =
                await cashierSessionService
                    .getActiveSession(
                        terminalId
                    );

            if (!activeSession) {

                throw new Error(
                    `No active cashier session for terminal ${terminalId}`
                );

            }

            if (
                ![
                    'CUSTOMER_CREDIT',
                    'XEMCO_WALLET',
                    'CASH'
                ].includes(paymentMethod)
            ) {

                throw new Error(
                    'Invalid payment method'
                );

            }            

            let subtotal = 0;

            const products = [];

            /**
             * ====================================
             * LOAD PRODUCTS
             * ====================================
             */
            const productIds =
                items.map(x => x.productId);

            /*
            * Missing inventory balance
            * is treated as zero inventory.
            * inventoryService will create
            * the balance row if needed.
            */                    
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
             * VALIDATE PAYMENT
             * ====================================
             */
            if (
                paymentMethod === 'CUSTOMER_CREDIT'
            ) {

                if (!customerId) {

                    throw new Error(
                        'Customer is required for credit sales'
                    );

                }

            }
            else if (
                paymentMethod === 'XEMCO_WALLET'
            ) {

                if (!walletBarcode) {

                    throw new Error(
                        'Wallet barcode is required'
                    );

                }

                await walletService
                    .validateWalletBalance(
                        walletBarcode,
                        subtotal
                    );

            }
            else if (
                paymentMethod === 'CASH'
            ) {

                if (
                    amountTendered === null
                ) {

                    throw new Error(
                        'Amount tendered is required'
                    );

                }

                if (
                    Number(amountTendered)
                    <
                    Number(subtotal)
                ) {

                    throw new Error(
                        'Insufficient cash tendered'
                    );

                }

            }            

            /**
             * ====================================
             * CREATE HEADER
             * ====================================
             */

            let changeAmount = null;

            if (
                paymentMethod ===
                'CASH'
            ) {

                changeAmount =
                    Number(amountTendered)
                    -
                    Number(subtotal);

            }

            const transactionId =
                idGenerator.transactionId();

            const transactionNo =
                await numberGeneratorService
                    .generateTransactionNo();

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
                    sync_status,
                    session_id,
                    amount_tendered,
                    change_amount                    
                )
                VALUES
                (
                    ?, ?, 'SALE',
                    ?,
                    ?, ?, ?, NOW(),
                    ?, ?, 'SYNCED', ?, ?, ?
                )
                `,
                [
                    transactionId,
                    transactionNo,
                    paymentMethod,
                    customerId,
                    subtotal,
                    subtotal,
                    terminalId,
                    cashierId,
                    activeSession.id,
                    amountTendered,
                    changeAmount                    
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
            if (
                paymentMethod ===
                'CUSTOMER_CREDIT'
            ) {

                await creditService
                    .consumeCreditInTransaction(
                        connection,
                        customerId,
                        subtotal,
                        transactionId,
                        'POS Sale',
                        cashierId
                    );

            }
            else if (
                paymentMethod ===
                'XEMCO_WALLET'
            ) {

                await walletService
                    .consumeWalletInTransaction(
                        connection,
                        walletBarcode,
                        subtotal,
                        transactionId,
                        'POS Sale',
                        cashierId
                    );

            }

            await connection.commit();

            return {
                transactionId,
                transactionNo,
                totalAmount: subtotal
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