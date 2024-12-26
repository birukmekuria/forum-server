const dbConnection = require("../config/dbConnection"); // Import the promise-based dbconnection

const createTables = async () => {
  try {
    // Users table
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT(20) AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(40) NOT NULL UNIQUE,
        firstname VARCHAR(40) NOT NULL,
        lastname VARCHAR(100) NOT NULL,
        email VARCHAR(40) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Users table created or already exists.");

    // Questions table
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        questionid VARCHAR(255) NOT NULL UNIQUE,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        tag VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log("Questions table created or already exists.");

    // Answers table
    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS answers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        questionid VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        answer TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (questionid) REFERENCES questions(questionid) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log("Answers table created or already exists.");
  } catch (err) {
    console.error("Error creating tables:", err.message);
  }
};

// Execute the table creation
createTables()
  .then(() => {
    console.log("All tables have been successfully created.");
    process.exit(0); // Exit the script after execution
  })
  .catch((err) => {
    console.error("Failed to create tables:", err.message);
    process.exit(1);
  });

module.exports = createTables;
