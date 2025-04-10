import '../App.css';
import PopsicleStickButton from '../components/PopsicleSticks';
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_MY_SEEDBOX } from '../utils/queries';
import { Link, useNavigate } from 'react-router-dom';
import Auth from "../utils/auth";
import { useEffect } from "react";
import SeedUpdate from '../components/SeedUpdate';
import { REMOVE_PLANT } from '../utils/mutations';

const MySeedBox = () => {
  const navigate = useNavigate();
  const loggedIn = Auth.loggedIn();

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn]);

  const [removePlant] = useMutation(REMOVE_PLANT);
  
  const { loading, data, error } = useQuery(QUERY_MY_SEEDBOX, {
    skip: !loggedIn, 
  });
  if (error) {
    return <div>Error loading seed box data. Please try again later.</div>;
  }

  const handleRemove = async (entryId: any) => {
    try {
      await removePlant({
        variables: { entryId },
      });      
    } catch (err) {
      console.error(err);
      alert("Failed to remove plant.");
    }
  };

  const mySeedBox = data?.mySeedBox || [];

  const allEntries = (mySeedBox && mySeedBox.entries?.length > 0 ? mySeedBox.entries.map((entry: any) =>
  ({
    _id: entry._id,    
    plantType: entry.plant.name,
    variety: entry.variety.variety,
    seedDepth: entry.variety.seedDepth,
    seedSpacing: entry.variety.seedSpacing,
    waterRequirements: entry.variety.waterRequirements,
    sunlightRequirements: entry.variety.sunlightRequirements,
    frostHardy: entry.frostHardy,
    sowDate: entry.sowDate,
    notes: entry.notes,
  }
  )) : []);

  return (
    <div>
      <h2>My Seed Box</h2>
      {allEntries.length === 0 && (
        <p>Click the "Add Seed" button to get started!</p>
      )}

      <div className="add-seed-container">
      <Link to="/search">
        <button className="add-seed-button">
          Add Seed
        </button>
      </Link>
      </div>

      {loading ? (<div>Loading...</div>) :
        allEntries.map((entry: any, index: any) => {
          const formattedTitle = `${(entry.variety)} ${(entry.plantType)}`;
          return (
            <PopsicleStickButton
              key={`${entry.variety}${index}`}
              title={formattedTitle}
              allowRemove={true}
              removeHandler={() => handleRemove(entry._id)}
            >
              <SeedUpdate entry={entry} />
            </PopsicleStickButton>
          );
        })}
    </div>
  );
};

export default MySeedBox;
