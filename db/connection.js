const mysql = require('mysql2');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Catsare#1',
    database: 'employees_db'
  });
  
  // Connect to the database
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
  });

  module.exports = connection;