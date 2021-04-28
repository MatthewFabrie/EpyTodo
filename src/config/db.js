'use strict';
const mysql = require('mysql');
const dbConn = mysql.createConnection({
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_ROOT_PASSWORD,
  database : 'epytodo'
});
dbConn.connect(function(err) {
  if (err) throw err;
  console.log("Database Connected!");
});
module.exports = dbConn;