class QueryHelper
{
    build(
        req,
        sortableColumns,
        defaultSort = 'name'
    )
    {
        const search =
            (
                req.query.search
                || ''
            ).trim();

        const page =
            Math.max(
                1,
                Number(
                    req.query.page
                )
                || 1
            );

        const pageSize =
            Math.min(
                500,
                Math.max(
                    1,
                    Number(
                        req.query.pageSize
                    )
                    || 50
                )
            );

        const sort =
            req.query.sort
            || defaultSort;

        const direction =
            req.query.direction
                ?.toUpperCase()
            === 'DESC'
                ? 'DESC'
                : 'ASC';

        const orderBy =
            sortableColumns[
                sort
            ]
            ||
            sortableColumns[
                defaultSort
            ];

        const offset =
            (
                page - 1
            )
            * pageSize;

        return {
            search,
            page,
            pageSize,
            sort,
            direction,
            orderBy,
            offset
        };
    }
}

module.exports =
    new QueryHelper();