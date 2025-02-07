const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const app = express();


app.use(cors());
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


// Signin API endpoint
app.post("/signin", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }
  
    // Example query for verification
    const query = "SELECT password FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Internal server error." });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password." });
      }
  
      const storedPassword = results[0].password;
      const isPasswordMatch = await bcrypt.compare(password, storedPassword);
  
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid email or password." });
      }
  
      res.status(200).json({ message: "Sign-in successful!" });
    });
  });
  

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
