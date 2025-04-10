import { User, Plant, SeedBox, PlantVariety } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
import { Types } from 'mongoose';

// Define types for the arguments
interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  }
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface UserArgs {
  username: string;
}

interface IUserContext {
  user: {
    _id: string;
    username: string;
    email: string;
  }
}

const resolvers = {
  Query: {
    users: async () => {
      return User.find()
    },
    user: async (_parent: any, { username }: UserArgs) => {
      return User.findOne({ username })
    },

    // Query to get the authenticated user's information
    // The 'me' query relies on the context to check if the user is authenticated
    me: async (_parent: any, _args: any, context: any) => {
      // If the user is authenticated, find and return the user's information along with their thoughts
      if (context.user) {
        return User.findOne({ _id: context.user._id })
      }
      // If the user is not authenticated, throw an AuthenticationError
      throw new AuthenticationError('Could not authenticate user.');
    },

    plants: async (_parent: any, { limit }: any) => {
      return Plant.find().limit(limit).populate('varieties');
    },

    searchPlants: async (_parent: any, { searchQuery }: { searchQuery: string }) => {
      searchQuery = searchQuery.trim().toLowerCase();

      // If no searchQuery is provided, return all plants
      if (!searchQuery || searchQuery === '') {
        return Plant.find().populate('varieties');
      }

      // Split searchQuery into words
      const searchWords = searchQuery.split(' ');

      // Search both plants and varieties and return the plants that match either
      const plantsFound = await Plant.find({ $or: searchWords.map(word => ({ name: { $regex: new RegExp(word, 'i') } })) }).select('_id');
      const varietiesFound = await PlantVariety.find({ $or: searchWords.map(word => ({ variety: { $regex: new RegExp(word, 'i') } })) }).select('plant');

      const foundIds = [...plantsFound.map((plant: any) => plant._id), ...varietiesFound.map((variety: any) => variety.plant)];

      // Return all Plants with an id in foundIds
      return await Plant.find({ _id: { $in: foundIds } }).populate('varieties');
    },

    seedBoxes: async () => {
      return SeedBox.find();
    },

    mySeedBox: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        const seedBox = await SeedBox.findOne({ user: context.user._id })
          .populate('entries.plant')
          .populate('entries.variety')

        if (seedBox) {
          return seedBox
        }
        return null;
      }
      throw new AuthenticationError('Could not authenticate user.');
    }
  },
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      // Create a new user with the provided username, email, and password
      const user = await User.create({ ...input });

      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);

      // Return the token and the user
      return { token, user };
    },

    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      // Find a user with the provided email
      const user = await User.findOne({ email });

      // If no user is found, throw an AuthenticationError
      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }

      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);

      // If the password is incorrect, throw an AuthenticationError
      if (!correctPw) {
        throw new AuthenticationError('Could not authenticate user.');
      }

      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);

      // Return the token and the user
      return { token, user };
    },

    savePlant: async (_parent: any, { plantId, varietyId }: { plantId: string, varietyId: string }, context: IUserContext) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      // Find or create the user's SeedBox
      let seedBox = await SeedBox.findOne({ user: context.user._id });
      if (!seedBox) {
        seedBox = await SeedBox.create({ user: context.user._id, entries: [] });
      }

      const plantObjectId = new Types.ObjectId(plantId);
      const varietyObjectId = new Types.ObjectId(varietyId);

      // Check if the entry already exists to avoid duplicates
      const entryExists = seedBox.entries.some(
        (entry) => entry.plant.toString() === plantId && entry.variety.toString() === varietyId
      );

      if (!entryExists) {
        await SeedBox.updateOne(
          { _id: seedBox._id },
          { $push: { entries: { plant: plantObjectId, variety: varietyObjectId } } }
        );

        const updated = await SeedBox.findOne({ user: context.user._id })
          .populate('entries.plant').populate('entries.variety');

        // Return the updated SeedBox to refresh the cache
        return { success: true, message: 'Plant added to SeedBox!', data: updated };
      }

      return { success: false, message: 'This plant is already in your SeedBox' };
    },

    removePlant: async (_parent: any, { entryId }: { entryId: string }, context: IUserContext) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      // Find a SeedBox for the user and entry ID
      const seedBox = await SeedBox.findOne({
        user: context.user._id,
        'entries._id': entryId
      });

      if (!seedBox) {
        throw new Error('Failed to find SeedBox with that user and entry ID.');
      }

      // Remove the entry and return the updated SeedBox
      await SeedBox.findOneAndUpdate(
        { user: context.user._id },
        { $pull: { entries: { _id: entryId } } }
      );

      // Return the updated SeedBox
      return SeedBox.findOne({ user: context.user._id })
        .populate('entries.plant').populate('entries.variety');
    },

    updateSeedboxEntry: async (_parent: any, { entryId, frostHardy, sowDate, notes }: { entryId: string; frostHardy: boolean; sowDate: string; notes: string }, context: IUserContext) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      // Find the SeedBox entry by ID and update it
      const updatedEntry = await SeedBox.findOneAndUpdate(
        { 'entries._id': entryId },
        { $set: { 'entries.$.frostHardy': frostHardy, 'entries.$.sowDate': sowDate, 'entries.$.notes': notes } },
        { new: true }
      );

      if (!updatedEntry) {
        throw new Error('SeedBox entry not found.');
      }

      return updatedEntry;
    }

  },
};

export default resolvers;
