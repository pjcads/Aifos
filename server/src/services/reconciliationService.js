const db = require('../../db');
const idGenerator = require('../utils/idGenerator');

class ReconciliationService {

    async reconcileApproval(
        approvalId,
        quantity,
        reconciliationType,
        remarks,
        userId
    ) {

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

            //
            // Load approval
            //

            const [approvalRows] =
                await connection.query(
                    `
                    SELECT *
                    FROM negative_inventory_approvals
                    WHERE id = ?
                    `,
                    [approvalId]
                );

            if (
                approvalRows.length === 0
            ) {

                throw new Error(
                    'Negative inventory approval not found'
                );

            }

            const approval =
                approvalRows[0];

            //
            // Validate remaining quantity
            //

            const remainingQuantity =
                Number(
                    approval.used_quantity
                )
                -
                Number(
                    approval.reconciled_quantity
                );

            if (
                Number(quantity)
                >
                remainingQuantity
            ) {

                throw new Error(
                    `Remaining unreconciled quantity is only ${remainingQuantity}`
                );

            }

            //
            // Create reconciliation record
            //

            const reconciliationId =
                idGenerator.inventoryReconciliationId();

            await connection.query(
                `
                INSERT INTO
                inventory_reconciliations
                (
                    id,
                    approval_id,
                    product_id,
                    reconciliation_type,
                    quantity,
                    remarks,
                    reconciled_by
                )
                VALUES
                (
                    ?, ?, ?, ?, ?, ?, ?
                )
                `,
                [
                    reconciliationId,
                    approval.id,
                    approval.product_id,
                    reconciliationType,
                    quantity,
                    remarks,
                    userId
                ]
            );

            //
            // Inventory movement
            //

            await connection.query(
                `
                INSERT INTO
                inventory_movements
                (
                    id,
                    product_id,
                    movement_type,
                    quantity_change,
                    reference_id,
                    remarks,
                    created_by,
                    movement_datetime
                )
                VALUES
                (
                    ?, ?,
                    'RECONCILIATION',
                    ?,
                    ?,
                    ?,
                    ?,
                    NOW()
                )
                `,
                [
                    idGenerator.inventoryMovementId(),
                    approval.product_id,
                    quantity,
                    reconciliationId,
                    remarks,
                    userId
                ]
            );

            //
            // Restore inventory
            //

            const [result] =
                await connection.query(
                    `
                    UPDATE inventory_balances
                    SET
                        quantity_on_hand =
                            quantity_on_hand + ?,
                        last_updated = NOW()
                    WHERE product_id = ?
                    `,
                    [
                        quantity,
                        approval.product_id
                    ]
                );

            if (
                result.affectedRows === 0
            ) {

                throw new Error(
                    `Inventory balance record not found for product ${approval.product_id}`
                );

            }
            //
            // Update approval
            //

            await connection.query(
                `
                UPDATE
                negative_inventory_approvals
                SET
                    reconciled_quantity =
                        reconciled_quantity + ?
                WHERE id = ?
                `,
                [
                    quantity,
                    approval.id
                ]
            );

            //
            // Reload approval
            //

            const [updatedRows] =
                await connection.query(
                    `
                    SELECT
                        used_quantity,
                        reconciled_quantity
                    FROM
                    negative_inventory_approvals
                    WHERE id = ?
                    `,
                    [approval.id]
                );

            const updated =
                updatedRows[0];

            const remaining =
                Number(updated.used_quantity)
                -
                Number(updated.reconciled_quantity);

            let reconciliationStatus =
                'PARTIALLY_RECONCILED';

            if (
                Number(updated.reconciled_quantity)
                === 0
            ) {

                reconciliationStatus =
                    'OPEN';

            }

            if (
                remaining <= 0
            ) {

                reconciliationStatus =
                    'FULLY_RECONCILED';

            }

            await connection.query(
                `
                UPDATE
                negative_inventory_approvals
                SET
                    reconciliation_status = ?
                WHERE id = ?
                `,
                [
                    reconciliationStatus,
                    approval.id
                ]
            );

            await connection.commit();

            return {
                reconciliationId,
                reconciliationStatus
            };

        } catch (err) {

            await connection.rollback();
            throw err;

        } finally {

            connection.release();

        }

    }

}

module.exports =
    new ReconciliationService();