const db = require('../../db');
const idGenerator = require('../utils/idGenerator');

class WalletService {

    async createWallet({
        customerId = null,
        accountName,
        accountType = 'GENERAL',
        barcode = null,
        barcodeType = null
    }) {

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

            const walletId =
                idGenerator.walletAccountId();

            if (
                !barcode ||
                !barcodeType
            ) {

                throw new Error(
                    'Barcode and barcode type are required'
                );

            }

            await connection.query(
                `
                INSERT INTO wallet_accounts
                (
                    id,
                    customer_id,
                    wallet_barcode,
                    account_name,
                    account_type,
                    current_balance,
                    status
                )
                VALUES
                (
                    ?, ?, ?, ?, ?,
                    0,
                    'ACTIVE'
                )
                `,
                [
                    walletId,
                    customerId,
                    barcode,
                    accountName,
                    accountType
                ]
            );

            await connection.query(
                `
                INSERT INTO wallet_account_barcodes
                (
                    id,
                    wallet_id,
                    barcode,
                    barcode_type,
                    is_primary
                )
                VALUES
                (
                    ?, ?, ?, ?, 1
                )
                `,
                [
                    idGenerator.walletBarcodeId(),
                    walletId,
                    barcode,
                    barcodeType
                ]
            );

            await connection.commit();

            return {
                walletId,
                barcode
            };

        } catch (err) {

            await connection.rollback();
            throw err;

        } finally {

            connection.release();

        }

    }

    async addBarcode(
        walletId,
        barcode,
        barcodeType
    ) {

        await db.query(
            `
            INSERT INTO
            wallet_account_barcodes
            (
                id,
                wallet_id,
                barcode,
                barcode_type
            )
            VALUES
            (
                ?, ?, ?, ?
            )
            `,
            [
                idGenerator.walletBarcodeId(),
                walletId,
                barcode,
                barcodeType
            ]
        );

    }

    async getWalletByBarcode(
        barcode
    ) {

        const [rows] =
            await db.query(
                `
                SELECT
                    w.*
                FROM wallet_accounts w
                INNER JOIN
                    wallet_account_barcodes wb
                        ON wb.wallet_id = w.id
                WHERE wb.barcode = ?
                AND wb.is_active = 1
                `,
                [barcode]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Wallet not found'
            );

        }

        return rows[0];

    }

    async topupWallet(
        barcode,
        amount,
        remarks,
        userId
    ) {

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

            const [walletRows] =
                await connection.query(
                    `
                    SELECT
                        w.*
                    FROM wallet_accounts w
                    INNER JOIN
                        wallet_account_barcodes wb
                            ON wb.wallet_id = w.id
                    WHERE wb.barcode = ?
                    AND wb.is_active = 1
                    `,
                    [barcode]
                );

            if (
                walletRows.length === 0
            ) {

                throw new Error(
                    'Wallet not found'
                );

            }

            const wallet =
                walletRows[0];

            if (
                wallet.status !==
                'ACTIVE'
            ) {

                throw new Error(
                    'Wallet is not active'
                );

            }

            await connection.query(
                `
                UPDATE wallet_accounts
                SET current_balance =
                    current_balance + ?
                WHERE id = ?
                `,
                [
                    amount,
                    wallet.id
                ]
            );

            await connection.query(
                `
                INSERT INTO
                wallet_transactions
                (
                    id,
                    wallet_id,
                    transaction_type,
                    amount,
                    remarks,
                    created_by
                )
                VALUES
                (
                    ?, ?,
                    'TOPUP',
                    ?, ?, ?
                )
                `,
                [
                    idGenerator.walletTransactionId(),
                    wallet.id,
                    amount,
                    remarks,
                    userId
                ]
            );

            await connection.commit();

        } catch (err) {

            await connection.rollback();
            throw err;

        } finally {

            connection.release();

        }

    }

    async consumeWalletInTransaction(
        connection,
        walletBarcode,
        amount,
        transactionId,
        remarks,
        userId
    ) {

        const [walletRows] =
            await connection.query(
                `
                SELECT
                    w.*
                FROM wallet_accounts w
                INNER JOIN
                    wallet_account_barcodes wb
                        ON wb.wallet_id = w.id
                WHERE wb.barcode = ?
                AND wb.is_active = 1
                `,
                [walletBarcode]
            );

        if (
            walletRows.length === 0
        ) {

            throw new Error(
                'Wallet not found'
            );

        }

        const wallet =
            walletRows[0];

        if (
            wallet.status !==
            'ACTIVE'
        ) {

            throw new Error(
                'Wallet is not active'
            );

        }

        if (
            Number(wallet.current_balance)
            <
            Number(amount)
        ) {

            throw new Error(
                'Insufficient wallet balance'
            );

        }

        await connection.query(
            `
            UPDATE wallet_accounts
            SET current_balance =
                current_balance - ?
            WHERE id = ?
            `,
            [
                amount,
                wallet.id
            ]
        );

        await connection.query(
            `
            INSERT INTO
            wallet_transactions
            (
                id,
                wallet_id,
                transaction_type,
                amount,
                reference_id,
                remarks,
                created_by
            )
            VALUES
            (
                ?, ?,
                'PURCHASE',
                ?, ?, ?, ?
            )
            `,
            [
                idGenerator.walletTransactionId(),
                wallet.id,
                amount * -1,
                transactionId,
                remarks,
                userId
            ]
        );

        return wallet;

    }    

    async refundWalletInTransaction(
        connection,
        walletId,
        amount,
        transactionId,
        remarks,
        userId
    ) {

        const [walletRows] =
            await connection.query(
                `
                SELECT *
                FROM wallet_accounts
                WHERE id = ?
                `,
                [walletId]
            );

        if (
            walletRows.length === 0
        ) {

            throw new Error(
                'Wallet not found'
            );

        }

        await connection.query(
            `
            UPDATE wallet_accounts
            SET current_balance =
                current_balance + ?
            WHERE id = ?
            `,
            [
                amount,
                walletId
            ]
        );

        await connection.query(
            `
            INSERT INTO wallet_transactions
            (
                id,
                wallet_id,
                transaction_type,
                amount,
                reference_id,
                remarks,
                created_by
            )
            VALUES
            (
                ?, ?,
                'REFUND',
                ?, ?, ?, ?
            )
            `,
            [
                idGenerator.walletTransactionId(),
                walletId,
                amount,
                transactionId,
                remarks,
                userId
            ]
        );

    } 
    
    async validateWalletBalance(
        walletBarcode,
        amount
    ) {

        const [walletRows] =
            await db.query(
                `
                SELECT
                    w.*
                FROM wallet_accounts w
                INNER JOIN
                    wallet_account_barcodes wb
                        ON wb.wallet_id = w.id
                WHERE wb.barcode = ?
                AND wb.is_active = 1
                `,
                [walletBarcode]
            );

        if (
            walletRows.length === 0
        ) {

            throw new Error(
                'Wallet not found'
            );

        }

        const wallet =
            walletRows[0];

        if (
            wallet.status !==
            'ACTIVE'
        ) {

            throw new Error(
                'Wallet is not active'
            );

        }

        if (
            Number(wallet.current_balance)
            <
            Number(amount)
        ) {

            throw new Error(
                'Insufficient wallet balance'
            );

        }

        return wallet;

    }  

}

module.exports = new WalletService();