class ExportService {

    convertToCsv(
        rows
    ) {

        if (
            !rows ||
            rows.length === 0
        ) {

            return '';

        }

        const headers =
            Object.keys(
                rows[0]
            );

        const csvRows = [];

        csvRows.push(
            headers.join(',')
        );

        for (
            const row
            of rows
        ) {

            const values =
                headers.map(
                    h => {

                        const value =
                            row[h];

                        return `"${String(
                            value ?? ''
                        ).replace(
                            /"/g,
                            '""'
                        )}"`;

                    }
                );

            csvRows.push(
                values.join(',')
            );

        }

        return csvRows.join(
            '\n'
        );

    }

}

module.exports = new ExportService();