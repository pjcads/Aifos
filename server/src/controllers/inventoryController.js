const db = require('../../db');
const inventoryService = require('../services/inventoryService');

exports.getBalances = async (req, res) => {

    try {

        const [rows] = await db.query(
            `
            SELECT
                p.id,
                p.barcode,
                p.sku,
                p.barcode,
                p.name,
                c.category_name,
                p.unit_of_measure,
                IFNULL(
                    b.quantity_on_hand,
                    0
                ) quantity_on_hand
            FROM products p
            LEFT JOIN product_categories c
                ON c.id = p.category_id
            LEFT JOIN inventory_balances b
                ON p.id = b.product_id
            ORDER BY p.name
            `
        );

        res.json(rows);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

exports.getMovements = async (req, res) => {

    try {

        const [rows] = await db.query(
            `
            SELECT *
            FROM inventory_movements
            ORDER BY movement_datetime DESC
            LIMIT 500
            `
        );

        res.json(rows);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

exports.createReceipt = async (req, res) => {

    try {

        const { referenceNo, remarks, items } = req.body;

        for (const item of items) {

            await inventoryService.createMovement({
                productId: item.productId,
                movementType: 'RECEIPT',
                quantity: Number(item.quantity),
                referenceId: referenceNo,
                remarks,
                userId: req.user.id
            });

        }

        res.json({
            success: true,
            message: 'Inventory receipt created'
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};

exports.createAdjustment = async (req, res) => {

    try {

        const { reason, items } = req.body;

        for (const item of items) {

            const quantity =
                item.adjustmentType === 'OUT'
                    ? -Math.abs(item.quantity)
                    : Math.abs(item.quantity);

            const movementType =
                item.adjustmentType === 'OUT'
                    ? 'ADJUSTMENT_OUT'
                    : 'ADJUSTMENT_IN';

            await inventoryService.createMovement({
                productId: item.productId,
                movementType,
                quantity,
                remarks: reason,
                userId: req.user.id
            });

        }

        res.json({
            success: true,
            message: 'Inventory adjustment created'
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
};