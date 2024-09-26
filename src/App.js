import React, { useState, useEffect, useCallback } from "react";
import MovieCard from "./MovieCard";
import SearchIcon from "./search.svg";
import "./App.css";

const API_URL = "http://www.omdbapi.com";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("Batman");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch movies from the API
  const searchMovies = useCallback(async (title) => {
    if (!title) return; // Skip API call if no search term is provided

    setLoading(true); // Set loading state
    setError(null);   // Clear previous errors

    try {
      const params = new URLSearchParams({
        apikey: "f2fc87ef",
        s: title,
      });
      const response = await fetch(`${API_URL}?${params.toString()}`);
      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search); // Set the movies if API returns valid data
      } else {
        setMovies([]);          // Clear the movies if none found
        setError(data.Error);   // Set error message from API
      }
    } catch (err) {
      setError("Failed to fetch movies. Please try again.");
    } finally {
      setLoading(false); // Stop the loading state
    }
  }, []);

  // Initial fetch of movies (search for "Batman" on page load)
  useEffect(() => {
    searchMovies(searchTerm);
  }, [searchTerm, searchMovies]);

  // Function to handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="app">
      <h1>MovieLand</h1>

      <div className="search">
        <input
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search for movies"
          onKeyPress={(e) => e.key === "Enter" && searchMovies(searchTerm)} // Trigger search on Enter
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchMovies(searchTerm)} // Trigger search on click
        />
      </div>

      {/* Loading state */}
      {loading && <h2>Loading...</h2>}

      {/* Error handling */}
      {error && !loading && (
        <div className="empty">
          <h2>{error}</h2>
        </div>
      )}

      {/* Movie results */}
      {movies?.length > 0 && !loading ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        !loading && !error && (
          <div className="empty">
            <h2>No movies found</h2>
          </div>
        )
      )}
    </div>
  );
};

export default App;
