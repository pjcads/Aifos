const db = require('../../db');
const idGenerator = require('../utils/idGenerator');
const priceService = require('./priceService');

const queryHelper =
    require('../utils/queryHelper');

const searchHelper =
    require('../utils/searchHelper');

const sortableColumns = {

    sku:
        'p.sku',

    barcode:
        'p.barcode',

    name:
        'p.name',

    category:
        'pc.category_name',

    unit_of_measure:
        'p.unit_of_measure',

    is_active:
        'p.is_active'

};

const searchableColumns = [

    'p.sku',

    'p.barcode',

    'p.name',

    'pc.category_name'

];

class ProductService {

    async getProducts(req) {

        const query =
            queryHelper.build(
                req,
                sortableColumns
            ); 
            
        const search =
            searchHelper.build(
                query.search,
                searchableColumns
            );            

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

                ${search.where}

                ${query.orderBy}

                LIMIT ?
                OFFSET ?
                `,
                [
                    ...search.params,
                    query.pageSize,
                    query.offset
                ]
            );

        const [[{ total }]] =
            await db.query(
                `
                SELECT
                    COUNT(*) AS total
                FROM products p
                LEFT JOIN product_categories pc
                    ON pc.id = p.category_id

                ${search.where}
                `,
                search.params
            );            

        const productIds =
            rows.map(
                x => x.id
            );

        const priceMap =
            await priceService
                .getCurrentPrices(
                    productIds
                );            

        const mappedRows =
            rows.map(product => ({

                ...product,

                current_price:
                    Number(
                        priceMap[
                            product.id
                        ] || 0
                    ),

                is_active:
                    product.is_active === 1,

                allow_negative_inventory:
                    product.allow_negative_inventory === 1

            }));

        return {

            rows:
                mappedRows,

            total,

            page:
                query.page,

            pageSize:
                query.pageSize

        };

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

        const priceMap =
            await priceService
                .getCurrentPrices([
                    productId
                ]);

        return {

            ...rows[0],

            current_price:
                Number(
                    priceMap[
                        productId
                    ] || 0
                ),

            is_active:
                rows[0].is_active === 1,

            allow_negative_inventory:
                rows[0].allow_negative_inventory === 1

        };                

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

        categoryId =
            categoryId || null;        

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

    async uploadProductImage(
        productId,
        file
    )
    {
        const [rows] =
            await db.query(
                `
                SELECT id
                FROM products
                WHERE id = ?
                `,
                [
                    productId
                ]
            );

        if (
            rows.length === 0
        )
        {
            throw new Error(
                'Product not found'
            );
        }

        if (
            !file
        )
        {
            throw new Error(
                'No image uploaded.'
            );
        }

        const imageUrl =
            `/uploads/products/${file.filename}`;

        await db.query(
            `
            UPDATE products
            SET image_url = ?
            WHERE id = ?
            `,
            [
                imageUrl,
                productId
            ]
        );

        return {
            productId,
            imageUrl
        };
    }    

}

module.exports = new ProductService();