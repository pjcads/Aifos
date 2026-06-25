class ResponseHelper
{
    success(
        res,
        data = {}
    )
    {
        return res.json(
        {
            success: true,
            ...data
        });
    }

    successPaged(
        res,
        {
            total,
            page,
            pageSize,
            rows
        }
    )
    {
        return res.json(
        {
            success: true,
            total,
            page,
            pageSize,
            rows
        });
    }

    error(
        res,
        error,
        status = 500
    )
    {
        return res
            .status(
                status
            )
            .json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : error
            });
    }
}

module.exports =
    new ResponseHelper();