import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for API calls
import requests from "./requests";
import "./VotingPage.css";

const VotingPage = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

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

  const handleVote = async () => {
    if (!selectedMovie) {
      alert("Please select a movie to vote.");
      return;
    }

    try {
      // Replace `userId` with the actual logged-in user ID if available
      const userId = 1; 
      const response = await axios.post("http://localhost:3000/vote", {
        movieId: selectedMovie.id,
        userId: userId,
      });

      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to record vote.");
    }
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
          </div>
        ))}
      </div>

      <button onClick={handleVote} className="vote-button">
        Submit Your Vote
      </button>
    </div>
  );
};

export default VotingPage;
