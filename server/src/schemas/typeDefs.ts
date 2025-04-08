const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
  }

  type PlantVariety {
    _id: ID
    variety: String!
    seedDepth: String!
    seedSpacing: String!
    waterRequirements: String!
    sunlightRequirements: String!
  }

  type Plant {
    _id: ID
    name: String!
    varieties: [PlantVariety]!
  }

  type SeedBoxEntry {
    _id: ID 
    plant: Plant!
    variety: PlantVariety
    frostHardy: Boolean
    sowDate: String
    notes: String
  }

  type SeedBox {
    _id: ID
    user: ID!
    entries: [SeedBoxEntry]!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  input SavedPlantInput {
    plantName: String!
    variety: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type SavePlantResponse {
    success: Boolean!
    message: String
  }

  type Query {
    users: [User]
    user(username: String!): User
    me: User
    plants(limit: Int!): [Plant]
    searchPlants(searchQuery: String): [Plant!]!
    seedBoxes: [SeedBox]
    mySeedBox: SeedBox
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth 
    savePlant(plantId: String!, varietyId: String!): SavePlantResponse   
  }
`;

export default typeDefs;

