const db = require('../../db');
const idGenerator = require('../utils/idGenerator');
const customerUtils = require('../utils/customerUtils');

class CustomerService {

    async getCustomers(
        query,
        searchableColumns
    ) {

        const searchHelper =
            require('../utils/searchHelper');

        const searchFilter =
            searchHelper.build(
                query.search,
                searchableColumns
            );

        const whereClause =
            searchFilter.where.replace(
                'WHERE',
                'AND'
            );            

        const [countRows] =
            await db.query(
                `
                SELECT
                    COUNT(*) total
                FROM customers
                WHERE is_active = 1
                ${whereClause}
                `,
                [
                    ...searchFilter.params
                ]
            );

        const total =
            countRows[0].total;

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM customers
                WHERE is_active = 1
                ${whereClause}

                ${query.orderBy}

                LIMIT ?

                OFFSET ?
                `,
                [
                    ...searchFilter.params,
                    query.pageSize,
                    query.offset
                ]
            );

        return {
            total,
            page: query.page,
            pageSize: query.pageSize,
            rows:
                rows.map(
                    customer =>
                        customerUtils
                            .calculateAvailableCredit(
                                customer
                            )
                )
        };

    }

    async getCustomer(
        customerId
    ) {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM customers
                WHERE id = ?
                `,
                [customerId]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Customer not found'
            );

        }

        return customerUtils
            .calculateAvailableCredit(
                rows[0]
            );

    }

    async getCustomerByBarcode(
        barcode
    ) {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM customers
                WHERE barcode = ?
                `,
                [barcode]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Customer not found'
            );

        }

        return customerUtils
            .calculateAvailableCredit(
                rows[0]
            );

    }

    async createCustomer({
        userId,
        name,
        barcode,
        department,
        creditLimit,
        status
    }) {

        if (
            !userId?.trim()
        )
        {
            throw new Error(
                'User ID is required.'
            );
        }

        if (
            !name?.trim()
        )
        {
            throw new Error(
                'Customer name is required.'
            );
        }

        if (
            !barcode?.trim()
        )
        {
            throw new Error(
                'Barcode is required.'
            );
        }

        // if (
        //     !department?.trim()
        // )
        // {
        //     throw new Error(
        //         'Department is required.'
        //     );
        // }

        if (
            !status?.trim()
        )
        {
            throw new Error(
                'Status is required.'
            );
        }        

        const customerId =
            idGenerator.customerId();

        await db.query(
            `
            INSERT INTO customers
            (
                id,
                userid,
                name,
                barcode,
                department,
                credit_limit,
                status,
                is_active
            )
            VALUES
            (
                ?, ?, ?, ?, ?, ?, ?, 1
            )
            `,
            [
                customerId,
                userId,
                name,
                barcode,
                department,
                creditLimit,
                status
            ]
        );

        return {
            customerId
        };

    }

    async updateCustomer(
        customerId,
        {
            userId,
            name,
            barcode,
            department,
            creditLimit,
            status
        }
    ) {

        if (
            !userId?.trim()
        )
        {
            throw new Error(
                'User ID is required.'
            );
        }

        if (
            !name?.trim()
        )
        {
            throw new Error(
                'Customer name is required.'
            );
        }

        if (
            !barcode?.trim()
        )
        {
            throw new Error(
                'Barcode is required.'
            );
        }

        // if (
        //     !department?.trim()
        // )
        // {
        //     throw new Error(
        //         'Department is required.'
        //     );
        // }

        if (
            !status?.trim()
        )
        {
            throw new Error(
                'Status is required.'
            );
        }         

        const [rows] =
            await db.query(
                `
                SELECT id
                FROM customers
                WHERE id = ?
                `,
                [customerId]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Customer not found'
            );

        }

        await db.query(
            `
            UPDATE customers
            SET
                userid = ?,
                name = ?,
                barcode = ?,
                department = ?,
                credit_limit = ?,
                status = ?
            WHERE id = ?
            `,
            [
                userId,
                name,
                barcode,
                department,
                creditLimit,
                status,
                customerId
            ]
        );

        return {
            customerId
        };

    }

    async deactivateCustomer(
        customerId
    ) {

        const [rows] =
            await db.query(
                `
                SELECT id
                FROM customers
                WHERE id = ?
                `,
                [customerId]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Customer not found'
            );

        }

        await db.query(
            `
            UPDATE customers
            SET is_active = 0,
            status = 'INACTIVE'
            WHERE id = ?
            `,
            [customerId]
        );

        return {
            customerId
        };

    }

    async activateCustomer(
        customerId
    ) {

        const [rows] =
            await db.query(
                `
                SELECT id
                FROM customers
                WHERE id = ?
                `,
                [customerId]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Customer not found'
            );

        }

        await db.query(
            `
            UPDATE customers
            SET is_active = 1,
            status = 'ACTIVE'
            WHERE id = ?
            `,
            [customerId]
        );

        return {
            customerId
        };

    }    
}

module.exports = new CustomerService();