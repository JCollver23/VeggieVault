import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { SEARCH_PLANTS } from "../utils/queries";
import { SAVE_PLANT } from "../utils/mutations";

const SearchPlants = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // State for the search input
  const [plants, setPlants] = useState([]); // State to store search results
  const [noResults, setNoResults] = useState(false); // State to track if no plants are found

  // Apollo's useLazyQuery hook to execute the search query on demand
  const [searchPlants, { loading, error, data }] = useLazyQuery(SEARCH_PLANTS);
  const [savePlant] = useMutation(SAVE_PLANT);

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

  const handleSave = async (plantId: any, varietyId: any) => {
    try {
      await savePlant({
        variables: { plantId, varietyId },
      });
      alert("Plant variety saved to your SeedBox!");
    } catch (err) {
      console.error(err);
      alert("Failed to save plant variety.");
    }
  };

  const searchTerm = searchQuery.toLowerCase();

  const sortedVarieties = plants.flatMap((plant: any) =>
    plant.varieties.map((variety: any) => ({
      ...variety,
      plantName: plant.name,
      plantId: plant._id, // Include plant ID
      fullName: `${variety.variety} ${plant.name}`.toLowerCase(),
    })))
    .sort((a, b) => {
      const aName = a.fullName;
      const bName = b.fullName;

      const aStarts = aName.startsWith(searchTerm);
      const bStarts = bName.startsWith(searchTerm);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      const aIncludes = aName.includes(searchTerm);
      const bIncludes = bName.includes(searchTerm);

      if (aIncludes && !bIncludes) return -1;
      if (!aIncludes && bIncludes) return 1;

      return aName.localeCompare(bName);
    });




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
        {sortedVarieties.map((variety: any, index: number) => {
          const formattedTitle = `${variety.variety} ${variety.plantName}`;
          return (
            <li key={`${formattedTitle}-${index}`}>
              <h2>{formattedTitle}</h2>
               <button onClick={() => handleSave(variety.plantId, variety._id)}>+</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchPlants;