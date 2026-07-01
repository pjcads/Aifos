const locationService =
    require('../services/locationService');

const queryHelper =
    require('../utils/queryHelper');

const responseHelper =
    require('../utils/responseHelper');

const sortableColumns =
{
    location_code:
        'location_code',

    location_name:
        'location_name',

    location_type:
        'location_type'
};

const searchableColumns =
[
    'location_code',
    'location_name',
    'location_type'
];

exports.getAllLocations =
    async (req, res) =>
{

    const query =
        queryHelper.build(
            req,
            sortableColumns,
            'location_name'
        );

    try
    {

        const result =
            await locationService
                .getLocations(
                    query,
                    searchableColumns
                );

        return responseHelper
            .successPaged(
                res,
                result
            );

    }
    catch (err)
    {

        return responseHelper
            .error(
                res,
                err
            );

    }

};

exports.getLocationById =
    async (req, res) =>
{

    try
    {

        const location =
            await locationService
                .getLocation(
                    req.params.id
                );

        return responseHelper
            .success(
                res,
                {
                    location
                }
            );

    }
    catch (err)
    {

        return responseHelper
            .error(
                res,
                err,
                400
            );

    }

};