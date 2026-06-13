const db = require('../../db');
const idGenerator = require('../utils/idGenerator');

class ProductService {

    async getProducts() {

        const [rows] =
            await db.query(
                `
                SELECT
                    p.*,
                    pc.category_code,
                    pc.category_name
                FROM products p
                LEFT JOIN product_categories pc
                    ON pc.id = p.category_id
                ORDER BY p.name
                `
            );

        return rows;

    }

    async getProduct(
        productId
    ) {

        const [rows] =
            await db.query(
                `
                SELECT
                    p.*,
                    pc.category_code,
                    pc.category_name
                FROM products p
                LEFT JOIN product_categories pc
                    ON pc.id = p.category_id
                WHERE p.id = ?
                `,
                [productId]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Product not found'
            );

        }

        return rows[0];

    }

    async createProduct({
        sku,
        barcode,
        name,
        description,
        unitOfMeasure,
        allowNegativeInventory,
        categoryId
    }) {

        const [existingSku] =
            await db.query(
                `
                SELECT id
                FROM products
                WHERE sku = ?
                `,
                [sku]
            );

        if (
            existingSku.length > 0
        ) {

            throw new Error(
                'SKU already exists'
            );

        }

        if (categoryId) {

            const [categoryRows] =
                await db.query(
                    `
                    SELECT id
                    FROM product_categories
                    WHERE id = ?
                    AND is_active = 1
                    `,
                    [categoryId]
                );

            if (
                categoryRows.length === 0
            ) {

                throw new Error(
                    'Category not found'
                );

            }

        }

        const productId =
            idGenerator.productId();

        await db.query(
            `
            INSERT INTO products
            (
                id,
                sku,
                barcode,
                name,
                description,
                unit_of_measure,
                allow_negative_inventory,
                category_id
            )
            VALUES
            (
                ?, ?, ?, ?, ?, ?, ?, ?
            )
            `,
            [
                productId,
                sku,
                barcode,
                name,
                description,
                unitOfMeasure,
                allowNegativeInventory
                    ? 1
                    : 0,
                categoryId
            ]
        );

        return {
            productId
        };

    }

    async updateProduct(
        productId,
        {
            barcode,
            name,
            description,
            unitOfMeasure,
            allowNegativeInventory,
            categoryId,
            isActive
        }
    ) {

        const [productRows] =
            await db.query(
                `
                SELECT id
                FROM products
                WHERE id = ?
                `,
                [productId]
            );

        if (
            productRows.length === 0
        ) {

            throw new Error(
                'Product not found'
            );

        }

        if (categoryId) {

            const [categoryRows] =
                await db.query(
                    `
                    SELECT id
                    FROM product_categories
                    WHERE id = ?
                    AND is_active = 1
                    `,
                    [categoryId]
                );

            if (
                categoryRows.length === 0
            ) {

                throw new Error(
                    'Category not found'
                );

            }

        }

        await db.query(
            `
            UPDATE products
            SET
                barcode = ?,
                name = ?,
                description = ?,
                unit_of_measure = ?,
                allow_negative_inventory = ?,
                category_id = ?,
                is_active = ?
            WHERE id = ?
            `,
            [
                barcode,
                name,
                description,
                unitOfMeasure,
                allowNegativeInventory
                    ? 1
                    : 0,
                categoryId,
                isActive,
                productId
            ]
        );

        return {
            productId
        };

    }

}

module.exports = new ProductService();