const mysql = require('mysql2');
const config = require('./src/config/config');

const pool = mysql.createPool({
    host: config.Database.Host,
    user: config.Database.User,
    password: config.Database.Password,
    database: config.Database.Name,
    port: config.Database.Port,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed: ' + err.stack);
        return;
    }
    console.log('✅ Connected to MySQL Database as ID ' + connection.threadId);
    connection.release();
});

module.exports = promisePool;