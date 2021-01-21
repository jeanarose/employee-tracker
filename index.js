// Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "moose",
  database: "employee_DB",
});

connection.connect((err) => {
  if (err) throw err;
  init();
});

const init = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View all employees",
          "View employees by department",
          "Add an employee",
          "Exit",
        ],
      },
    ])
    .then((data) => {
      switch (data.action) {
        case "View all employees":
          viewEmployees();
          break;
        case "View employees by department":
          viewEmployeesByDepartment();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Exit":
          exit();
          break;
      }
    });
};

// ================ REQUIRED ================

const viewEmployees = () => {
  connection.query(
    `SELECT first_name, last_name,title, name AS department, manager_id, salary
  FROM employee
  INNER JOIN role
      on employee.role_id = role.id 
  INNER JOIN department
      on role.department_id = department.id;`,
    (err, data) => {
      if (err) throw err;
      console.table(data);
      init();
    }
  );
};

// Add employees
const addEmployee = () => {
  connection.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES 
        ("John", "Smith", 1, 2);`,
    (err, data) => {
      if (err) throw err;
      console.table(data);
      init();
    }
  );
};

// Add roles

// Add departments

// Update employee roles

// ================ BONUS ================

// View all employees by department
const viewEmployeesByDepartment = () => {
  connection.query(`SELECT * FROM department;`, (err, data) => {
    if (err) throw err;
    console.log(data);
    const arrayOfDepartments = data.map((department) => {
      return { name: department.name, value: department.id };
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "Which department would you like to view?",
          choices: arrayOfDepartments,
        },
      ])
      .then(({ department }) => {
        connection.query(
          `SELECT first_name, last_name, name AS department, title, salary
          FROM employee, department, role
          WHERE employee.role_id = role.id AND role.department_id = ? AND department.id = ?;`,
          [department, department],
          (err, data) => {
            if (err) throw err;
            console.table(data);
            init();
          }
        );
      });
  });
};

// View employees by manager

// Add employee
// Remove employee
// Update employee role
// Update employee manager
// View all roles

const exit = () => {
  connection.end();
};
