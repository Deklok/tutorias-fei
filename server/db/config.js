const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
const pool = mysql.createPool({
	connectionLimit: 500,
	password: process.env.DB_PASS,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	host: process.env.HOST,
	port: process.env.PORT
});

module.exports = pool;