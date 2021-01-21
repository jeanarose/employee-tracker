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

-- REQUIRED:

-- Add departments

-- Add roles

-- Add employees

-- View departments

-- View roles

-- View employees
SELECT 
	CONCAT(employee.first_name, " ", employee.last_name) AS employee,
	CONCAT(manager.first_name, " ", manager.last_name) AS manager,
    title, name AS department, salary
FROM employee
INNER JOIN employee manager ON 
	manager.id = employee.manager_id
INNER JOIN role ON 
	employee.role_id = role.id
INNER JOIN department
	ON role.department_id = department.id;

-- Update employee roles


-- BONUS:

-- Update employee managers

-- View employees by manager

-- View employees by department 
SELECT first_name, last_name, name AS department, title, salary
FROM employee, department, role
WHERE employee.role_id = role.id AND role.department_id = 1 AND department.id = 1;

-- Delete departments

-- Delete roles

-- Delete employees

-- View the total utilized budget of a department, ie the combined salaries of all employees in that department


-- VIEW TABLES 

SELECT * FROM employee;

SELECT * FROM role;

SELECT * FROM department;
