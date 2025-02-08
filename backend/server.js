const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const app = express();



const allowedOrigins = ["http://localhost:3001", "*"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Clyde@123",
  database: "movie_voting_system",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to the database!");
});

// Signup API with bcrypt hashing
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const query = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(query, [email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error inserting user:", err.message);
        return res.status(500).json({ message: "Signup failed!" });
      }
      res.status(201).json({ message: "User registered successfully!" });
    });
  } catch (error) {
    res.status(500).json({ message: "Hashing failed!" });
  }
});


// Signin Api endpoint
app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT email, password, role FROM users WHERE email = ?";

  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error." });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    res.status(200).json({
      message: "Sign-in successful!",
      role: user.role,
    });
  });
});


  //voting end point
  // Voting API endpoint
app.post("/vote", (req, res) => {
  const { movieId, userId } = req.body;

  if (!movieId || !userId) {
    return res.status(400).json({ message: "Movie ID and User ID are required!" });
  }

  const query = "INSERT INTO votes (movie_id, user_id) VALUES (?, ?)";
  
  db.query(query, [movieId, userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Failed to record vote." });
    }
    res.status(201).json({ message: "Vote recorded successfully!" });
  });
});



app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
