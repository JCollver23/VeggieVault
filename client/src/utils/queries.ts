import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      thoughts {
        _id
        thoughtText
        createdAt
      }
    }
  }
`;


export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
    }
  }
`;

export const QUERY_TOP_PLANTS = gql`
  query topPlants {
    plants(limit: 10) {
      name
      varieties {
        variety
        seedDepth
        seedSpacing
        waterRequirements
        sunlightRequirements
      }
    }
  }
  `;

  export const SEARCH_PLANTS = gql`
    query SearchPlants($searchQuery: String) {
      searchPlants(searchQuery: $searchQuery) {
        _id
        name
        varieties {
          variety
        }
      }
    }
  `;