class SearchHelper
{
    build(
        search,
        columns
    )
    {
        const value =
            (
                search
                || ''
            ).trim();

        if (
            value.length === 0
        )
        {
            return {
                where:
                    '',
                params:
                    []
            };
        }

        const where =
            `
            WHERE
            (
                ${columns
                    .map(
                        column =>
                            `IFNULL(${column}, '') LIKE CONCAT('%', ?, '%')`
                    )
                    .join(
                        '\n OR '
                    )}
            )
            `;

        const params =
            columns.map(
                () => value
            );

        return {
            where,
            params
        };
    }
}

module.exports =
    new SearchHelper();