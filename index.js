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
          "Add employee",
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
        case "Add employee":
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
    `SELECT 
    employee.id,
    CONCAT(employee.first_name, " ", employee.last_name) AS employee,
      title, name AS department, 
      CONCAT("$", salary) AS salary,
      CONCAT(manager.first_name, " ", manager.last_name) AS manager
  FROM employee
  INNER JOIN employee manager ON 
    manager.id = employee.manager_id
  INNER JOIN role ON 
    employee.role_id = role.id
  INNER JOIN department
    ON role.department_id = department.id;`,
    (err, data) => {
      if (err) throw err;
      console.table(data);
      init();
    }
  );
};

// Add employees
const addEmployee = () => {
  connection.query(`SELECT * FROM employee;`, (err, data) => {
    if (err) throw err;
    const arrayOfManagers = data.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    connection.query(`SELECT title FROM role;`, (err, data) => {
      if (err) throw err;
      const arrayOfRoles = data.map((role) => {
        return { name: role.title, value: role.id };
      });
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?",
          },
          {
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: arrayOfRoles,
          },
          {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: arrayOfManagers,
          },
        ])
        .then(({ firstName, lastName, role, manager }) => {
          connection.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`,
            [firstName, lastName, role, manager],
            (err, data) => {
              if (err) throw err;
              init();
            }
          );
        });
    });
  });
};

// Add roles

// Add departments

// Update employee roles

// ================ BONUS ================

// View all employees by department
const viewEmployeesByDepartment = () => {
  connection.query(`SELECT * FROM department;`, (err, data) => {
    if (err) throw err;
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
            if (data.length === 0) {
              console.log("There are no employees in this department.");
            } else {
              console.table(data);
            }
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
