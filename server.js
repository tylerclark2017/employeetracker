const mysql = require('mysql2');
const inquirer = require('inquirer');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'employees_db'
  });
  
  // Connect to the database
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
    // Start your application logic here
    // For example, you can prompt the user for input using inquirer
    // and perform database queries based on user input
  });
  
  // Handle database errors
  connection.on('error', (err) => {
    console.error('Database error:', err);
  });
  
  // Close the database connection when the application exits
  process.on('exit', () => {
    connection.end();
  });