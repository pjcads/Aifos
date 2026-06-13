const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const config = require('../src/config/config');

async function installDatabase() {

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

        console.log(
            'Database connected.'
        );

        const schemaPath =
            path.join(
                __dirname,
                '../database/schema.sql'
            );

        const schemaSql =
            fs.readFileSync(
                schemaPath,
                'utf8'
            );

        console.log(
            'Executing schema.sql...'
        );

        await connection.query(
            schemaSql
        );

        console.log(
            'Database installation complete.'
        );

        await connection.end();

        process.exit(0);

    } catch (err) {

        console.error(
            'Database installation failed.'
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

installDatabase();