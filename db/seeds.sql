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

-- Add employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
	("John", "Smith", 1, 2),
    ("Jane", "Doe", 5, 3),
    ("Hannah", "Johnson", 8, null),
    ("Paul", "Nelson", 7, 3);

-- Add roles
INSERT INTO role (title, salary, department_id)
VALUES 
	("Software Engineer", 85000, 2),
    ("Engineer Manager", 130000, 2),
    ("Sales Manager", 100000, 1),
    ("Sales Lead", 55000, 1),
	("Salesperson", 60000, 1),
	("Lead Engineer", 160000, 2),
	("Accountant", 100000, 3),
    ("Accountant Manager", 150000, 3),
    ("Legal Manager", 350000, 4),
	("Lawyer", 250000, 4),
    ("Software Engineer", 90000, 2),
	("Legal Team Lead", 80000, 4);

-- Add departments
INSERT INTO department (name)
VALUES 
	("Human Resources"),
    ("Marketing"),
    ("Operations");

-- Update employee roles
UPDATE employee
	SET role_id = 1
    WHERE id = 1;

-- BONUS:

-- Update employee managers

-- Delete departments

-- Delete roles

-- Delete employees