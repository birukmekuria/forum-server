const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../config/dbConnection");

async function register(req, res) {
  //Extracting data sent by the user(Extract input data)
  const { username, firstname, lastname, email, password } = req.body;

  // Validate input data
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all the required fields" });
  }

  try {
    // Check for existing username or email
    const users = await dbConnection.execute(
      `SELECT username, email FROM users WHERE username=? OR email=?`,
      [username, email]
    );

    if (users.length > 0) {
      const foundUser = users[0];
      if (foundUser.username === username) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: "Username already exists",
        });
      }
      if (foundUser.email === email) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: "Email already exists",
        });
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into the database
    const query = `INSERT INTO users(username, firstname, lastname, email, hashedPassword) VALUES (?,?,?,?,?)`;
    const values = [username, firstname, lastname, email, hashedPassword];

    await dbConnection.execute(query, values);

    res.status(StatusCodes.CREATED).json({
      msg: "User successfully created",
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong, please try again later",
    });
  }
}

const login = async (req, res) => {
  // Retrieve the user data (email & password)
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please provide both email and password",
    });
  }

  // Query to retrieve user data
  const query = `SELECT id AS user_id, username, firstname, lastname, email, password AS hashedPassword FROM users WHERE email = ?`;
  const values = [email];

  try {
    const [rows] = await dbConnection.execute(query, values); // Execute query

    if (rows.length === 0) {
      // User with the provided email does not exist
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Invalid email or password",
      });
    }

    const user = rows[0]; // Extract user data

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!isMatch) {
      // Password mismatch
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Invalid email or password",
      });
    }

    // Generate a JWT (jsonwebtoken)
    const token = jwt.sign(
      { username: user.username, user_id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set the token in response header
    res.set("Authorization", `Bearer ${token}`);

    // Send response
    return res.status(StatusCodes.OK).json({
      msg: "Login successful",
      user: {
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (error) {
    // Log the error and send a generic error response
    console.error("Error during login:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "An error occurred during login. Please try again later.",
    });
  }
};


module.exports = { register, login };
