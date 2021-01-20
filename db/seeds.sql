DROP DATABASE IF EXISTS employee_DB;

CREATE DATABASE employee_DB;

USE employee_DB;

CREATE TABLE department (
    id INTEGER NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
	salary DECIMAL(10,0),
    department_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY(department_id) REFERENCES department(id)
);



CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY(role_id) REFERENCES role(id),
    FOREIGN KEY(manager_id) REFERENCES role(id)
);

INSERT INTO department (name)
VALUES ("Information Systems");

INSERT INTO role (title, salary)
VALUES ("Software Engineer", 65000);

INSERT INTO employee (first_name, last_name)
VALUES ("Jeana Rose","Mathis");


SELECT * FROM employee;

SELECT * FROM role;

SELECT * FROM department;

