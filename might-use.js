// Add departments
const addDepartment = () => {
  const departmentQuery = `SELECT * FROM department;`;
  connection.query(departmentQuery, (err, data) => {
    if (err) throw err;
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the department you'd like to add?",
      },
    ])
    .then(({ name }) => {
      connection.query(departmentQuery, (err, data) => {
        if (err) throw err;
          if (data[0].name === name) {
            console.log("This department already exists!");
            init();
          } else {
            console.log("Department successfully added!")
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
          }
      });
    });
};