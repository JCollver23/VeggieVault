import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import Auth from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { SEARCH_PLANTS } from "../utils/queries";

const SearchPlants = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // State for the search input
  const [plants, setPlants] = useState([]); // State to store search results
  const [noResults, setNoResults] = useState(false); // State to track if no plants are found

  // Apollo's useLazyQuery hook to execute the search query on demand
  const [searchPlants, { loading, error, data }] = useLazyQuery(SEARCH_PLANTS);

  useEffect(() => {
    // Check if the user is authenticated
    if (!Auth.loggedIn()) {
      // If not authenticated, redirect to the login page
      navigate("/login");
    }
  }, []);

  // Update plants state when data is returned from the query
  useEffect(() => {
    if (data && data.searchPlants) {
      setPlants(data.searchPlants);
      setNoResults(data.searchPlants.length === 0); // Set noResults to true if no plants are found
    }
  }, [data]);

  // Handle form submission for searching plants
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      searchPlants({ variables: { searchQuery } }); // Execute the query with the search input
      setNoResults(false); // Reset noResults state before the query runs
    }
  };

  return (
    <div>
      <h1>Search Plants</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a plant..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search input state
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {noResults && <p>No plants found for "{searchQuery}".</p>}

      <ul>
        {plants.map((plant: { _id: string; name: string; varieties: { variety: string }[] }) => (
          <li key={plant._id}>
            <h2>{plant.name}</h2>
            <p>
              Varieties:{" "}
              {plant.varieties.map((v) => v.variety).join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPlants;