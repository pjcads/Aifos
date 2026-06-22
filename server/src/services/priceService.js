const db = require('../../db');
const idGenerator =
    require('../utils/idGenerator');

class PriceService {

    async getCurrentPrice(productId) {

        const [rows] =
            await db.query(
                `
                SELECT price
                FROM product_prices
                WHERE product_id = ?
                  AND is_active = 1
                  AND effective_from <= NOW()
                  AND (
                        effective_to IS NULL
                        OR effective_to >= NOW()
                  )
                ORDER BY effective_from DESC
                LIMIT 1
                `,
                [productId]
            );

        if (rows.length === 0) {
            throw new Error(
                'No active price found'
            );
        }

        return Number(rows[0].price);
    }

    async getCurrentPrices(
        productIds
    ) {

        const [rows] =
            await db.query(
                `
                SELECT
                    product_id,
                    price
                FROM product_prices
                WHERE product_id IN (?)
                AND is_active = 1
                AND effective_from <= NOW()
                AND (
                        effective_to IS NULL
                        OR effective_to >= NOW()
                )
                `,
                [productIds]
            );

        const prices = {};

        for (const row of rows) {

            prices[row.product_id] =
                Number(row.price);

        }

        return prices;
    }    

    async getPrices(
        productId
    ) {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM product_prices
                WHERE product_id = ?
                ORDER BY
                    effective_from DESC
                `,
                [productId]
            );

        return rows;
    }    

    async createPrice({
        productId,
        priceType,
        price,
        effectiveFrom,
        effectiveTo,
        createdBy
    })
    {
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
        )
        {
            throw new Error(
                'Product not found'
            );
        }         
        
        if (
            price <= 0
        )
        {
            throw new Error(
                'Price must be greater than zero'
            );
        }
            
        if (
            !priceType
        )
        {
            throw new Error(
                'Price type is required'
            );
        }

        const priceId =
            idGenerator.priceId();

        await db.query(
            `
            INSERT INTO
            product_prices
            (
                id,
                product_id,
                price_type,
                price,
                effective_from,
                effective_to,
                created_by
            )
            VALUES
            (
                ?, ?, ?, ?, ?, ?, ?
            )
            `,
            [
                priceId,
                productId,
                priceType,
                price,
                effectiveFrom,
                effectiveTo,
                createdBy
            ]
        );

        return {
            priceId
        };
    }    
}

module.exports = new PriceService();