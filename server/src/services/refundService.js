const db = require('../../db');
const idGenerator = require('../utils/idGenerator');
const creditService = require('./creditService');
const inventoryService = require('./inventoryService');
const numberGeneratorService = require('./numberGeneratorService');
const walletService = require('./walletService');
const negativeInventoryApprovalService = require('./negativeInventoryApprovalService');

class RefundService {

        async refundTransaction(
            transactionId,
            refundReason,
            userId
        ) {

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

            if (
                !refundReason ||
                refundReason.trim().length === 0
            ) {

                throw new Error(
                    'Refund reason is required'
                );

            }

            const [headerRows] =
                await connection.query(
                    `
                    SELECT *
                    FROM transaction_headers
                    WHERE id = ?
                    `,
                    [transactionId]
                );

            if (headerRows.length === 0) {

                throw new Error(
                    'Transaction not found'
                );

            }

            const original =
                headerRows[0];

            if (
                original.transaction_type ===
                'REFUND'
            ) {

                throw new Error(
                    'Cannot refund a refund transaction'
                );

            }

            if (
                original.refund_status ===
                'FULLY_REFUNDED'
            ) {

                throw new Error(
                    'Transaction already refunded'
                );

            }

            const [lines] =
                await connection.query(
                    `
                    SELECT *
                    FROM transaction_lines
                    WHERE transaction_id = ?
                    `,
                    [transactionId]
                );

            const refundId =
                idGenerator.transactionId();

            const refundNo =
                await numberGeneratorService
                    .generateRefundNo();

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
                    original_transaction_id,
                    refund_reason
                )
                    VALUES
                (
                    ?, ?,
                    'REFUND',
                    ?,
                    ?,
                    ?, ?,
                    NOW(),
                    ?,
                    ?,
                    'SYNCED',
                    ?,?
                )
                `,
                [
                    refundId,
                    refundNo,
                    original.payment_method,
                    original.customer_id,
                    original.subtotal,
                    original.total_amount,
                    original.terminal_id,
                    userId,
                    original.id,
                    refundReason
                ]
            );

            for (const line of lines) {

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
                        line_total,
                        original_transaction_line_id
                    )
                    VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        idGenerator.transactionLineId(),
                        refundId,
                        line.product_id,
                        line.sku,
                        line.product_name,
                        line.quantity,
                        line.unit_price,
                        line.line_total,
                        line.id
                    ]
                );

                await inventoryService
                    .refundInventoryInTransaction(
                        connection,
                        line.product_id,
                        line.quantity,
                        refundId,
                        userId
                    );

            }

            if (
                original.payment_method ===
                'CUSTOMER_CREDIT'
            ) {

                await creditService
                    .refundCreditInTransaction(
                        connection,
                        original.customer_id,
                        original.total_amount,
                        refundId,
                        original.id,
                        refundReason,
                        userId
                    );

            }
            else if (
                original.payment_method ===
                'XEMCO_WALLET'
            ) {

                const [walletRows] =
                    await connection.query(
                        `
                        SELECT *
                        FROM wallet_transactions
                        WHERE reference_id = ?
                        AND transaction_type = 'PURCHASE'
                        ORDER BY created_at ASC
                        LIMIT 1
                        `,
                        [original.id]
                    );

                if (
                    walletRows.length === 0
                ) {

                    throw new Error(
                        'Original wallet transaction not found'
                    );

                }

                await walletService
                    .refundWalletInTransaction(
                        connection,
                        walletRows[0].wallet_id,
                        original.total_amount,
                        refundId,
                        refundReason,
                        userId
                    );

            }
            await connection.query(
                `
                UPDATE transaction_headers
                SET refund_status =
                    'FULLY_REFUNDED'
                WHERE id = ?
                `,
                [original.id]
            );

            await negativeInventoryApprovalService
                .reverseApprovalConsumption(
                    connection,
                    original.id
                );
                            
            await connection.commit();

            return {
                refundId,
                refundNo
            };

        } catch (err) {

            await connection.rollback();
            throw err;

        } finally {

            connection.release();

        }

    }

}

module.exports = new RefundService();