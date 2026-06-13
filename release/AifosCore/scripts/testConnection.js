const mysql = require('mysql2/promise');
const config = require('../src/config/config');

async function testConnection() {

    try {

        const connection =
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
                    config.Database.Name

            });

        console.log(
            '✅ Database connection successful'
        );

        await connection.end();

        process.exit(0);

    } catch (err) {

        console.error(
            '❌ Database connection failed'
        );

        console.error(
            err.message
        );

        process.exit(1);

    }

}

testConnection();