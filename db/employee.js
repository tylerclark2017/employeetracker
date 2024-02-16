const inquirer = require('inquirer');
const connection = require('./connection');

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

function addDepartment(name) {
    const addDepartmentQuery = 'INSERT INTO department (name) VALUES (?)';
     return connection.promise().query(addDepartmentQuery, name);
}

function addRole(title, salary, department_id) {
            const addRoleQuery = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            const  roleParams = [title, salary, department_id];
            return connection.promise().query(addRoleQuery, roleParams);
            
};

function addEmployee(first_name, last_name, role_id, manager_id) {
                const addEmployeeQuery = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                const employeeParams =[first_name, last_name, role_id, manager_id];
                return connection.promise().query(addEmployeeQuery, employeeParams);
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

