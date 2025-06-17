const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Server is up and running");
});

// Test the postgres Database
app.get("/test-db", async (req, res) => {
  try {
    const { Pool } = require("pg");

    const pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 5432,
    });

    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      message: "Database connected!",
      timestamp: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

module.exports = app;
