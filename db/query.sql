-- Query to view all employees
SELECT * FROM employee;

-- Query to update an employee's role
UPDATE employee SET role_id = 2 WHERE id = 1;

-- Query to calculate the total utilized budget of a department
SELECT department.name, SUM(role.salary) AS total_budget
FROM department
JOIN role ON department.id = role.department_id
GROUP BY department.name;

INSERT INTO department (name) VALUES ('New Department');

-- Query to add a role
-- Replace 'New Role' with the name of the new role, '1000' with the salary, and 'IT' with the department ID
INSERT INTO role (title, salary, department_id) VALUES ('New Role', 1000, 'IT');

-- Query to add an employee
-- Replace 'John' with the first name, 'Doe' with the last name, '1' with the role ID, and '100' with the manager ID
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, 100);

-- Query to search for an employee by name or ID
-- Replace 'John' with the name or ID of the employee to search for
SELECT * FROM employee WHERE first_name = 'John' OR last_name = 'John' OR id = 'John';