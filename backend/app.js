const express = require("express");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profiles");
const session = require("express-session");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/profiles", profileRoutes);
app.use("/auth", authRoutes);

// Routes
app.get("/", (req, res) => {
  res.status(200).send("Server is up and running");
});

const { requireAuth } = require("./middleware/auth");
app.get("/profile", requireAuth, (req, res) => {
  res.json({
    success: true,
    message: "This is a protected route",
    userId: req.session.userId,
  });
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
