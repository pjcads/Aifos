const db = require('../../db');

class SyncService {

    async getMasterData() {

        const [products] =
            await db.query(
                `
                SELECT *
                FROM products
                `
            );

        const [prices] =
            await db.query(
                `
                SELECT *
                FROM product_prices
                WHERE is_active = 1
                `
            );

        const [customers] =
            await db.query(
                `
                SELECT *
                FROM customers
                `
            );

        const [wallets] =
            await db.query(
                `
                SELECT *
                FROM wallet_accounts
                `
            );

        const [walletBarcodes] =
            await db.query(
                `
                SELECT *
                FROM wallet_account_barcodes
                WHERE is_active = 1
                `
            );

        return {

            products,

            prices,

            customers,

            wallets,

            walletBarcodes

        };

    }

    async transactionExists(
        transactionId
    ) {

        const [rows] =
            await db.query(
                `
                SELECT id
                FROM transaction_headers
                WHERE id = ?
                `,
                [transactionId]
            );

        return rows.length > 0;

    }

    async uploadSale({
        transactionHeader,
        transactionLines
    }) {

        const exists =
            await this.transactionExists(
                transactionHeader.id
            );

        if (exists) {

            return {

                uploaded: false,

                reason:
                    'Transaction already exists'

            };

        }

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

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
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?,
                    'SYNCED'
                )
                `,
                [
                    transactionHeader.id,
                    transactionHeader.transaction_no,
                    transactionHeader.transaction_type,
                    transactionHeader.payment_method,
                    transactionHeader.customer_id,
                    transactionHeader.subtotal,
                    transactionHeader.total_amount,
                    transactionHeader.transaction_datetime,
                    transactionHeader.terminal_id,
                    transactionHeader.cashier_id
                ]
            );

            for (
                const line
                of transactionLines
            ) {

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
                    (
                        ?, ?, ?, ?, ?,
                        ?, ?, ?
                    )
                    `,
                    [
                        line.id,
                        transactionHeader.id,
                        line.product_id,
                        line.sku,
                        line.product_name,
                        line.quantity,
                        line.unit_price,
                        line.line_total
                    ]
                );

            }

            await connection.commit();

            return {

                uploaded: true

            };

        } catch (err) {

            await connection.rollback();

            throw err;

        } finally {

            connection.release();

        }

    }

    async uploadTransactions({
        transactionHeaders,
        transactionLines
    }) {

        let uploaded = 0;
        let duplicates = 0;
        let failed = 0;

        const errors = [];
        const uploadedIds = [];
        const duplicateIds = [];

        for (
            const header
            of transactionHeaders
        ) {

            try {

                const exists =
                    await this.transactionExists(
                        header.id
                    );

                if (exists) {

                    duplicates++;

                    duplicateIds.push(
                        header.id
                    );

                    continue;

                }

                const lines =
                    transactionLines.filter(
                        x =>
                            x.transaction_id ===
                            header.id
                    );

                await this.uploadSale({

                    transactionHeader:
                        header,

                    transactionLines:
                        lines

                });

                uploaded++;

                uploadedIds.push(
                    header.id
                );

            } catch (err) {

                failed++;
                errors.push({
                    transactionId: header.id,
                    error: err.message
                });

            }

        }

        return {

            uploaded,
            duplicates,
            failed,

            uploadedIds,

            duplicateIds,

            errors

        };

    }

}

module.exports = new SyncService();