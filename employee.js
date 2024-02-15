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
    const query = 'SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
        console.table(results);
    });
}

function viewEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
                  FROM employee
                  LEFT JOIN role ON employee.role_id = role.id
                  LEFT JOIN department ON role.department_id = department.id
                  LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
        console.table(results);
    });
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
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return;
            }
            console.log(`Added department with ID ${results.insertId}.`);
        });
    });
}

function addRole() {
    const departmentQuery = 'SELECT * FROM department';
    connection.query(departmentQuery, (err, departments) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
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
            const query = `INSERT INTO role (title, salary, department_id) VALUES ('${title}', ${salary}, ${department_id})`;
            connection.query(query, (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return;
                }
                console.log(`Added role with ID ${results.insertId}.`);
            });
        });
    });
}

function addEmployee() {
    const roleQuery = 'SELECT * FROM role';
    const managerQuery = 'SELECT * FROM employee';
    connection.query(roleQuery, (err, roles) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
        connection.query(managerQuery, (err, managers) => {
            if (err) {
                console.error('Error executing query:', err);
                return;
            }
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
                const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${role_id}, ${manager_id})`;
                connection.query(query, (err, results) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        return;
                    }
                    console.log(`Added employee with ID ${results.insertId}.`);
                });
            });
        });
    });
}

function updateEmployeeRole() {
    const employeeQuery = 'SELECT * FROM employee';
    const roleQuery = 'SELECT * FROM role';
    connection.query(employeeQuery, (err, employees) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
        connection.query(roleQuery, (err, roles) => {
            if (err) {
                console.error('Error executing query:', err);
                return;
            }
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
                const query = `UPDATE employee SET role_id = ${role_id} WHERE id = ${employee_id}`;
                connection.query(query, (err, results) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        return;
                    }
                    console.log(`Updated employee with ID ${employee_id} with new role.`);
                });
            });
        });
    });
}

function searchEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'searchQuery',
            message: 'Enter the name or ID of the employee you want to search for:'
        }
    ]).then((answers) => {
        const searchQuery = answers.searchQuery;
        const query = `SELECT * FROM employee WHERE first_name = '${searchQuery}' OR last_name = '${searchQuery}' OR id = '${searchQuery}'`;
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
}

function updateEmployeeManager() {
    const employeeQuery = 'SELECT * FROM employee';
    connection.query(employeeQuery, (err, employees) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
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
            const query = `UPDATE employee SET manager_id = ${new_manager_id} WHERE id = ${employee_id}`;
            connection.query(query, (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return;
                }
                console.log(`Updated employee with ID ${employee_id} with new manager.`);
            });
        });
    });
}

function viewEmployeesByManager() {
    const employeeQuery = 'SELECT * FROM employee';
    connection.query(employeeQuery, (err, employees) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
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
            const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
                          FROM employee
                          LEFT JOIN role ON employee.role_id = role.id
                          LEFT JOIN department ON role.department_id = department.id
                          LEFT JOIN employee manager ON employee.manager_id = manager.id
                          WHERE employee.manager_id = ${manager_id}`;
            connection.query(query, (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    return;
                }
                console.table(results);
            });
        });
    });
}

module.exports = {viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, searchEmployee, updateEmployeeManager,viewEmployeesByManager}

