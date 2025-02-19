import express from "express";
import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore"; // Firestore functions
import cors from "cors";
import validator from "email-validator";

const app = express();
app.use(express.json());
app.use(cors());

// Endpoint to sign up a new user
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Validate email format
  if (!validator.validate(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    res.status(200).json({ message: `User ${user.email} signed up successfully!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to handle votes
app.post("/vote", async (req, res) => {
  const { userId, movieId } = req.body;

  if (!userId || !movieId) {
    return res.status(400).json({ error: "User ID and Movie ID are required" });
  }

  try {
    const votesRef = collection(db, "votes");

    // Add vote to Firestore
    await addDoc(votesRef, {
      userId: userId,
      movieId: movieId,
      timestamp: new Date(),
    });

    // Update winning movie
    await updateWinningMovie();

    res.status(200).json({ message: "Vote recorded successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to update the winning movie
const updateWinningMovie = async () => {
  const votesRef = collection(db, "votes");
  const snapshot = await getDocs(votesRef);

  const voteCounts = {};
  snapshot.forEach((doc) => {
    const { movieId } = doc.data();
    voteCounts[movieId] = (voteCounts[movieId] || 0) + 1;
  });

  // Find the movie with the highest votes
  const winningMovieId = Object.keys(voteCounts).reduce((a, b) => (voteCounts[a] > voteCounts[b] ? a : b));
  const winningVotes = voteCounts[winningMovieId];

  const winningMovieRef = doc(db, "winningMovie", "current");
  await updateDoc(winningMovieRef, {
    movieId: winningMovieId,
    votes: winningVotes,
  });
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
