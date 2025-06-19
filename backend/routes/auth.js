const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("pg");
const router = express.Router();

// Register Route
router.post("/register"),
  async (req, res) => {
    try {
      const { email, password, role } = req.body;

      const existingUser = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (existingUser.rows.length > 0) {
        return (
          res.status(400),
          json({
            success: false,
            message: "User already exists",
          })
        );
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const newUser = await pool.query(
        "INSERT INTO  users  (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *",
        [email, hashedPassword, role]
      );

      // Create session
      req.session.userId = newUser.rows[0].id;
      req.session.userRole = newUser.rows[0].role;

      res.status(201).json({
        sucess: true,
        message: "User created successfully",
        user: {
          id: newUser.rows[0].id,
          email: newUser.rows[0].email,
          role: newUser.rows[0].role,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Registration Failed",
        error: error.message,
      });
    }
  };

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.row.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check Password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    req.session.userId = user.rows[0].id;
    req.session.userRole = user.rows[0].role;

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});
// Logout Route
