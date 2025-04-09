import '../App.css';
import PopsicleStickButton from '../components/PopsicleSticks';
import { useQuery } from "@apollo/client";
import { QUERY_TOP_PLANTS } from "../utils/queries";
import Auth from "../utils/auth";
import { Link } from 'react-router-dom';

const HomePage = () => {
  const loggedIn = Auth.loggedIn();  

  const { loading, data } = useQuery(QUERY_TOP_PLANTS);

  const plantData = data?.plants || [];

  
  const allVarieties = plantData.flatMap((plant:any) =>
    plant.varieties.map((variety:any) => ({
      ...variety,
      plantType: plant.name, 
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
      {loading ? (<div>Loading...</div>) :     
        allVarieties.map((variety:any, index:any) => {
        const formattedTitle = `${(variety.variety)} ${(variety.plantType)}`;
        return (
          <PopsicleStickButton
            key={`${variety.variety}${index}`}
            title={formattedTitle}
          >
          <ul className="seed-packet-details">
            <li><strong>Seed Depth:</strong> {variety.seedDepth}</li>
            <li><strong>Seed Spacing:</strong> {variety.seedSpacing}</li>
            <li><strong>Water:</strong> {variety.waterRequirements}</li>
            <li><strong>Sunlight:</strong> {variety.sunlightRequirements}</li>
          </ul>
        </PopsicleStickButton>
       );
      })}
    </div>
  );
};

export default HomePage;
