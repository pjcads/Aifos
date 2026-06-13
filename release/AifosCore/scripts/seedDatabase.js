const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const config =
    require('../src/config/config');

async function seedDatabase() {

    let connection;

    try {

        console.log(
            'Connecting to database...'
        );

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

                multipleStatements:
                    true

            });

        const seedPath =
            path.join(
                __dirname,
                '../database/seed.sql'
            );

        let seedSql =
            fs.readFileSync(
                seedPath,
                'utf8'
            );

        seedSql =
            seedSql.replace(
                '__COMPANY_NAME__',
                config.CompanyName
            );

        seedSql =
            seedSql.replace(
                '__VERSION__',
                config.Version
            );
            
        console.log(
            'Executing seed.sql...'
        );

        await connection.query(
            seedSql
        );

        console.log(
            'Database seed complete.'
        );

        await connection.end();

        process.exit(0);

    } catch (err) {

        console.error(
            'Database seed failed.'
        );

        console.error(
            err.message
        );

        if (connection) {

            await connection.end();

        }

        process.exit(1);

    }

}

seedDatabase();