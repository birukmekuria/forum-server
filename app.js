require("dotenv").config();
const cors = require("cors");
const express = require("express");
const dbConnection = require("./config/dbConnection");
const createTable = require("./migrations/createTables");
// const userRoutes =require("./routes/userRoutes")

const app = express();
const port = process.env.PORT || 5500;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON data

// Import routes and authentication middleware
// const userRoutes = require("./routes/userRoute");
// const questionRoutes = require("./routes/questionRoute");
// const answerRoutes = require("./routes/answerRoute");
// const authMiddleware = require("./middleware/authMiddleware");

// Route middlewares
// app.use("/api/users", userRoutes);
// app.use("/api/questions", authMiddleware, questionRoutes);
// app.use("/api/answers", authMiddleware, answerRoutes);

// Server Start Function
async function start() {
  try {
    // Test database connection
    console.log("Connecting to the database...");
    const connectionTest = await dbConnection.query("SELECT 'test'");
    console.log("Database connection successful:", connectionTest);

    // Create tables
    await createTable();
    console.log("Ensuring required tables exist...");

    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error during startup:", error.message);
    process.exit(1); // Exit if there is a critical failure
  }
}

// Call the start function
start();
