const databaseErrorHelper =
    require('./databaseErrorHelper');

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
        let message;

        if (
            error instanceof Error
        )
        {
            message =
                databaseErrorHelper
                    .getMessage(error);

            if (
                message
            )
            {
                status = 400;
            }
            else
            {
                message =
                    error.message;
            }
        }
        else
        {
            message =
                error;
        }

        return res
            .status(
                status
            )
            .json(
            {
                success: false,
                error: message
            });
    }
}

module.exports =
    new ResponseHelper();