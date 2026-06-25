const db = require('../../db');

const inventoryService =
    require('../services/inventoryService');

const queryHelper =
    require('../utils/queryHelper');

const responseHelper =
    require('../utils/responseHelper');

const sortableColumns =
{
    barcode:
        'p.barcode',

    sku:
        'p.sku',

    name:
        'p.name',

    category_name:
        'c.category_name',

    unit_of_measure:
        'p.unit_of_measure',

    quantity_on_hand:
        'b.quantity_on_hand'
};

const searchableColumns =
[
    'p.barcode',
    'p.sku',
    'p.name',
    'c.category_name'
];

exports.getBalances = async (req, res) => {

    const query =
        queryHelper.build(
            req,
            sortableColumns
        );

    try {

        const result =
            await inventoryService.getBalances(
                query,
                searchableColumns
            );

        return responseHelper.successPaged(
            res,
            result
        );

    } catch (err) {

        return responseHelper.error(
            res,
            err
        );

    }
};

exports.getMovements = async (req, res) => {

    try {

        const [rows] = await db.query(
            `
            SELECT
                m.id,
                m.movement_datetime,
                p.barcode,
                p.sku,
                p.name,
                c.category_name,
                p.unit_of_measure,
                m.movement_type,
                m.quantity_change,
                m.reference_id,
                u.username,
                m.remarks
            FROM inventory_movements m

            INNER JOIN products p
                ON p.id = m.product_id

            LEFT JOIN product_categories c
                ON c.id = p.category_id

            LEFT JOIN users u
                ON u.id = m.created_by

            ORDER BY
                m.movement_datetime DESC

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