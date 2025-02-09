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
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'your_database_name',
}).promise(); // Important to add `.promise()` here

module.exports = db;

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
  app.post('/vote', (req, res) => {
    const { movieId, userId } = req.body;
  
    // Validate request body
    if (!movieId || !userId) {
      return res.status(400).json({ message: "Movie ID and User ID are required!" });
    }
  
    // Check if the vote already exists
    const checkVoteQuery = "SELECT * FROM votes WHERE movie_id = ? AND user_id = ?";
    db.query(checkVoteQuery, [movieId, userId], (err, results) => {
      if (err) {
        console.error("Database error while checking vote:", err);
        return res.status(500).json({ message: "Database error while checking vote." });
      }
  
      if (results.length > 0) {
        return res.status(400).json({ message: "User has already voted for this movie." });
      }
  
      // Insert new vote
      const insertVoteQuery = "INSERT INTO votes (movie_id, user_id) VALUES (?, ?)";
      db.query(insertVoteQuery, [movieId, userId], (err) => {
        if (err) {
          console.error("Error inserting vote:", err);
          return res.status(500).json({ message: "Failed to record vote." });
        }
        res.status(201).json({ message: "Vote recorded successfully!" });
      });
    });
  });
  
  
  
//api endpoint fetching voting results
app.get('/api/votes', (req, res) => {
  const query = `
    SELECT m.title, COUNT(v.vote_id) AS votes 
    FROM votes v 
    JOIN movies m ON v.movie_id = m.movie_id 
    GROUP BY m.title
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
//movies endpoint
app.get('/api/movies', async (req, res) => {
  const result = await db.query('SELECT * FROM movies');
  res.json(result);
});

//movie activation end point
app.put('/api/movies/:id/activate', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query('UPDATE movies SET is_active = ? WHERE movie_id = ?', [status, id]);
    res.json({ message: 'Movie status updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
