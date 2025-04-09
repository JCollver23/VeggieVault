import '../App.css';
import PopsicleStickButton from '../components/PopsicleSticks';
import { useQuery } from "@apollo/client";
import { QUERY_TOP_PLANTS } from "../utils/queries";
import auth from '../utils/auth';

// interface SeedProps {
//   entry: {
//       _id: string;
//       seedDepth: string;
//       seedSpacing: string;
//       waterRequirements: string;
//       sunlightRequirements: string;
//       frostHardy: boolean;
//       sowDate?: string;
//       notes?: string;
//   };
// }

const HomePage = () => {
  const { loading, data } = useQuery(QUERY_TOP_PLANTS);

  const plantData = data?.plants || [];


  const allVarieties = plantData.flatMap((plant: any) =>
    plant.varieties.map((variety: any) => ({
      ...variety,
      plantType: plant.name,
    }))
  );
  return (
    <div className="sub-container">
      <div className="homepage-description">
        <p>Create an account or login to build your personal seed box! </p>
        <p>Easily search for plants, add them to your Seed Box, and update or remove them as you go! </p>
        <p>Tap on a plant tag below to open a Seed Packet with all the details you need—like seed depth, spacing, and sunlight requirements. </p>
      </div>
      {loading ? (<div>Loading...</div>) :
        allVarieties.map((variety: any, index: any) => {
          const formattedTitle = `${(variety.variety)} ${(variety.plantType)}`;
          return (
            <PopsicleStickButton
              key={`${variety.variety}${index}`}
              title={formattedTitle}
            >
              <ul className="seed-packet-details">
                <li>Seed Depth: {variety.seedDepth}</li>
                <li>Seed Spacing: {variety.seedSpacing}</li>
                <li>Water:{variety.waterRequirements}</li>
                <li>Sunlight: {variety.sunlightRequirements}</li>
                <li>
                  Frost Hardy?: <span className= "edit-message">  (check in <strong>My Seed Box</strong>) </span>
                </li>

                <li>
                  Sow Date: <span className= "edit-message"> (edit in <strong>My Seed Box</strong>)</span>
                </li>

                <li>
                  Notes: <span className= "edit-message">(add notes in <strong>My Seed Box</strong>)</span>
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
