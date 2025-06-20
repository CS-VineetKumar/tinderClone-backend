import mysql from 'mysql2/promise';

const mysqlHost = process.env.MYSQL_HOST;
const mysqlUser = process.env.MYSQL_USER;
const mysqlPassword = process.env.MYSQL_PASSWORD;
const mysqlDatabase = process.env.MYSQL_DATABASE;
const mysqlConnectionLimit = process.env.MYSQL_CONNECTION_LIMIT;
const mysqlQueueLimit = process.env.MYSQL_QUEUE_LIMIT;

if (!mysqlHost || !mysqlUser || !mysqlPassword || !mysqlDatabase) {
  throw new Error('MySQL environment variables (MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE) are required');
}

if (!mysqlConnectionLimit || !mysqlQueueLimit) {
  throw new Error('MySQL environment variables (MYSQL_CONNECTION_LIMIT, MYSQL_QUEUE_LIMIT) are required');
}

const pool = mysql.createPool({
  host: mysqlHost,
  user: mysqlUser,
  password: mysqlPassword,
  database: mysqlDatabase,
  waitForConnections: true,
  connectionLimit: parseInt(mysqlConnectionLimit),
  queueLimit: parseInt(mysqlQueueLimit),
});

export default pool; 