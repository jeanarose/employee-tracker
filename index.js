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
        choices: ["View all employees", "Exit"],
      },
    ])
    .then((data) => {
      switch (data.action) {
        case "View all employees":
          viewEmployees();
          break;
        case "Exit":
          exit();
          break;
      }
    });
};

const viewEmployees = () => {
  connection.query(`SELECT * FROM employee;`, (err, data) => {
    if (err) throw err;
    console.table(data);
    const arrayOfEmployees = data.map((employee) => {
      return {
        name: employee.first_name + " " + employee.lastName,
        value: employee.id,
      };
    });
    init();
  });
};

const exit = () => {
  connection.end();
};

// View all employees by department
// View employees by manager
// Add employee
// Remove employee
// Update employee role
// Update employee manager
// View all roles 