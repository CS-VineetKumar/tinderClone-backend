import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: "database-1.c5ye0misqfyx.eu-north-1.rds.amazonaws.com",
  user: "admin",
  password: "tinderBackend123",
  database: "tinderBackend",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool; 