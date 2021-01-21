DROP DATABASE IF EXISTS employee_DB;

CREATE DATABASE employee_DB;

USE employee_DB;

CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
	salary DECIMAL(10,0),
    department_id INTEGER NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE department (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

-- View all employees 
SELECT first_name, last_name,title, name AS department, manager_id, salary
FROM employee
INNER JOIN role
    on employee.role_id = role.id 
INNER JOIN department
    on role.department_id = department.id;



-- View employees by department 
SELECT first_name, last_name, name AS department, title, salary
FROM employee, department, role
WHERE employee.role_id = role.id AND role.department_id = 1 AND department.id = 1;

SELECT * FROM employee;

SELECT * FROM role;

SELECT * FROM department;

-- Display managers by name in table
