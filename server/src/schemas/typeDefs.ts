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
    plantId: ID!
    varietyId: String!
    frostHardy: Boolean!
    sowDate: String!
  }

  type SeedBox {
    _id: ID
    userId: ID!
    entries: [SeedBoxEntry]!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }
  
  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    me: User
    plants(limit: Int!): [Plant]
    searchPlants(searchQuery: String): [Plant!]!
    seedBoxes: [SeedBox]
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
  }
`;

export default typeDefs;
