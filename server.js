const mysql = require('mysql2');
const inquirer = require('inquirer');

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
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Select an action:',
      choices: ['View all employees', 'Add employee', 'Update employee role', 'Delete employee', 'Exit']
    }
  ]).then((answers) => {
    // Handle user input based on selected action
    switch (answers.action) {
        case 'View all departments':
            break;
        case 'View all roles':
            break;
      case 'View all employees':
        // Implement logic to view all employees
        break;
      case 'Add employee':
        // Implement logic to add a new employee
        break;
        case 'Search for employee':
    inquirer.prompt([
        {
            type: 'input',
            name: 'searchQuery',
            message: 'Enter the name or ID of the employee you want to search for:'
        }
    ]).then((answers) => {
        const searchQuery = answers.searchQuery;
        // Implement logic to search for the employee in the database
        const query = `SELECT * FROM employee WHERE first_name = '${searchQuery}' OR id = '${searchQuery}'`;
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error executing search query:', err);
                return;
            }
            if (results.length === 0) {
                console.log('No employee found with the provided search query.');
            } else {
                console.log('Search results:', results);
            }
        });
    });
    break;
      // Add cases for other actions
      case 'Add a role':
      break;
      case 'Add a department':
        break;
      case 'Update an employee role':
        break;
      default:
        console.log('Exiting application');
        process.exit(0);
    }
  });
  // Query to retrieve all employees
connection.query('SELECT * FROM employee', (err, results) => {
  if (err) {
    console.error('Error executing query:', err);
    return;
  }
  console.log('Employees:', results);
});

  // Handle database errors
  connection.on('error', (err) => {
    console.error('Database error:', err);
  });
  
  // Close the database connection when the application exits
  process.on('exit', () => {
    connection.end();
  });