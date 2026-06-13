const db = require('../../db');
const idGenerator = require('../utils/idGenerator');

class NegativeInventoryApprovalService {

    async createApproval(
        {
            productId,
            approvedQuantity,
            remarks,
            requestedBy,
            approvedBy
        }
    ) {

        const approvalId =
            idGenerator.negativeInventoryApprovalId();

        await db.query(
            `
            INSERT INTO
            negative_inventory_approvals
            (
                id,
                product_id,
                requested_by,
                approved_by,
                approved_quantity,
                remarks,
                status,
                approved_at
            )
            VALUES
            (
                ?, ?, ?, ?,
                ?, ?,
                'APPROVED',
                NOW()
            )
            `,
            [
                approvalId,
                productId,
                requestedBy,
                approvedBy,
                approvedQuantity,
                remarks
            ]
        );

        return approvalId;
    }

    async validateApproval(
        approvalId,
        productId,
        quantity
    ) {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM negative_inventory_approvals
                WHERE id = ?
                `,
                [approvalId]
            );

        if (rows.length === 0) {

            throw new Error(
                'Negative inventory approval not found'
            );

        }

        const approval = rows[0];

        if (approval.status !== 'APPROVED') {

            throw new Error(
                'Negative inventory approval is not approved'
            );

        }

        if (approval.product_id !== productId) {

            throw new Error(
                'Approval product does not match'
            );

        }

        const remainingQuantity =
            Number(approval.approved_quantity)
            -
            Number(approval.used_quantity);

        if (remainingQuantity <= 0) {

            throw new Error(
                'Negative inventory approval has already been fully consumed'
            );

        }            

        if (
            remainingQuantity
            <
            Number(quantity)
        ) {

            throw new Error(
                `Approved quantity exceeded. Remaining approved quantity: ${remainingQuantity}`
            );

        }

        return approval;
    }  
    
    async consumeApproval(
        connection,
        approvalId,
        transactionId,
        quantity
    ) {

        await connection.query(
            `
            UPDATE negative_inventory_approvals
            SET used_quantity =
                used_quantity + ?
            WHERE id = ?
            `,
            [
                quantity,
                approvalId
            ]
        );

        await connection.query(
            `
            UPDATE negative_inventory_approvals
            SET status = 'USED'
            WHERE id = ?
            AND used_quantity >= approved_quantity
            `,
            [approvalId]
        );

        await connection.query(
            `
            INSERT INTO
            negative_inventory_approval_consumptions
            (
                id,
                approval_id,
                transaction_id,
                quantity
            )
            VALUES
            (
                ?, ?, ?, ?
            )
            `,
            [
                idGenerator
                    .negativeInventoryConsumptionId(),
                approvalId,
                transactionId,
                quantity
            ]
        );        

    } 
    
    async reverseApprovalConsumption(
        connection,
        transactionId
    ) {

        const [rows] =
            await connection.query(
                `
                SELECT *
                FROM negative_inventory_approval_consumptions
                WHERE transaction_id = ?
                `,
                [transactionId]
            );

        for (const row of rows) {

            await connection.query(
                `
                UPDATE negative_inventory_approvals
                SET
                    used_quantity =
                        used_quantity - ?
                WHERE id = ?
                `,
                [
                    row.quantity,
                    row.approval_id
                ]
            );

            await connection.query(
                `
                UPDATE negative_inventory_approvals
                SET status = 'APPROVED'
                WHERE id = ?
                AND used_quantity < approved_quantity
                `,
                [
                    row.approval_id
                ]
            );

        }

    }    
}

module.exports = new NegativeInventoryApprovalService();