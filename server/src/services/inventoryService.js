const db = require('../../db');
const { ulid } = require('ulid');

class InventoryService {

    async createMovement({
        productId,
        movementType,
        quantity,
        referenceId = null,
        remarks = null,
        userId = null
    }) {

        const movementId = ulid();

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
                    remarks,
                    created_by,
                    movement_datetime
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
                `,
                [
                    movementId,
                    productId,
                    movementType,
                    quantity,
                    referenceId,
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