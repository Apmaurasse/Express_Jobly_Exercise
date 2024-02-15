const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.
// Function to generate SQL SET clause for partial updates.
// Parameters:
// - dataToUpdate: An object containing the data to be updated in the database.
// - jsToSql: An object mapping JavaScript property names to their corresponding SQL column names.
// Throws a BadRequestError if no data is provided for updating.
// Ensures that dataToUpdate is not an empty object before calling this function.


function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
 // Example Usage:
// const dataToUpdate = { firstName: 'John', age: 30 };
// const jsToSql = { firstName: 'first_name' };
// const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql);
// console.log(setCols); // Output: "first_name"=$1, "age"=$2
// console.log(values); // Output: ['John', 30]


  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

// Returns an object with properties:
// - setCols: A string containing comma-separated column names and placeholders for values in the SQL SET clause.
// - values: An array containing the values to be used in the SQL statement.

// If a column name in the database differs from its corresponding JavaScript property name,
// provide a mapping in the jsToSql object. If no mapping is provided, the default column name is used.
// Example: { firstName: 'first_name' } maps the JavaScript property 'firstName' to the SQL column 'first_name'.


  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
