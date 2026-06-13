const db = require('../../db');
const idGenerator = require('../utils/idGenerator');

class CategoryService {

    async getCategories() {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM product_categories
                ORDER BY category_name
                `
            );

        return rows;

    }

    async getCategory(
        categoryId
    ) {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM product_categories
                WHERE id = ?
                `,
                [categoryId]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Category not found'
            );

        }

        return rows[0];

    }

    async createCategory({
        categoryCode,
        categoryName
    }) {

        const [existing] =
            await db.query(
                `
                SELECT id
                FROM product_categories
                WHERE category_code = ?
                `,
                [categoryCode]
            );

        if (
            existing.length > 0
        ) {

            throw new Error(
                'Category code already exists'
            );

        }

        const categoryId =
            idGenerator.categoryId();

        await db.query(
            `
            INSERT INTO
            product_categories
            (
                id,
                category_code,
                category_name
            )
            VALUES
            (
                ?, ?, ?
            )
            `,
            [
                categoryId,
                categoryCode,
                categoryName
            ]
        );

        return {
            categoryId
        };

    }

    async updateCategory(
        categoryId,
        {
            categoryName,
            isActive
        }
    ) {

        const [rows] =
            await db.query(
                `
                SELECT id
                FROM product_categories
                WHERE id = ?
                `,
                [categoryId]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Category not found'
            );

        }

        await db.query(
            `
            UPDATE product_categories
            SET
                category_name = ?,
                is_active = ?
            WHERE id = ?
            `,
            [
                categoryName,
                isActive,
                categoryId
            ]
        );

        return {
            categoryId
        };

    }

}

module.exports = new CategoryService();