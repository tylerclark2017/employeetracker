const inquirer = require('inquirer');
const { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, searchEmployee } = require('./db/employee.js');

function startMenu() {
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
        viewDepartments().then(([results]) => {
          console.table(results);
          startMenu();
        });
        break;
      case 'View all roles':
        viewRoles().then(([results]) => {
          console.table(results);
          startMenu();
        });
        break;
      case 'View all employees':
        viewEmployees().then(([results]) => {
          console.table(results);
          startMenu();
        });
        // Implement logic to view all employees
        break;
      case 'Add a department':
        inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:'
          }
        ])
          .then((answers) => {
            const name = answers.name;
            addDepartment(name).then(([results]) => {
              console.table(results);
              startMenu();
            })
          });
        break;
      case 'Add a role':
        viewDepartments().then(([departments]) => {
          inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the role:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for the role:'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the department for the role:',
                choices: departments.map((department) => ({
                    name: department.name,
                    value: department.id
                }))
            }
        ]).then((answers) => {
            const title = answers.title;
            const salary = answers.salary;
            const department_id = answers.department_id;
            addRole(title, salary, department_id).then(([results]) => {
              console.table(results);
              startMenu();
            });
        });
    });       
        break;
      case 'Add an employee':
      return connection.promise().query(roleQuery)
        .then(([roles]) => {
          return connection.promise().query(managerQuery)
            .then(([managers]) => {
              inquirer.prompt([
                {
                  type: 'input',
                  name: 'first_name',
                  message: 'Enter the first name of the employee:'
                },
                {
                  type: 'input',
                  name: 'last_name',
                  message: 'Enter the last name of the employee:'
                },
                {
                  type: 'list',
                  name: 'role_id',
                  message: 'Select the role for the employee:',
                  choices: roles.map((role) => ({
                    name: role.title,
                    value: role.id
                  }))
                },
                {
                  type: 'list',
                  name: 'manager_id',
                  message: 'Select the manager for the employee:',
                  choices: managers.map((manager) => ({
                    name: `${manager.first_name} ${manager.last_name}`,
                    value: manager.id
                  }))
                }
              ]).then((answers) => {
                const first_name = answers.first_name;
                const last_name = answers.last_name;
                const role_id = answers.role_id;
                const manager_id = answers.manager_id;
      
                switch (answers.choice) {
                  case 'Add a new employee':
                    addEmployee(first_name, last_name, role_id, manager_id).then(([results]) => {
                      console.table(results);
                      startMenu();
                    });
                    break;
                  case 'Update an employee role':
                    updateEmployeeRole().then(([results]) => {
                      console.table(results);
                      startMenu();
                    });
                    break;
                  case 'Search for employee':
                    searchEmployee().then(([results]) => {
                      console.table(results);
                      startMenu();
                    });
                    break;
                }
              });
            });
        });
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