const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userModel } = require("../model/user");

const userRouter = express.Router();

// This is a sample route to verify that the user route is working.
userRouter.get("/", (req, res) => {
  res.send("User route working");
});

// Route for user registration.
userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the user's password before saving it to the database.
    const hash = await bcrypt.hash(password, 10); // Use a stronger salt factor.

    // Check if a user with the given email already exists in the database.
    const isExisting = await userModel.findOne({ email });

    if (isExisting) {
      res.status(400).json({ message: "User already exists, please login" });
    } else {
      // Create a new user document with the hashed password.
      const newUser = new userModel({ name, email, password: hash });
      await newUser.save();

      res.status(201).json({ message: "New user registered" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// Route for user login.
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by their email in the database.
    const user = await userModel.findOne({ email });

    if (user) {
      // Compare the provided password with the hashed password in the database.
      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (passwordsMatch) {
        // Create a JWT token for the user's successful login.
        const token = jwt.sign({ userID: user._id }, "secret", {
          expiresIn: "1h", // Token expiration time (e.g., 1 hour)
        });

        res.json({ message: "Logged in", token: token });
      } else {
        res.status(401).json({ message: "Wrong password" });
      }
    } else {
      res.status(401).json({ message: "Wrong credentials" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

module.exports = { userRouter };
