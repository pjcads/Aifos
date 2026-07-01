const db =
    require('../../db');

const searchHelper =
    require('../utils/searchHelper');

class LocationService
{
    async getLocations(
        query,
        searchableColumns
    )
    {
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
                FROM inventory_locations
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
                FROM inventory_locations
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
            rows
        };
    }

    async getLocation(
        locationId
    )
    {
        const [rows] =
            await db.query(
                `
                SELECT *
                FROM inventory_locations
                WHERE id = ?
                `,
                [
                    locationId
                ]
            );

        if (
            rows.length === 0
        )
        {
            throw new Error(
                'Location not found'
            );
        }

        return rows[0];
    }
}

module.exports =
    new LocationService();