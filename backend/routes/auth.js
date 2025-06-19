const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("pg");
const router = express.Router();

// Register Route
router.post("/register"),
  async (req, res) => {
    try {
      const { email, password, role } = req.body;

      const existingUser = await pool.Query(
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
      const newUser = await pool.Query(
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
