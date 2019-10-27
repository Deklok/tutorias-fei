const mysql = require('mysql');
const pool = mysql.createPool({
	connectionLimit: INFINITE,
	password: SECRET,
	user: ADMINLTE,
	database: DEFAULTDATABASE,
	host: HOST,
	port: DEFAULTPORT
});

module.exports = pool;