import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, doc, getDoc } from "firebase/firestore";
import { auth, db } from "./backend/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import requests from "./requests";
import "./VotingPage.css";

const VotingPage = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userId, setUserId] = useState(null);
  const [votes, setVotes] = useState({});
  const [winningMovie, setWinningMovie] = useState(null); // Store the winning movie

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
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
    const votesRef = collection(db, "votes");
    const unsubscribe = onSnapshot(votesRef, (snapshot) => {
      const voteCounts = {};
      snapshot.forEach((doc) => {
        const { movieId } = doc.data();
        voteCounts[movieId] = (voteCounts[movieId] || 0) + 1;
      });
      setVotes(voteCounts);
  
      // Determine the winning movie
      const winningMovieId = Object.keys(voteCounts).reduce((a, b) => 
        voteCounts[a] > voteCounts[b] ? a : b, null
      );
  
      if (winningMovieId) {
        // Get the movie details from `movies` state
        const winningMovieDetails = movies.find(movie => movie.id === parseInt(winningMovieId));
        if (winningMovieDetails) {
          setWinningMovie({
            title: winningMovieDetails.title,
            votes: voteCounts[winningMovieId],
            poster: winningMovieDetails.poster_path,
          });
        }
      }
    });
  
    return () => unsubscribe();
  }, [movies]); // Depend on `movies` to get movie details
  
  useEffect(() => {
    const fetchWinningMovie = async () => {
      const docRef = doc(db, "winningMovie", "current");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setWinningMovie(docSnap.data());
      }
    };

    fetchWinningMovie();
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

    try {
      await addDoc(collection(db, "votes"), {
        userId: userId,
        movieId: selectedMovie.id,
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
      {winningMovie ? (
  <div className="winner-announcement">
    <h2>🏆 Winning Movie: {winningMovie.title}</h2>
    <p>Votes: {winningMovie.votes}</p>
    <img 
      src={`https://image.tmdb.org/t/p/w500${winningMovie.poster}`} 
      alt={winningMovie.title} 
      className="winning-movie-poster"
    />
  </div>
) : (
  <h2>No votes yet</h2>
)}
       : (
        <>
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
        </>
      )

      <button onClick={goToHome} className="home-button">
        Go to Home
      </button>
    </div>
  );
};

export default VotingPage;
