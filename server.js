const mysql = require('mysql2');
const inquirer = require('inquirer');
const { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, searchEmployee, updateEmployeeManager, viewEmployeesByManager } = require('./employee.js');

function startMenu () {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Select an action:',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Search for an employee', 'Exit']
    }
  ]).then((answers) => {
    // Handle user input based on selected action
    switch (answers.action) {
      case 'View all departments':
        viewDepartments().then(([results])=>{
        console.table(results);
        startMenu();
        });
        break;
      case 'View all roles':
        viewRoles().then(([results])=>{
          console.table(results);
          startMenu();
        });
        break;
      case 'View all employees':
        viewEmployees().then(([results])=>{
          console.table(results);
          startMenu();
        });
        // Implement logic to view all employees
        break;
      case 'Add a department':
        addDepartment().then(([results])=>{
          console.table(results);
          startMenu();
        });
        break;
      case 'Add a role':
        addRole().then(([results])=>{
          console.table(results);
          startMenu();
        });
        break;
      case 'Add an employee':
        addEmployee().then(([results])=>{
          console.table(results);
          startMenu();
        });
        // Implement logic to add a new employee
        break;
      case 'Update an employee role':
        updateEmployeeRole().then(([results])=>{
          console.table(results);
          startMenu();
        });
        break;
      case 'Search for employee':
        searchEmployee().then(([results])=>{
          console.table(results);
          startMenu();
        });
        break;
      default:
        console.log('Exiting application');
        process.exit(0);
    }
  });
}

startMenu();

// Close the database connection when the application exits
process.on('exit', () => {
  connection.end();
});