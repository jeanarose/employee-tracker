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
          console.log(department);
          connection.query(
            `SELECT first_name, last_name, department.id, name AS department
              FROM employee, department, role
              WHERE employee.role_id = role.id AND role.department_id = ?;`,
            [department],
            (err, data) => {
              if (err) throw err;
              console.table(data);
            }
          );
        });
    });
  };