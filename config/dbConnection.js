//Configure Database Connection
const mysql2 = require("mysql2");

// Database connection pool
const dbConnection = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});


// Export the promise-based connection
module.exports = dbConnection.promise();
