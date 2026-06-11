const db = require('../../db');
const idGenerator = require('../utils/idGenerator');

class CreditService {

    async getAvailableCredit(customerId) {

        const [rows] = await db.query(
            `
            SELECT
                credit_limit,
                current_cycle_used_credit
            FROM customers
            WHERE id = ?
            `,
            [customerId]
        );

        if (rows.length === 0) {
            throw new Error('Customer not found');
        }

        const customer = rows[0];

        return (
            Number(customer.credit_limit) -
            Number(customer.current_cycle_used_credit)
        );
    }

    async consumeCredit(
        customerId,
        amount,
        referenceId = null,
        remarks = null,
        userId = null
    ) {

        const availableCredit =
            await this.getAvailableCredit(customerId);

        if (amount > availableCredit) {
            throw new Error(
                'Insufficient available credit'
            );
        }

        const transactionId =
            idGenerator.creditTransactionId();

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

            await connection.query(
                `
                INSERT INTO customer_credit_transactions
                (
                    id,
                    customer_id,
                    transaction_type,
                    amount,
                    reference_id,
                    remarks,
                    created_by
                )
                VALUES (?, ?, 'PURCHASE', ?, ?, ?, ?)
                `,
                [
                    transactionId,
                    customerId,
                    amount,
                    referenceId,
                    remarks,
                    userId
                ]
            );

            await connection.query(
                `
                UPDATE customers
                SET current_cycle_used_credit =
                    current_cycle_used_credit + ?
                WHERE id = ?
                `,
                [
                    amount,
                    customerId
                ]
            );

            await connection.commit();

            return transactionId;

        } catch (err) {

            await connection.rollback();
            throw err;

        } finally {

            connection.release();

        }
    }

    async consumeCreditInTransaction(
        connection,
        customerId,
        amount,
        referenceId = null,
        remarks = null,
        userId = null
    ) {

        const [rows] = await connection.query(
            `
            SELECT
                credit_limit,
                current_cycle_used_credit
            FROM customers
            WHERE id = ?
            `,
            [customerId]
        );

        if (rows.length === 0) {
            throw new Error('Customer not found');
        }

        const customer = rows[0];

        const availableCredit =
            Number(customer.credit_limit) -
            Number(customer.current_cycle_used_credit);

        if (amount > availableCredit) {
            throw new Error(
                'Insufficient available credit'
            );
        }

        const transactionId =
            idGenerator.creditTransactionId();

        await connection.query(
            `
            INSERT INTO customer_credit_transactions
            (
                id,
                customer_id,
                transaction_type,
                amount,
                reference_id,
                remarks,
                created_by
            )
            VALUES
            (?, ?, 'PURCHASE', ?, ?, ?, ?)
            `,
            [
                transactionId,
                customerId,
                amount,
                referenceId,
                remarks,
                userId
            ]
        );

        await connection.query(
            `
            UPDATE customers
            SET current_cycle_used_credit =
                current_cycle_used_credit + ?
            WHERE id = ?
            `,
            [
                amount,
                customerId
            ]
        );

        return transactionId;
    }  
    
    async refundCreditInTransaction(
        connection,
        customerId,
        amount,
        refundTransactionId,
        originalTransactionId,
        remarks,
        userId
    ) {

        const transactionId =
            idGenerator.creditTransactionId();

        await connection.query(
            `
            INSERT INTO
            customer_credit_transactions
            (
                id,
                customer_id,
                transaction_type,
                amount,
                reference_id,
                original_transaction_id,
                remarks,
                created_by
            )
            VALUES
            (
                ?,
                ?,
                'REFUND',
                ?,
                ?,
                ?,
                ?,
                ?
            )
            `,
            [
                transactionId,
                customerId,
                amount * -1,
                refundTransactionId,
                originalTransactionId,
                remarks,
                userId
            ]
        );

        await connection.query(
            `
            UPDATE customers
            SET current_cycle_used_credit =
                GREATEST(
                    0,
                    current_cycle_used_credit - ?
                )
            WHERE id = ?
            `,
            [
                amount,
                customerId
            ]
        );

    }    
}

module.exports = new CreditService();