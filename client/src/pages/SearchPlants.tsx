import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { SEARCH_PLANTS } from "../utils/queries";
import { SAVE_PLANT } from "../utils/mutations";

const SearchPlants = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); 
  const [plants, setPlants] = useState([]); 
  const [noResults, setNoResults] = useState(false); 


  const [searchPlants, { loading, error, data }] = useLazyQuery(SEARCH_PLANTS);
  const [savePlant] = useMutation(SAVE_PLANT);

  useEffect(() => {
   
    if (!Auth.loggedIn()) {
     
      navigate("/login");
    }
  }, []);


  useEffect(() => {
    if (data && data.searchPlants) {
      setPlants(data.searchPlants);
      setNoResults(data.searchPlants.length === 0); 
    }
  }, [data]);

  // Handle form submission for searching plants
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      searchPlants({ variables: { searchQuery } });
      setNoResults(false); 
    }
  };


  const handleSave = async (plantId: any, varietyId: any) => {
    console.log('Saving:', { plantId, varietyId });
    try {
      const result = await savePlant({
        variables: { plantId, varietyId },
      });
      if (result.data.savePlant.success) {
      window.location.assign('/myseedbox?nocache='+ new Date().getTime()); 
      return;
      } 
      alert(result.data.savePlant.message);
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
      varietyId: variety._id, // Include variety ID
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
    <main className="form-container">
      <div className="form-card">
      <div className="form-title">Search Plants</div>
      <form onSubmit={handleSearch} className="form">
        <input
          type="text"
          placeholder="Search for a plant..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <button type="submit" className="submit-button">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className= "error-message">Error: {error.message}</p>}
      {noResults && <p>No plants found for "{searchQuery}".</p>}

      <ul className="search-results">
        {sortedVarieties.map((variety: any, index: number) => {
          const formattedTitle = `${variety.variety} ${variety.plantName}`;
          return (
            <li key={`${formattedTitle}-${index}`}>
              <h2>{formattedTitle}</h2>
               <button onClick={() => handleSave(variety.plantId, variety.varietyId)}>+</button>
            </li>
          );
        })}
      </ul>
    </div>
    </main>
  );
};

export default SearchPlants;