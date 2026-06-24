const db = require('../../db');
const idGenerator = require('../utils/idGenerator');

class InventoryService {

        async deductInventoryInTransaction(
            connection,
            productId,
            quantity,
            referenceId,
            userId,
            approvalId = null
        ) {

        const [rows] =
            await connection.query(
                `
                SELECT quantity_on_hand
                FROM inventory_balances
                WHERE product_id = ?
                `,
                [productId]
            );

        let currentQty = 0;

        if (rows.length > 0) {
            currentQty =
                Number(rows[0].quantity_on_hand);
        }

        const movementId =
            idGenerator.inventoryMovementId();

        await connection.query(
            `
            INSERT INTO inventory_movements
            (
                id,
                product_id,
                movement_type,
                quantity_change,
                reference_id,
                approval_id,
                remarks,
                created_by,
                movement_datetime
            )
            VALUES
            (
                ?, ?,
                'SALE',
                ?,
                ?, ?,
                ?, ?,
                NOW()
            )
            `,
            [
                movementId,
                productId,
                quantity * -1,
                referenceId,
                approvalId,
                'POS Sale',
                userId
            ]
        );

        if (rows.length === 0) {

            await connection.query(
                `
                INSERT INTO inventory_balances
                (
                    product_id,
                    quantity_on_hand,
                    last_updated
                )
                VALUES
                (
                    ?,
                    ?,
                    NOW()
                )
                `,
                [
                    productId,
                    quantity * -1
                ]
            );

        } else {

            const [result] =
                await connection.query(
                    `
                    UPDATE inventory_balances
                    SET
                        quantity_on_hand =
                            quantity_on_hand - ?,
                        last_updated = NOW()
                    WHERE product_id = ?
                    `,
                    [
                        quantity,
                        productId
                    ]
                );

            if (
                result.affectedRows === 0
            ) {

                throw new Error(
                    `Inventory balance record not found for product ${productId}`
                );

            }
        }

        return movementId;
    }

    async refundInventoryInTransaction(
        connection,
        productId,
        quantity,
        referenceId,
        userId
    ) {

        const movementId =
            idGenerator.inventoryMovementId();

        await connection.query(
            `
            INSERT INTO inventory_movements
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
                'REFUND',
                ?,
                ?, ?, ?,
                NOW()
            )
            `,
            [
                movementId,
                productId,
                quantity,
                referenceId,
                'POS Refund',
                userId
            ]
        );

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
                    productId
                ]
            );

        if (
            result.affectedRows === 0
        ) {

            throw new Error(
                `Inventory balance record not found for product ${productId}`
            );

        }
    } 
    
    async createMovement({
        productId,
        movementType,
        quantity,
        referenceId = null,
        approvalId = null,
        remarks = null,
        userId = null
    }) {

        const movementId =
            idGenerator.inventoryMovementId();

        const connection = await db.getConnection();

        try {

            await connection.beginTransaction();

            await connection.query(
                `
                INSERT INTO inventory_movements
                (
                    id,
                    product_id,
                    movement_type,
                    quantity_change,
                    reference_id,
                    approval_id
                    remarks,
                    created_by,
                    movement_datetime
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
                `,
                [
                    movementId,
                    productId,
                    movementType,
                    quantity,
                    referenceId,
                    approvalId,
                    remarks,
                    userId
                ]
            );

            const [balances] = await connection.query(
                `
                SELECT quantity_on_hand
                FROM inventory_balances
                WHERE product_id = ?
                `,
                [productId]
            );

            if (balances.length === 0) {

                await connection.query(
                    `
                    INSERT INTO inventory_balances
                    (
                        product_id,
                        quantity_on_hand,
                        last_updated
                    )
                    VALUES (?, ?, NOW())
                    `,
                    [productId, quantity]
                );

            } else {

                await connection.query(
                    `
                    UPDATE inventory_balances
                    SET
                        quantity_on_hand = quantity_on_hand + ?,
                        last_updated = NOW()
                    WHERE product_id = ?
                    `,
                    [quantity, productId]
                );
            }

            await connection.commit();

            return movementId;

        } catch (error) {

            await connection.rollback();
            throw error;

        } finally {

            connection.release();

        }
    }    
}

module.exports = new InventoryService();