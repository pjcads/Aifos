const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const config = require('../src/config/config');
const idGenerator =
    require('../src/utils/idGenerator');

async function runMigrations() {

    let connection;

    try {

        connection =
            await mysql.createConnection({

                host:
                    config.Database.Host,

                port:
                    config.Database.Port,

                user:
                    config.Database.User,

                password:
                    config.Database.Password,

                database:
                    config.Database.Name,

                multipleStatements: true

            });

        console.log(
            'Connected.'
        );

        const [rows] =
            await connection.query(
                `
                SELECT version_no
                FROM schema_versions
                `
            );

        const appliedVersions =
            rows.map(
                x => x.version_no
            );

        const migrationFolder =
            path.join(
                __dirname,
                '../migrations'
            );

        const files =
            fs.readdirSync(
                migrationFolder
            )
            .sort();

        for (const file of files) {

            if (
                appliedVersions.includes(
                    file
                )
            ) {

                continue;

            }

            console.log(
                `Applying ${file}`
            );

            let sql =
                fs.readFileSync(
                    path.join(
                        migrationFolder,
                        file
                    ),
                    'utf8'
                );

            const placeholderMap =
            {
                CDT:
                    () => idGenerator.configurationDropdownTypeId(),

                CDV:
                    () => idGenerator.configurationDropdownValueId(),

                ACT:
                    () => idGenerator.configurationBusinessActionId(),

                DBA:
                    () => idGenerator.configurationDropdownValueBusinessActionId()
            };

            for (
                const prefix
                in placeholderMap
            )
            {
                sql =
                    sql.replace(
                        new RegExp(
                            `\\{\\{${prefix}\\}\\}`,
                            'g'
                        ),
                        () =>
                            placeholderMap[prefix]()
                    );
            }

            await connection.query(
                sql
            );

            await connection.query(
                `
                INSERT INTO schema_versions
                (
                    version_no,
                    applied_at
                )
                VALUES
                (
                    ?,
                    NOW()
                )
                `,
                [file]
            );

            console.log(
                `${file} applied`
            );

        }

        console.log(
            'Migration complete.'
        );

        await connection.end();

    } catch (err) {

        console.error(
            err.message
        );

        process.exit(1);

    }

}

runMigrations();