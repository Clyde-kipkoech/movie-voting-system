import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [votingResults, setVotingResults] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch voting results
    fetch('http://localhost:3000/api/votes')
      .then((response) => response.json())
      .then((data) => setVotingResults(data))
      .catch((error) => console.error('Error fetching voting results:', error));

    // Fetch movies list
    fetch('http://localhost:3000/api/movies')
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error('Error fetching movies:', error));
  }, []);

  // Toggle movie activation status
  const toggleMovieStatus = (id, currentStatus) => {
    fetch(`http://localhost:3000/api/movies/${id}/activate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: !currentStatus }),
    })
      .then(() => {
        setMovies((prev) =>
          prev.map((movie) =>
            movie.id === id ? { ...movie, is_active: !currentStatus } : movie
          )
        );
      })
      .catch((error) => console.error('Error updating movie status:', error));
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* Navigate to Voting Page */}
      <Link to="/voting" className="voting-link">
        Go to Voting Page
      </Link>

      {/* Display Voting Results */}
      <h2 className="results-title">Voting Results:</h2>
      <ul className="results-list">
        {votingResults.map((movie, index) => (
          <li key={index} className="result-item">
            {movie.title}: {movie.votes} votes
          </li>
        ))}
      </ul>

      {/* Movie Activation Control */}
      <h2 className="results-title">Manage Movies:</h2>
      <ul className="results-list">
        {movies.map((movie) => (
          <li key={movie.id} className="result-item">
            {movie.title}{' '}
            <button
              onClick={() => toggleMovieStatus(movie.id, movie.is_active)}
            >
              {movie.is_active ? 'Deactivate' : 'Activate'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;

