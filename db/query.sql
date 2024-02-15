-- Query to view all employees
SELECT * FROM employee;

-- Query to update an employee's role
UPDATE employee SET role_id = 2 WHERE id = 1;

-- Query to calculate the total utilized budget of a department
SELECT department.name, SUM(role.salary) AS total_budget
FROM department
JOIN role ON department.id = role.department_id
GROUP BY department.name;