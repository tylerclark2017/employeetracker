const inquirer = require('inquirer');
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

function viewDepartments() {
    const departmentQuery = 'SELECT * FROM department';
    return connection.promise().query(departmentQuery)
}

function viewRoles() {
    const viewRolesQuery = 'SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id';
    return connection.promise().query(viewRolesQuery)
}

function viewEmployees() {
    const viewEmployeesQuery = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
                  FROM employee
                  LEFT JOIN role ON employee.role_id = role.id
                  LEFT JOIN department ON role.department_id = department.id
                  LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    return connection.promise().query(viewEmployeesQuery)
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:'
        }
    ]).then((answers) => {
        const name = answers.name;
        const query = `INSERT INTO department (name) VALUES ('${name}')`;
        return connection.promise().query(query);
    });
}

function addRole() {
    const departmentQuery = 'SELECT * FROM department';
    return connection.promise().query(departmentQuery)
    .then(([departments]) => {
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
            const addRoleQuery = `INSERT INTO role (title, salary, department_id) VALUES ('${title}', ${salary}, ${department_id})`;
            return connection.promise().query(addRoleQuery);
        });
    });
}

function addEmployee() {
    const roleQuery = 'SELECT * FROM role';
    const managerQuery = 'SELECT * FROM employee';
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
                const addEmployeeQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${role_id}, ${manager_id})`;
                return connection.promise().query(addEmployeeQuery);
            });
        });
    });
}

function updateEmployeeRole() {
    const employeeQuery = 'SELECT * FROM employee';
    const roleQuery = 'SELECT * FROM role';
    return connection.promise().query(employeeQuery)
    .then(([employees]) => {
        return connection.promise().query(roleQuery)
        .then(([roles]) => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: 'Select the employee to update:',
                    choices: employees.map((employee) => ({
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    }))
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the new role for the employee:',
                    choices: roles.map((role) => ({
                        name: role.title,
                        value: role.id
                    }))
                }
            ]).then((answers) => {
                const employee_id = answers.employee_id;
                const role_id = answers.role_id;
                const updateEmployeeRoleQuery = `UPDATE employee SET role_id = ${role_id} WHERE id = ${employee_id}`;
                return connection.promise().query(updateEmployeeRoleQuery);
            });
        });
    });
}

function searchEmployee() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'searchQuery',
            message: 'Enter the name or ID of the employee you want to search for:'
        }
    ]).then((answers) => {
        const searchQuery = answers.searchQuery;
        const searchEmployeeQuery = `SELECT * FROM employee WHERE first_name = '${searchQuery}' OR last_name = '${searchQuery}' OR id = '${searchQuery}'`;
        return connection.promise().query(searchEmployeeQuery);
    });
}

function updateEmployeeManager() {
    const employeeQuery = 'SELECT * FROM employee';
    return connection.promise().query(employeeQuery)
    .then(([employees]) => {
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Select the employee to update:',
                choices: employees.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }))
            },
            {
                type: 'list',
                name: 'new_manager_id',
                message: 'Select the new manager for the employee:',
                choices: employees.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }))
            }
        ]).then((answers) => {
            const employee_id = answers.employee_id;
            const new_manager_id = answers.new_manager_id;
            const updateEmployeeManagerQuery = `UPDATE employee SET manager_id = ${new_manager_id} WHERE id = ${employee_id}`;
            return connection.promise().query(updateEmployeeManagerQuery);
        });
    });
}

function viewEmployeesByManager() {
    const employeeQuery = 'SELECT * FROM employee';
    return connection.promise().query(employeeQuery)
    .then(([employees]) => {
        inquirer.prompt([
            {
                type: 'list',
                name: 'manager_id',
                message: 'Select the manager to view employees for:',
                choices: employees.map((employee) => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }))
            }
        ]).then((answers) => {
            const manager_id = answers.manager_id;
            const viewEmployeesbyManagerQuery = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
                          FROM employee
                          LEFT JOIN role ON employee.role_id = role.id
                          LEFT JOIN department ON role.department_id = department.id
                          LEFT JOIN employee manager ON employee.manager_id = manager.id
                          WHERE employee.manager_id = ${manager_id}`;
            return connection.promise().query(viewEmployeesbyManagerQuery);
        });
    });
}


module.exports = {viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, searchEmployee, updateEmployeeManager,viewEmployeesByManager}

