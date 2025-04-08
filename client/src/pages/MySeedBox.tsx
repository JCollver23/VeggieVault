import '../App.css';
import PopsicleStickButton from '../components/PopsicleSticks';
import { useQuery } from "@apollo/client";
import { QUERY_MY_SEEDBOX } from '../utils/queries';
import { Link, useNavigate } from 'react-router-dom';
import Auth from "../utils/auth";
import { useEffect } from "react";

const MySeedBox = () => {
  const navigate = useNavigate();
  const loggedIn = Auth.loggedIn();
  
  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn]);
  
  const { loading, data } = useQuery(QUERY_MY_SEEDBOX, {
    skip: !loggedIn, 
  });

  const mySeedBox = data?.mySeedBox || [];

  const allEntries = (mySeedBox && mySeedBox.entries?.length > 0 ? mySeedBox.entries.map((entry: any) =>
  ({
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
    <div className="sub-container">
      <h2>My Seed Box</h2>
      <p>Click "Add Seed" button to get started!</p>
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
            >
              <ul className="seed-packet-details">
                <li><strong>Seed Depth:</strong> {entry.seedDepth}</li>
                <li><strong>Seed Spacing:</strong> {entry.seedSpacing}</li>
                <li><strong>Water:</strong> {entry.waterRequirements}</li>
                <li><strong>Sunlight:</strong> {entry.sunlightRequirements}</li>
                <li><strong>Frost Hardy:</strong> {entry.frostHardy ? 'Yes' : 'No'}</li>
                {entry.sowDate && (
                  <li><strong>Sow Date:</strong> {new Date(entry.sowDate).toLocaleDateString()}</li>
                )}
                {entry.notes && (
                  <li>
                    <div className="notes-box">
                      <strong>Notes:</strong> {entry.notes}
                    </div>
                  </li>
                )}
              </ul>
            </PopsicleStickButton>
          );
        })}
    </div>
  );
};

export default MySeedBox;
