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

const movementSortableColumns =
{
    movement_datetime:
        'm.movement_datetime',

    barcode:
        'p.barcode',

    sku:
        'p.sku',

    name:
        'p.name',

    category_name:
        'c.category_name',

    movement_type:
        'm.movement_type',

    quantity_change:
        'm.quantity_change',

    reference_id:
        'm.reference_id',

    username:
        'u.username'
};

const movementSearchableColumns =
[
    'p.barcode',
    'p.sku',
    'p.name',
    'c.category_name',
    'm.reference_id',
    'u.username',
    'm.remarks',
    'm.movement_type'
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

    const query =
        queryHelper.build(
            req,
            movementSortableColumns
        );

    try {

        const result =
            await inventoryService.getMovements(
                query,
                movementSearchableColumns
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