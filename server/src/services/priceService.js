const db = require('../../db');

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
}

module.exports = new PriceService();