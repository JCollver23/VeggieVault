import db from '../config/connection.js';
import { User, PlantVariety, Plant, SeedBox } from '../models/index.js';
import cleanDB from './cleanDB.js';
import { Schema } from 'mongoose';

import userData from './userData.json' with { type: 'json'};
import plantData from './plantData.json' with { type: 'json'};

const seedDatabase = async (): Promise<void> => {
  try {
    await db();
    await cleanDB();

    // Seed Users and Plants
    await User.create(userData);

    for (const plant of plantData) {
      // Create PlantVarieties first and store their IDs in the plant object
      const varieties = await PlantVariety.create(plant.varieties);
      const plantVarieties = varieties.map(variety => variety._id);

      // Create the plant with the variety IDs
      const newPlant = await Plant.create({ name: plant.name, varieties: plantVarieties });

      plantVarieties.forEach(async (varietyId) => {
        // Update the variety to reference the its parent plant
        await PlantVariety.findByIdAndUpdate(varietyId, { plant: newPlant._id });
      });
    }

    console.log('Users and Plants seeded successfully!');

    // Grab the data so we have IDs to work with
    const users = await User.find({});
    const plants = await Plant.find({}).populate('varieties');

    console.log('Creating SeedBoxes...');

    for (const user of users) {
      // Create a SeedBox for the user
      let seedBox = await SeedBox.create({ user: user._id });

      for (let i = 0; i < 3; i++) {
        // Select a random plant from the database
        while (true) {
          const randomPlant = plants[Math.floor(Math.random() * plantData.length)];

          // Select a variety of plant from randomPlant
          const randomVariety = randomPlant.varieties[Math.floor(Math.random() * randomPlant.varieties.length)];

          // Check if the plant and variety is already in the SeedBox
          const randomPlantId = randomPlant._id as Schema.Types.ObjectId;
          const randomVarietyId = randomVariety as Schema.Types.ObjectId;

          // We need a fresh instance of the SeedBox to check the stored entries
          const seedBoxFresh = await SeedBox.findById(seedBox._id);

          if (seedBoxFresh && seedBoxFresh.entries.some(entry => (entry.plant.toString() === randomPlantId.toString()
            && entry.variety.toString() === randomVarietyId.toString()))) {
            continue;
          }

          // Add the random plant and variety to the user's SeedBox since it's not already there
          await SeedBox.findByIdAndUpdate(seedBox._id, { $push: { entries: { plant: randomPlantId, variety: randomVarietyId } } });
          break;
        }
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
