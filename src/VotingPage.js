import React, { useState } from "react";

const VotingPage = () => {
  // Sample movie data (replace this with your API or database)
  const movies = [
    { id: 1, title: "Inception" },
    { id: 2, title: "The Dark Knight" },
    { id: 3, title: "Interstellar" },
  ];

  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleVote = () => {
    if (selectedMovie) {
      alert(`Voted for: ${selectedMovie}`);
      // Send vote data to your backend API
    } else {
      alert("Please select a movie to vote for.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Vote for a Movie</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => setSelectedMovie(movie.title)}
            className={`p-4 rounded-lg cursor-pointer text-center ${
              selectedMovie === movie.title
                ? "bg-green-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {movie.title}
          </div>
        ))}
      </div>

      <button
        onClick={handleVote}
        className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl mt-4"
      >
        Submit Vote
      </button>
    </div>
  );
};

export default VotingPage;
