const db = require('../../db');
const idGenerator = require('../utils/idGenerator');

class PayrollService {

    async generateBatch(
        periodFrom,
        periodTo,
        userId
    ) {

        const batchId =
            idGenerator.payrollBatchId();

        const batchNo =
            await this.generateBatchNumber(
                connection,
                periodTo
            );

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

            const [totals] =
                await connection.query(
                    `
                    SELECT
                        c.id customer_id,
                        c.name customer_name,
                        SUM(t.amount) deduction_amount
                    FROM customer_credit_transactions t
                    INNER JOIN customers c
                        ON c.id = t.customer_id
                    WHERE t.payroll_status = 'UNENDORSED'
                    AND t.created_at >= ?
                    AND t.created_at < DATE_ADD(?, INTERVAL 1 DAY)
                    GROUP BY c.id, c.name
                    `,
                    [
                        periodFrom,
                        periodTo
                    ]
                );

            if (totals.length === 0) {
                throw new Error(
                    'No unendorsed transactions found for selected payroll period'
                );
            }                

            let totalAmount = 0;

            for (const row of totals) {

                totalAmount +=
                    Number(row.deduction_amount);

            }

            await connection.query(
                `
                INSERT INTO payroll_batches
                (
                    id,
                    batch_no,
                    payroll_period_from,
                    payroll_period_to,
                    total_employees,
                    total_amount,
                    status,
                    created_by
                )
                VALUES
                (?, ?, ?, ?, ?, ?, 'DRAFT', ?)
                `,
                [
                    batchId,
                    batchNo,
                    periodFrom,
                    periodTo,
                    totals.length,
                    totalAmount,
                    userId
                ]
            );

            for (const row of totals) {

                await connection.query(
                    `
                    INSERT INTO
                    payroll_batch_details
                    (
                        id,
                        payroll_batch_id,
                        customer_id,
                        customer_name,
                        deduction_amount
                    )
                    VALUES
                    (?, ?, ?, ?, ?)
                    `,
                    [
                        idGenerator.payrollBatchDetailId(),
                        batchId,
                        row.customer_id,
                        row.customer_name,
                        row.deduction_amount
                    ]
                );
            }

            await connection.query(
                `
                UPDATE customer_credit_transactions
                SET
                    payroll_batch_id = ?,
                    payroll_status = 'BATCHED'
                WHERE payroll_status = 'UNENDORSED'
                AND payroll_batch_id IS NULL
                AND created_at >= ?
                AND created_at < DATE_ADD(?, INTERVAL 1 DAY)
                `,
                [
                    batchId,
                    periodFrom,
                    periodTo
                ]
            );
            await connection.commit();

            return batchId;

        } catch (err) {

            await connection.rollback();
            throw err;

        } finally {

            connection.release();

        }
    }

    async endorseBatch(
        batchId
    ) {

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

            const [batchRows] = await connection.query(
                `
                SELECT status
                FROM payroll_batches
                WHERE id = ?
                `,
                [batchId]
            );

            if (batchRows.length === 0) {
                throw new Error('Payroll batch not found');
            }

            if (batchRows[0].status === 'ENDORSED') {
                throw new Error(
                    'Payroll batch already endorsed'
                );
            }            

            const [details] =
                await connection.query(
                    `
                    SELECT *
                    FROM payroll_batch_details
                    WHERE payroll_batch_id = ?
                    `,
                    [batchId]
                );

            for (const detail of details) {

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
                        detail.deduction_amount,
                        detail.customer_id
                    ]
                );
            }

            await connection.query(
                `
                UPDATE customer_credit_transactions
                SET payroll_status = 'ENDORSED'
                WHERE payroll_batch_id = ?
                AND payroll_status = 'BATCHED'
                `,
                [batchId]
            );

            await connection.query(
                `
                UPDATE payroll_batches
                SET status = 'ENDORSED'
                WHERE id = ?
                `,
                [batchId]
            );

            await connection.commit();

        } catch (err) {

            await connection.rollback();
            throw err;

        } finally {

            connection.release();

        }
    }

    async generateBatchNumber(
        connection,
        periodTo
    ) {

        const payrollDate =
            periodTo.replaceAll('-', '');

        const [rows] =
            await connection.query(
                `
                SELECT batch_no
                FROM payroll_batches
                WHERE payroll_period_to = ?
                ORDER BY batch_no DESC
                LIMIT 1
                `,
                [periodTo]
            );

        let nextSequence = 1;

        if (rows.length > 0) {

            const lastBatchNo = rows[0].batch_no;

            const lastSequence =
                Number(
                    lastBatchNo.split('-')[2]
                );

            nextSequence =
                lastSequence + 1;
        }

        return `PAY-${payrollDate}-${String(nextSequence).padStart(3, '0')}`;
    }   
}

module.exports = new PayrollService();