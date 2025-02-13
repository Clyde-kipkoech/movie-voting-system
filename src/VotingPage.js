import React, { useState, useEffect } from "react";
import { collection, addDoc, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { auth, db } from "./backend/firebase-config"; // Import Firebase auth and Firestore
import { onAuthStateChanged } from "firebase/auth"; // Auth state listener
import requests from "./requests";
import "./VotingPage.css";

const VotingPage = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userId, setUserId] = useState(null);
  const [votes, setVotes] = useState({}); // Store vote counts


  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set Firebase Auth UID
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3${requests.fetchTrending}`);
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    // Fetch votes and update counts in real time
    const votesRef = collection(db, "votes");
    const unsubscribe = onSnapshot(votesRef, (snapshot) => {
      const voteCounts = {};
      snapshot.forEach((doc) => {
        const { movieId } = doc.data();
        voteCounts[movieId] = (voteCounts[movieId] || 0) + 1;
      });
      setVotes(voteCounts);
    });

    return () => unsubscribe();
  }, []);

  const handleVote = async () => {
    if (!selectedMovie) {
      alert("Please select a movie to vote.");
      return;
    }
    if (!userId) {
      alert("You must be signed in to vote.");
      return;
    }
  
    // Ensure `selectedMovie.title` exists
    if (!selectedMovie.title) {
      console.error("Error: Movie title is undefined", selectedMovie);
      alert("Invalid movie selection. Please try again.");
      return;
    }
  
    try {
      const votesRef = collection(db, "votes");
  
      // Check if the user has already voted
      const q = query(votesRef, where("userId", "==", userId));
      const existingVote = await getDocs(q);
  
      if (!existingVote.empty) {
        alert("You have already voted!");
        return;
      }
  
      // Save the vote to Firestore
      await addDoc(votesRef, {
        userId: userId,
        movieId: selectedMovie.id,
        movieTitle: selectedMovie.title, // Ensure this is defined
        timestamp: new Date(),
      });
  
      alert("Vote recorded successfully!");
    } catch (error) {
      console.error("Voting error:", error);
      alert("Failed to record vote.");
    }
  };
  
  const goToHome = () => {
    window.location.href = "/"; // Redirect to the home page
  };



  return (
    <div className="voting-container">
      <h1 className="voting-title">Vote for Your Favorite Movie 🎥</h1>

      <div className="movie-grid">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => setSelectedMovie(movie)}
            className={`movie-card ${selectedMovie?.id === movie.id ? "selected-movie" : ""}`}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <h3>{movie.title}</h3>
            <p className="vote-count">Votes: {votes[movie.id] || 0}</p>
          </div>
        ))}
      </div>

      <button onClick={handleVote} className="vote-button">
        Submit Your Vote
      </button>
      <button onClick={goToHome} className="home-button">
        Go to Home
      </button>

    </div>
  );
};

export default VotingPage;
