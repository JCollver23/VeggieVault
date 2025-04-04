import '../App.css';
import PopsicleStickButton from '../components/PopsicleSticks';
import { useQuery } from "@apollo/client";
import { QUERY_TOP_PLANTS } from "../utils/queries";
import { Link } from 'react-router-dom';

const MySeedBox = () => {
  const { loading, data } = useQuery(QUERY_TOP_PLANTS);

  const plantData = data?.plants || [];

  const allVarieties = plantData.flatMap((plant: any) =>
    plant.varieties.map((variety: any) => ({
      ...variety,
      plantType: plant.name,
    }))
  );
  return (
    <div className="main-container">
      <h2>My Seed Box</h2>

      <Link to="/search">
        <button className="add-seed-button">
          Add Seed
        </button>
      </Link>

      {loading ? (<div>Loading...</div>) :
        allVarieties.map((variety: any, index: any) => {
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

export default MySeedBox;
