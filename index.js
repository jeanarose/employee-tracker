// Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const clear = require("clear");
const console = require('console').default

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
          "View roles",
          "View departments",
          "Add employee",
          "Add role",
          "Add department",
          "Update employee",
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
        case "View roles":
          viewRoles();
          break;
        case "View departments":
          viewDepartments();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Add role":
          addRole();
          break;
        case "Add department":
          addDepartment();
          break;
        case "Update employee":
          updateEmployee();
          break;
        case "Exit":
          exit();
          break;
      }
    });
};

// ================ REQUIRED ================

// View employees
const viewEmployees = () => {
  const employeesQuery = `SELECT 
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
ON role.department_id = department.id;`;
  connection.query(employeesQuery, (err, data) => {
    if (err) throw err;
    clear();
    console.table(data);
    init();
  });
};

// View roles
const viewRoles = () => {
  const rolesQuery = `SELECT 
	role.id,
    title, name AS department, 
    CONCAT("$", salary) AS salary
FROM role
INNER JOIN department ON 
	department.id = role.department_id;`;
  connection.query(rolesQuery, (err, data) => {
    if (err) throw err;
    clear();
    console.table(data);
    init();
  });
};

// View departments
const viewDepartments = () => {
  const departmentsQuery = `SELECT department.id, name AS department
  FROM department;`;
  connection.query(departmentsQuery, (err, data) => {
    if (err) throw err;
    clear();
    console.table(data);
    init();
  });
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
    connection.query(`SELECT * FROM role;`, (err, data) => {
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
              clear();
              init();
            }
          );
        });
    });
  });
};

// Add roles
const addRole = () => {
  const roleQuery = `SELECT * FROM role;`;
  const departmentQuery = `SELECT * FROM department;`;
  connection.query(roleQuery, (err, data) => {
    if (err) throw err;
  });
  connection.query(departmentQuery, (err, data) => {
    if (err) throw err;
    const arrayOfDepartments = data.map((department) => {
      return { name: department.name, value: department.id };
    });
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the title of the role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
        },
        {
          type: "list",
          name: "department",
          message: "What department is the role in?",
          choices: arrayOfDepartments,
        },
      ])
      .then(({ title, salary, department }) => {
        connection.query(
          `INSERT INTO role (title, salary, department_id)
      VALUES (?, ?, ?);`,
          [title, salary, department],
          (err, data) => {
            if (err) throw err;
            clear();
            init();
          }
        );
      });
  });
};

// Add departments
const addDepartment = () => {
  const departmentQuery = `SELECT * FROM department;`;
  connection.query(departmentQuery, (err, data) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "What is the name of the department you'd like to add?",
          validate: (name) => {
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === name) {
                return "Department already exists!";
              }
            }
            return true;
          },
        },
      ])
      .then(({ name }) => {
        connection.query(departmentQuery, (err, data) => {
          if (err) throw err;

          connection.query(
            `INSERT INTO department (name)
          VALUES
            (?);`,
            [name],
            (err, data) => {
              if (err) throw err;
              init();
            }
          );
        });
      });
  });
};

// Update employee roles
const updateEmployee = () => {
  const employeeQuery = `SELECT * FROM employee;`;
  const roleQuery = `SELECT * FROM role;`;
  connection.query(employeeQuery, (err, data) => {
    if (err) throw err;
    const arrayOfEmployees = data.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    connection.query(roleQuery, (err, data) => {
      if (err) throw err;
      const arrayOfRoles = data.map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "employees",
            message: "Which employee would you like to update?",
            choices: arrayOfEmployees,
          },
          {
            type: "list",
            name: "role",
            message: "What is their new role?",
            choices: arrayOfRoles,
          },
        ])
        .then(({ employees, role }) => {
          const updateQuery = `UPDATE employee
    SET role_id = ?
      WHERE id = ?;`;
          connection.query(updateQuery, [role, employees], (err, data) => {
            if (err) throw err;
            viewEmployees();
            clear();
            init();
          });
        });
    });
  });
};

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
          `SELECT first_name, last_name, name AS department, title, 
          CONCAT("$", salary) AS salary
          FROM employee, department, role
          WHERE employee.role_id = role.id AND role.department_id = ? AND department.id = ?;`,
          [department, department],
          (err, data) => {
            if (err) throw err;
            if (data.length === 0) {
              console.log("There are no employees in this department.");
            } else {
              clear();
              console.table(data);
            }
            init();
          }
        );
      });
  });
};

// View employees by manager
// const viewEmployeesByManager = () => {
//   connection.query(`SELECT * FROM employee;`, (err, data) => {
//     if (err) throw err;
//     const arrayOfManagers = data.map((employee) => {
//       return {
//         name: `${employee.first_name} ${employee.last_name}`,
//         value: employee.manager_id,
//       };
//     });
//     console.log(arrayOfManagers);
//     inquirer
//       .prompt([
//         {
//           type: "list",
//           name: "managers",
//           message: "Which manager's employees would you like to view?",
//           choices: arrayOfManagers,
//         },
//       ])
//       .then(({ managers }) => {
//         console.log(managers);
//         // connection.query(
//         //   `SELECT first_name, last_name, name AS department, title,
//         //   CONCAT("$", salary) AS salary
//         //   FROM employee, department, role
//         //   WHERE ? = employee.id`,
//         //   [managers],
//         //   (err, data) => {
//         //     if (err) throw err;
//         //     if (data.length === 0) {
//         //       console.log("This manager does not oversee any employees.");
//         //     } else {
//         //       console.table(data);
//         //     }
//         //     init();
//         //   }
//         // );
//       });
//   });
// };

// Add employee
// Remove employee
// Update employee role
// Update employee manager
// View all roles

const exit = () => {
  connection.end();
};
