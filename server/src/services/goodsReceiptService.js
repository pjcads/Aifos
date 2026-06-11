const db = require('../../db');
const idGenerator = require('../utils/idGenerator');
const numberGeneratorService = require('./numberGeneratorService');

class GoodsReceiptService {

    async createReceipt({
        supplierName,
        receiptDate,
        remarks,
        receivedBy,
        items
    }) {

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

            const receiptId =
                idGenerator.goodsReceiptId();

            const receiptNo =
                await numberGeneratorService
                    .generateGoodsReceiptNo();

            await connection.query(
                `
                INSERT INTO goods_receipt_headers
                (
                    id,
                    receipt_no,
                    supplier_name,
                    receipt_date,
                    remarks,
                    received_by
                )
                VALUES
                (?, ?, ?, ?, ?, ?)
                `,
                [
                    receiptId,
                    receiptNo,
                    supplierName,
                    receiptDate,
                    remarks,
                    receivedBy
                ]
            );

            for (const item of items) {

                await connection.query(
                    `
                    INSERT INTO goods_receipt_lines
                    (
                        id,
                        goods_receipt_id,
                        product_id,
                        quantity,
                        unit_cost
                    )
                    VALUES
                    (?, ?, ?, ?, ?)
                    `,
                    [
                        idGenerator.goodsReceiptLineId(),
                        receiptId,
                        item.productId,
                        item.quantity,
                        item.unitCost || 0
                    ]
                );

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
                        'RECEIPT',
                        ?,
                        ?,
                        ?,
                        ?,
                        NOW()
                    )
                    `,
                    [
                        idGenerator.inventoryMovementId(),
                        item.productId,
                        item.quantity,
                        receiptId,
                        'Goods Receipt',
                        receivedBy
                    ]
                );

                const [rows] =
                    await connection.query(
                        `
                        SELECT product_id
                        FROM inventory_balances
                        WHERE product_id = ?
                        `,
                        [item.productId]
                    );

                if (
                    rows.length === 0
                ) {

                    await connection.query(
                        `
                        INSERT INTO
                        inventory_balances
                        (
                            product_id,
                            quantity_on_hand,
                            last_updated
                        )
                        VALUES
                        (
                            ?, ?, NOW()
                        )
                        `,
                        [
                            item.productId,
                            item.quantity
                        ]
                    );

                } else {

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
                                item.quantity,
                                item.productId
                            ]
                        );

                    if (
                        result.affectedRows === 0
                    ) {

                        throw new Error(
                            `Inventory balance record not found for product ${item.productId}`
                        );

                    }

                }

            }

            await connection.commit();

            return {
                receiptId,
                receiptNo
            };

        } catch (err) {

            await connection.rollback();
            throw err;

        } finally {

            connection.release();

        }

    }

}

module.exports =  new GoodsReceiptService();