const multer =
    require('multer');

const path =
    require('path');

const storage =
    multer.diskStorage(
    {
        destination:
            (
                req,
                file,
                cb
            ) =>
        {
            cb(
                null,
                'uploads/products'
            );
        },

        filename:
            (
                req,
                file,
                cb
            ) =>
        {
            const extension =
                path.extname(
                    file.originalname
                );

            cb(
                null,
                `${req.params.id}${extension}`
            );
        }
    });

module.exports =
    multer(
    {
        storage,

        limits:
        {
            fileSize:
                5 * 1024 * 1024
        },

        fileFilter:
            (
                req,
                file,
                cb
            ) =>
        {
            if (
                file.mimetype.startsWith(
                    'image/'
                )
            )
            {
                return cb(
                    null,
                    true
                );
            }

            cb(
                new Error(
                    'Only image files are allowed.'
                )
            );
        }
    });