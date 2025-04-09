import '../App.css';
import PopsicleStickButton from '../components/PopsicleSticks';
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_TOP_PLANTS } from "../utils/queries";
import { SAVE_PLANT } from "../utils/mutations";
import Auth from "../utils/auth";
import { Link } from 'react-router-dom';

const HomePage = () => {
  const loggedIn = Auth.loggedIn();  

  const { loading, data } = useQuery(QUERY_TOP_PLANTS);
  const [savePlant] = useMutation(SAVE_PLANT);

  const handleSave = async (plantId: any, varietyId: any) => {
    console.log('Saving:', { plantId, varietyId });
    try {
      const result = await savePlant({
        variables: { plantId, varietyId },
      });
      if (result.data.savePlant.success) {
        window.location.assign('/myseedbox?nocache=' + new Date().getTime());
        return;
      }
      alert(result.data.savePlant.message);
    } catch (err) {
      console.error(err);
      alert("Failed to save plant variety.");
    }
  };

  const plantData = data?.plants || [];
  console.log("Raw plantData:", plantData);

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

      {loading ? (<div>Loading...</div>) :
        allVarieties.map((variety: any, index: number) => {
          const formattedTitle = `${(variety.variety)} ${(variety.plantType)}`;
          return (
            <div key={`${variety.variety}-${index}`} className="popsicle-with-save">
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
              <button
                className="save-button"
                onClick={() => handleSave(variety.plantId, variety.varietyId)}
              >
                +
              </button>
            </div>
          );
        })}
    </div>
  );
};

export default HomePage;
