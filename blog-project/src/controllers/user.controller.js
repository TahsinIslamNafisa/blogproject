const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { successResponse, errorResponse } = require("../utils/response.util");

// Temporary database (array) - পরে MongoDB দিয়ে replace হবে
const users = [];

// User Registration
const registerUser = (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return errorResponse(res, 400, "User already exists.");
    }

    // Password encrypt করো
    const hashedPassword = bcrypt.hashSync(password, 10);

    // New user তৈরি করো
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    return successResponse(res, 201, "User registered successfully", {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    return errorResponse(res, 500, "Registration failed", error.message);
  }
};

// User Login
const loginUser = (req, res) => {
  try {
    const { email, password } = req.body;

    // User খোঁজো
    const user = users.find((user) => user.email === email);
    if (!user) {
      return errorResponse(res, 404, "User not found.");
    }

    // Password চেক করো
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, "Invalid password.");
    }

    // Token তৈরি করো
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return successResponse(res, 200, "User login successful", { token });
  } catch (error) {
    return errorResponse(res, 500, "Login failed", error.message);
  }
};

module.exports = { registerUser, loginUser };