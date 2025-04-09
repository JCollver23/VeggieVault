import '../App.css';
import PopsicleStickButton from '../components/PopsicleSticks';
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_TOP_PLANTS } from "../utils/queries";
import { SAVE_PLANT } from "../utils/mutations";
import Auth from "../utils/auth";
import { Link } from 'react-router-dom';
import { useState } from 'react';

const HomePage = () => {
  const loggedIn = Auth.loggedIn();

  const { loading, data } = useQuery(QUERY_TOP_PLANTS);
  const [savePlant] = useMutation(SAVE_PLANT);

  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async (plantId: any, varietyId: any) => {
    try {
      const result = await savePlant({
        variables: { plantId, varietyId },
      });
      if (result.data.savePlant.success) {
        // window.location.assign('/myseedbox?nocache=' + new Date().getTime());
        return;
      }
      setSaveMessage(result.data.savePlant.message);
      setTimeout(() => setSaveMessage(''), 5000);
    } catch (err) {
      console.error(err);
      setSaveMessage("Failed to save plant variety.");
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  const plantData = data?.plants || [];


  const allVarieties = plantData.flatMap((plant: any) =>
    plant.varieties.map((variety: any) => ({
      ...variety,
      plantType: plant.name,
      plantId: plant._id,
      varietyId: variety._id,
    }))
  );



  return (
    <div className="sub-container">
      
      <div className="homepage-description">
        {loggedIn ?
          (<>
            <p>Welcome to VeggieVault, {Auth.getProfile().data.username}!</p>
            <p>Check out <Link to="/myseedbox">your personal seed box</Link> to view your plants, update notes, or add more!</p>
            <p>Or tap on a plant tag below to open a Seed Packet with all the details you need-like seed depth, spacing, and sunlight requirements.</p>
          </>
          ) :
          (<>
            <p>Create an account or login to build your personal seed box! </p>
            <p>Easily search for plants, add them to your Seed Box, and update or remove them as you go! </p>
            <p>Tap on a plant tag below to open a Seed Packet with all the details you need—like seed depth, spacing, and sunlight requirements.</p>
          </>
          )
        }
      </div>

      {saveMessage && (
    <div className="floating-toast">
      {saveMessage}
    </div>
  )}
   
        
      {loading ? (<div>Loading...</div>) :
        allVarieties.map((variety: any, index: number) => {
          const formattedTitle = `${(variety.variety)} ${(variety.plantType)}`;        
          return (    
                   
            <PopsicleStickButton
              key={`${variety.variety}${index}`}
              title={formattedTitle}
              allowAdd={loggedIn}
              saveHandler={() => handleSave(variety.plantId, variety.varietyId)}
            >
             
              <ul className="seed-packet-details">
                <li>Seed Depth: {variety.seedDepth}</li>
                <li>Seed Spacing: {variety.seedSpacing}</li>
                <li>Water:{variety.waterRequirements}</li>
                <li>Sunlight: {variety.sunlightRequirements}</li>
                <li>
                  Frost Hardy?: <span className="edit-message">  (check in <strong>My Seed Box</strong>) </span>
                </li>

                <li>
                  Sow Date: <span className="edit-message"> (edit in <strong>My Seed Box</strong>)</span>
                </li>

                <li>
                  Notes: <span className="edit-message">(add notes in <strong>My Seed Box</strong>)</span>
                  <textarea
                    style={{ marginLeft: '0.5em', width: '100%', height: '50px' }}
                  />

                </li>

              </ul>
            
            </PopsicleStickButton> 
          );
        })}
    </div>
   
    
  );
};

export default HomePage;
