class DatabaseErrorHelper
{
    constructor()
    {
        this.duplicateMessages =
        {
            customers:
            {
                userid:
                    "User ID already exists.",

                barcode:
                    "Barcode already exists."
            },

            products:
            {
                barcode:
                    "Barcode already exists.",

                sku:
                    "SKU already exists."
            },

            users:
            {
                username:
                    "Username already exists."
            }
        };
    }

    getMessage(
        error
    )
    {
        if (
            !error
            ||
            error.code !==
                "ER_DUP_ENTRY"
        )
        {
            return null;
        }

        for (
            const table
            in this.duplicateMessages
        )
        {
            const columns =
                this.duplicateMessages[
                    table
                ];

            for (
                const column
                in columns
            )
            {
                if (
                    error.message.includes(
                        `${table}.${column}`
                    )
                )
                {
                    return columns[
                        column
                    ];
                }
            }
        }

        return "Duplicate record.";
    }
}

module.exports =
    new DatabaseErrorHelper();