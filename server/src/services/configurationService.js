const db = require('../../db');
const idGenerator = require('../utils/idGenerator');

class ConfigurationService {

    async getDropdownTypes(
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
                FROM configuration_dropdown_types
                WHERE 1 = 1
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
                SELECT
                    dt.id,
                    dt.code,
                    dt.name,
                    dt.description,
                    dt.parent_dropdown_type_id,
                    parent.code AS parent_dropdown_type_code,
                    parent.name AS parent_dropdown_type_name,
                    dt.display_order,
                    dt.is_system,
                    dt.is_active,
                    dt.created_at,
                    dt.updated_at
                FROM
                    configuration_dropdown_types dt

                LEFT JOIN
                    configuration_dropdown_types parent
                        ON parent.id = dt.parent_dropdown_type_id

                WHERE 1 = 1
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
            rows
        };

    }

    async getDropdownType(
        id
    ) {

        const [rows] =
            await db.query(
                `
                SELECT
                    dt.*,
                    parent.code AS parent_dropdown_type_code,
                    parent.name AS parent_dropdown_type_name
                FROM
                    configuration_dropdown_types dt

                LEFT JOIN
                    configuration_dropdown_types parent
                        ON parent.id = dt.parent_dropdown_type_id

                WHERE
                    dt.id = ?
                `,
                [id]
            );

        return rows[0] ?? null;

    }

    async createDropdownType(
        data
    ) {

        if (
            !data.code?.trim()
        ) {

            throw new Error(
                'Code is required.'
            );

        }

        if (
            !data.name?.trim()
        ) {

            throw new Error(
                'Name is required.'
            );

        }

        const [existing] =
            await db.query(
                `
                SELECT id
                FROM configuration_dropdown_types
                WHERE code = ?
                `,
                [
                    data.code.trim()
                ]
            );

        if (
            existing.length > 0
        ) {

            throw new Error(
                'Dropdown Type code already exists.'
            );

        }

        const id =
            idGenerator
                .configurationDropdownTypeId();

        await db.query(
            `
            INSERT INTO
            configuration_dropdown_types
            (
                id,
                code,
                name,
                description,
                parent_dropdown_type_id,
                display_order
            )
            VALUES
            (
                ?, ?, ?, ?, ?, ?
            )
            `,
            [
                id,
                data.code.trim(),
                data.name.trim(),
                data.description?.trim() || null,
                data.parent_dropdown_type_id ?? null,
                data.display_order ?? 0
            ]
        );

        return {
            id
        };

    }

    async updateDropdownType(
        id,
        data
    ) {

        if (
            !data.code?.trim()
        ) {

            throw new Error(
                'Code is required.'
            );

        }

        if (
            !data.name?.trim()
        ) {

            throw new Error(
                'Name is required.'
            );

        }

        const [existing] =
            await db.query(
                `
                SELECT id
                FROM configuration_dropdown_types
                WHERE code = ?
                AND id <> ?
                `,
                [
                    data.code.trim(),
                    id
                ]
            );

        if (
            existing.length > 0
        ) {

            throw new Error(
                'Dropdown Type code already exists.'
            );

        }

        await db.query(
            `
            UPDATE configuration_dropdown_types
            SET
                code = ?,
                name = ?,
                description = ?,
                parent_dropdown_type_id = ?,
                display_order = ?
            WHERE id = ?
            `,
            [
                data.code.trim(),
                data.name.trim(),
                data.description?.trim() || null,
                data.parent_dropdown_type_id ?? null,
                data.display_order ?? 0,
                id
            ]
        );

    }

    async activateDropdownType(
        id
    ) {

        const [rows] =
            await db.query(
                `
                SELECT id
                FROM configuration_dropdown_types
                WHERE id = ?
                `,
                [id]
            );

        if (rows.length === 0) {

            throw new Error(
                'Dropdown Type not found.'
            );

        }

        await db.query(
            `
            UPDATE configuration_dropdown_types
            SET is_active = 1
            WHERE id = ?
            `,
            [id]
        );

    }

    async deactivateDropdownType(
        id
    ) {

        const [rows] =
            await db.query(
                `
                SELECT id
                FROM configuration_dropdown_types
                WHERE id = ?
                `,
                [id]
            );

        if (rows.length === 0) {

            throw new Error(
                'Dropdown Type not found.'
            );

        }

        await db.query(
            `
            UPDATE configuration_dropdown_types
            SET is_active = 0
            WHERE id = ?
            `,
            [id]
        );

    }

    async getDropdownValues(
        dropdownTypeId,
        query,
        searchableColumns
    ) {

        const where =
            [
                'dv.dropdown_type_id = ?'
            ];

        const params =
            [
                dropdownTypeId
            ];

        if (
            query.search
        ) {

            const searchClause =
                searchableColumns
                    .map(
                        column =>
                            `${column} LIKE ?`
                    )
                    .join(
                        ' OR '
                    );

            where.push(
                `(${searchClause})`
            );

            searchableColumns
                .forEach(
                    () =>
                        params.push(
                            `%${query.search}%`
                        )
                );

        }

        const whereClause =
            where.join(
                ' AND '
            );

        const [[{ total }]] =
            await db.query(
                `
                SELECT
                    COUNT(*) total
                FROM
                    configuration_dropdown_values dv
                WHERE
                    ${whereClause}
                `,
                params
            );

        const [rows] =
            await db.query(
                `
                SELECT
                    dv.*,
                    parent.code AS parent_code,
                    parent.name AS parent_name
                FROM
                    configuration_dropdown_values dv

                LEFT JOIN
                    configuration_dropdown_values parent
                        ON parent.id = dv.parent_dropdown_value_id

                WHERE
                    ${whereClause}

                ${query.orderBy}

                LIMIT ?

                OFFSET ?
                `,
                [
                    ...params,
                    query.pageSize,
                    query.offset
                ]
            );

        return {
            rows,
            total,
            page: query.page,
            pageSize: query.pageSize
        };

    }

    async getDropdownValuesLookup(
        query
    ) {

        const where =
            [];

        const params =
            [];

        if (
            query.dropdownTypeCode
        ) {

            where.push(
                `
                dv.dropdown_type_id =
                (
                    SELECT id
                    FROM configuration_dropdown_types
                    WHERE code = ?
                )
                `
            );

            params.push(
                query.dropdownTypeCode
            );

        }
        else if (
            query.dropdownTypeId
        ) {

            where.push(
                "dv.dropdown_type_id = ?"
            );

            params.push(
                query.dropdownTypeId
            );

        }

        if (
            query.parentDropdownValueId
        ) {

            where.push(
                "dv.parent_dropdown_value_id = ?"
            );

            params.push(
                query.parentDropdownValueId
            );

        }

        const whereClause =
            where.length > 0
                ? `WHERE ${where.join(" AND ")}`
                : "";

        const [rows] =
            await db.query(
                `
                SELECT
                    dv.*,
                    parent.code AS parent_code,
                    parent.name AS parent_name
                FROM
                    configuration_dropdown_values dv

                LEFT JOIN
                    configuration_dropdown_values parent
                        ON parent.id = dv.parent_dropdown_value_id

                ${whereClause}

                ORDER BY
                    dv.sort_order,
                    dv.name
                `,
                params
            );

        return rows;

    }    
    
    async createDropdownValue(
        data
    ) {

        if (!data.dropdown_type_id)
            throw new Error('Dropdown Type is required.');

        if (!data.code?.trim())
            throw new Error('Code is required.');

        if (!data.name?.trim())
            throw new Error('Name is required.');

        const [existing] =
            await db.query(
                `
                SELECT id
                FROM configuration_dropdown_values
                WHERE dropdown_type_id = ?
                AND code = ?
                `,
                [
                    data.dropdown_type_id,
                    data.code.trim()
                ]
            );

        if (existing.length > 0)
            throw new Error(
                'Dropdown Value code already exists.'
            );
                    
        const id =
            idGenerator
                .configurationDropdownValueId();

        await db.query(
            `
            INSERT INTO
            configuration_dropdown_values
            (
                id,
                dropdown_type_id,
                parent_dropdown_value_id,
                code,
                name,
                description,
                sort_order,
                is_default,
                is_system,
                is_active
            )
            VALUES
            (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
            `,
            [
                id,
                data.dropdown_type_id,
                data.parent_dropdown_value_id ?? null,
                data.code.trim(),
                data.name.trim(),
                data.description ?? null,
                data.sort_order ?? 0,
                data.is_default ?? 0,
                data.is_system ?? 0,
                data.is_active ?? 1
            ]
        );

        return {
            id
        };

    }    

    async getDropdownValue(
        id
    ) {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM configuration_dropdown_values
                WHERE id = ?
                `,
                [id]
            );

        return rows[0] ?? null;

    }
    
    async updateDropdownValue(
        id,
        data
    ) {

        const [rows] =
            await db.query(
                `
                SELECT id
                FROM configuration_dropdown_values
                WHERE id = ?
                `,
                [id]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Dropdown Value not found.'
            );

        }

        if (
            !data.dropdown_type_id
        ) {

            throw new Error(
                'Dropdown Type is required.'
            );

        }

        if (
            !data.code?.trim()
        ) {

            throw new Error(
                'Code is required.'
            );

        }

        if (
            !data.name?.trim()
        ) {

            throw new Error(
                'Name is required.'
            );

        }

        const [existing] =
            await db.query(
                `
                SELECT id
                FROM configuration_dropdown_values
                WHERE
                    dropdown_type_id = ?
                    AND code = ?
                    AND id <> ?
                `,
                [
                    data.dropdown_type_id,
                    data.code.trim(),
                    id
                ]
            );

        if (
            existing.length > 0
        ) {

            throw new Error(
                'Dropdown Value code already exists.'
            );

        }

        await db.query(
            `
            UPDATE configuration_dropdown_values
            SET
                parent_dropdown_value_id = ?,
                code = ?,
                name = ?,
                description = ?,
                sort_order = ?,
                is_default = ?
            WHERE
                id = ?
            `,
            [
                data.parent_dropdown_value_id ?? null,
                data.code.trim(),
                data.name.trim(),
                data.description?.trim() || null,
                data.sort_order ?? 0,
                data.is_default ?? 0,
                id
            ]
        );

    }

    async activateDropdownValue(
        id
    ) {

        const [rows] =
            await db.query(
                `
                SELECT id
                FROM configuration_dropdown_values
                WHERE id = ?
                `,
                [id]
            );

        if (rows.length === 0) {

            throw new Error(
                'Dropdown Value not found.'
            );

        }

        await db.query(
            `
            UPDATE configuration_dropdown_values
            SET is_active = 1
            WHERE id = ?
            `,
            [id]
        );

    }

    async deactivateDropdownValue(
        id
    ) {

        const [rows] =
            await db.query(
                `
                SELECT id
                FROM configuration_dropdown_values
                WHERE id = ?
                `,
                [id]
            );

        if (rows.length === 0) {

            throw new Error(
                'Dropdown Value not found.'
            );

        }

        await db.query(
            `
            UPDATE configuration_dropdown_values
            SET is_active = 0
            WHERE id = ?
            `,
            [id]
        );

    }

    async getBusinessActions(
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
                FROM configuration_business_actions
                WHERE 1 = 1
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
                SELECT
                    id,
                    code,
                    name,
                    description,
                    domain,
                    is_system,
                    is_active,
                    created_at,
                    updated_at
                FROM configuration_business_actions
                WHERE 1 = 1
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
            rows
        };

    }

    async getBusinessAction(
        id
    ) {

        const [rows] =
            await db.query(
                `
                SELECT *
                FROM configuration_business_actions
                WHERE id = ?
                `,
                [id]
            );

        return rows[0] ?? null;

    }

    async createBusinessAction(
        data
    ) {

        if (!data.code?.trim())
            throw new Error('Code is required.');

        if (!data.name?.trim())
            throw new Error('Name is required.');

        if (!data.domain?.trim())
            throw new Error('Domain is required.');

        const [existing] =
            await db.query(
                `
                SELECT id
                FROM configuration_business_actions
                WHERE code = ?
                `,
                [
                    data.code.trim()
                ]
            );

        if (existing.length > 0)
            throw new Error(
                'Business Action code already exists.'
            );        

        const id =
            idGenerator
                .configurationBusinessActionId();

        await db.query(
            `
            INSERT INTO
            configuration_business_actions
            (
                id,
                code,
                name,
                description,
                domain
            )
            VALUES
            (
                ?, ?, ?, ?, ?
            )
            `,
            [
                id,
                data.code.trim(),
                data.name.trim(),
                data.description ?? null,
                data.domain.trim()
            ]
        );

        return {
            id
        };

    }

    async updateBusinessAction(
        id,
        data
    ) {

        const [rows] =
            await db.query(
                `
                SELECT
                    is_system
                FROM
                    configuration_business_actions
                WHERE
                    id = ?
                `,
                [id]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Business Action not found.'
            );

        }

        if (
            rows[0].is_system
        ) {

            throw new Error(
                'System Business Actions cannot be modified.'
            );

        }

        const [existing] =
            await db.query(
                `
                SELECT id
                FROM configuration_business_actions
                WHERE code = ?
                AND id <> ?
                `,
                [
                    data.code.trim(),
                    id
                ]
            );

        if (existing.length > 0)
            throw new Error(
                'Business Action code already exists.'
            );        

        await db.query(
            `
            UPDATE
                configuration_business_actions
            SET
                code = ?,
                name = ?,
                description = ?,
                domain = ?
            WHERE
                id = ?
            `,
            [
                data.code.trim(),
                data.name.trim(),
                data.description ?? null,
                data.domain.trim(),
                id
            ]
        );

    }

    async activateBusinessAction(
        id
    ) {

        const [rows] =
            await db.query(
                `
                SELECT
                    is_system
                FROM
                    configuration_business_actions
                WHERE
                    id = ?
                `,
                [id]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Business Action not found.'
            );

        }

        if (
            rows[0].is_system
        ) {

            throw new Error(
                'System Business Actions cannot be activated.'
            );

        }

        await db.query(
            `
            UPDATE
                configuration_business_actions
            SET
                is_active = 1
            WHERE
                id = ?
            `,
            [id]
        );

    }

    async deactivateBusinessAction(
        id
    ) {

        const [rows] =
            await db.query(
                `
                SELECT
                    is_system
                FROM
                    configuration_business_actions
                WHERE
                    id = ?
                `,
                [id]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Business Action not found.'
            );

        }

        if (
            rows[0].is_system
        ) {

            throw new Error(
                'System Business Actions cannot be deactivated.'
            );

        }

        await db.query(
            `
            UPDATE
                configuration_business_actions
            SET
                is_active = 0
            WHERE
                id = ?
            `,
            [id]
        );

    }

    async getDropdownValueBusinessActions(
        dropdownValueId
    ) {

        const [rows] =
            await db.query(
                `
                SELECT
                    business_action_id
                FROM
                    configuration_dropdown_value_business_actions
                WHERE
                    dropdown_value_id = ?
                `,
                [
                    dropdownValueId
                ]
            );

        return rows;

    }    

    async saveDropdownValueBusinessActions(
        dropdownValueId,
        businessActionIds
    ) {

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

            await connection.query(
                `
                DELETE
                FROM
                    configuration_dropdown_value_business_actions
                WHERE
                    dropdown_value_id = ?
                `,
                [
                    dropdownValueId
                ]
            );

            for (
                const businessActionId
                of businessActionIds
            ) {

                await connection.query(
                    `
                    INSERT INTO
                    configuration_dropdown_value_business_actions
                    (
                        id,
                        dropdown_value_id,
                        business_action_id
                    )
                    VALUES
                    (
                        ?, ?, ?
                    )
                    `,
                    [
                        idGenerator
                            .configurationDropdownValueBusinessActionId(),
                        dropdownValueId,
                        businessActionId
                    ]
                );

            }

            await connection.commit();

        } catch (err) {

            await connection.rollback();

            throw err;

        } finally {

            connection.release();

        }

    } 
    
    async setDefaultDropdownValue(
        id
    ) {

        const [rows] =
            await db.query(
                `
                SELECT
                    id,
                    dropdown_type_id
                FROM
                    configuration_dropdown_values
                WHERE
                    id = ?
                `,
                [
                    id
                ]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Dropdown Value not found.'
            );

        }

        const dropdownTypeId =
            rows[0].dropdown_type_id;

        await db.query(
            `
            UPDATE
                configuration_dropdown_values
            SET
                is_default = 0
            WHERE
                dropdown_type_id = ?
            `,
            [
                dropdownTypeId
            ]
        );

        await db.query(
            `
            UPDATE
                configuration_dropdown_values
            SET
                is_default = 1
            WHERE
                id = ?
            `,
            [
                id
            ]
        );

    }  
    
    async moveUpDropdownValue(
        id
    ) {

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

            const [currentRows] =
                await connection.query(
                    `
                    SELECT
                        id,
                        dropdown_type_id,
                        sort_order
                    FROM
                        configuration_dropdown_values
                    WHERE
                        id = ?
                    `,
                    [
                        id
                    ]
                );

            if (
                currentRows.length === 0
            ) {

                throw new Error(
                    'Dropdown Value not found.'
                );

            }

            const current =
                currentRows[0];

            const [previousRows] =
                await connection.query(
                    `
                    SELECT
                        id,
                        name,
                        sort_order
                    FROM
                        configuration_dropdown_values
                    WHERE
                        dropdown_type_id = ?
                        AND sort_order < ?
                    ORDER BY
                        sort_order DESC,
                        name DESC
                    LIMIT 1
                    `,
                    [
                        current.dropdown_type_id,
                        current.sort_order
                    ]
                );

            if (
                previousRows.length === 0
            ) {

                await connection.rollback();

                return;

            }

            const previous =
                previousRows[0];

            await connection.query(
                `
                UPDATE
                    configuration_dropdown_values
                SET
                    sort_order = ?
                WHERE
                    id = ?
                `,
                [
                    previous.sort_order,
                    current.id
                ]
            );

            await connection.query(
                `
                UPDATE
                    configuration_dropdown_values
                SET
                    sort_order = ?
                WHERE
                    id = ?
                `,
                [
                    current.sort_order,
                    previous.id
                ]
            );

            await connection.commit();

        } catch (err) {

            await connection.rollback();

            throw err;

        } finally {

            connection.release();

        }

    }    

    async moveDownDropdownValue(
        id
    ) {

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

            const [currentRows] =
                await connection.query(
                    `
                    SELECT
                        id,
                        dropdown_type_id,
                        sort_order
                    FROM
                        configuration_dropdown_values
                    WHERE
                        id = ?
                    `,
                    [
                        id
                    ]
                );

            if (
                currentRows.length === 0
            ) {

                throw new Error(
                    'Dropdown Value not found.'
                );

            }

            const current =
                currentRows[0];

            const [nextRows] =
                await connection.query(
                    `
                    SELECT
                        id,
                        name,
                        sort_order
                    FROM
                        configuration_dropdown_values
                    WHERE
                        dropdown_type_id = ?
                        AND sort_order > ?
                    ORDER BY
                        sort_order ASC,
                        name ASC
                    LIMIT 1
                    `,
                    [
                        current.dropdown_type_id,
                        current.sort_order
                    ]
                );

            if (
                nextRows.length === 0
            ) {

                await connection.rollback();

                return;

            }

            const next =
                nextRows[0];

            await connection.query(
                `
                UPDATE
                    configuration_dropdown_values
                SET
                    sort_order = ?
                WHERE
                    id = ?
                `,
                [
                    next.sort_order,
                    current.id
                ]
            );

            await connection.query(
                `
                UPDATE
                    configuration_dropdown_values
                SET
                    sort_order = ?
                WHERE
                    id = ?
                `,
                [
                    current.sort_order,
                    next.id
                ]
            );

            await connection.commit();

        } catch (err) {

            await connection.rollback();

            throw err;

        } finally {

            connection.release();

        }

    }    

}

module.exports =
    new ConfigurationService();