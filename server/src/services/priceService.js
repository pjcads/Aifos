const db = require('../../db');
const idGenerator =
    require('../utils/idGenerator');

class PriceService {

    async getCurrentPrices(
        productIds
    )
    {
        const [rows] =
            await db.query(
                `
                SELECT
                    product_id,
                    price_type,
                    price,
                    effective_from
                FROM product_prices
                WHERE product_id IN (?)
                AND is_active = 1
                AND effective_from <= NOW()
                AND (
                    effective_to IS NULL
                    OR effective_to >= NOW()
                )
                ORDER BY
                    product_id,
                    CASE
                        WHEN price_type = 'PROMO'
                            THEN 1
                        WHEN price_type = 'REGULAR'
                            THEN 2
                        WHEN price_type = 'EMPLOYEE'
                            THEN 3
                        ELSE 99
                    END,
                    effective_from DESC
                `,
                [productIds]
            );

        const prices = {};

        for (
            const row
            of rows
        )
        {
            if (
                !prices[
                    row.product_id
                ]
            )
            {
                prices[
                    row.product_id
                ] =
                    Number(
                        row.price
                    );
            }
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
                    effective_from DESC,
                    created_at DESC
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

        if (
            priceType === 'PROMO'
            &&
            !effectiveTo
        )
        {
            throw new Error(
                'Promo price requires an end date'
            );
        }

        if (
            effectiveTo
            &&
            new Date(effectiveTo) < new Date(effectiveFrom)
        )
        {
            throw new Error(
                'Effective To cannot be earlier than Effective From'
            );
        } 

        if (
            priceType === 'PROMO'
        )
        {
            const [overlapRows] =
                await db.query(
                    `
                    SELECT id
                    FROM product_prices
                    WHERE product_id = ?
                    AND price_type = 'PROMO'
                    AND effective_from <= ?
                    AND effective_to >= ?
                    `,
                    [
                        productId,
                        effectiveTo,
                        effectiveFrom
                    ]
                );

            if (
                overlapRows.length > 0
            )
            {
                throw new Error(
                    'Promo period overlaps an existing promo'
                );
            }
        }        
             
        if (
            priceType === 'REGULAR'
        )
        {
            // Close previous open-ended prices
            await db.query(
                `
                UPDATE product_prices
                SET effective_to =
                    DATE_SUB(
                        ?,
                        INTERVAL 1 SECOND
                    )
                WHERE product_id = ?
                AND price_type = ?
                AND effective_to IS NULL
                AND effective_from < ?
                `,
                [
                    effectiveFrom,
                    productId,
                    priceType,
                    effectiveFrom
                ]
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
    
    async getCurrentSellingPrice(
        productId
    )
    {
        const [promoRows] =
            await db.query(
                `
                SELECT price
                FROM product_prices
                WHERE product_id = ?
                AND price_type = 'PROMO'
                AND is_active = 1
                AND effective_from <= NOW()
                AND effective_to >= NOW()
                ORDER BY effective_from DESC
                LIMIT 1
                `,
                [productId]
            );

        if (
            promoRows.length > 0
        )
        {
            return Number(
                promoRows[0].price
            );
        }

        const [regularRows] =
            await db.query(
                `
                SELECT price
                FROM product_prices
                WHERE product_id = ?
                AND price_type = 'REGULAR'
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

        if (
            regularRows.length === 0
        )
        {
            throw new Error(
                'No active selling price found'
            );
        }

        return Number(
            regularRows[0].price
        );
    }    
}

module.exports = new PriceService();