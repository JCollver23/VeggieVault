import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation Mutation($input: UserInput!) {
  addUser(input: $input) {
    user {
      username
      _id
    }
    token
  }
}
`;

export const SAVE_PLANT = gql`
  mutation savePlant($plantId: String!, $varietyId: String!) {
    savePlant(plantId: $plantId, varietyId: $varietyId) {
      success
      message
      data {
        _id
        user
        entries {  
          _id          
          plant {
            name
          }
          variety {
            variety
            seedDepth
            seedSpacing
            waterRequirements
            sunlightRequirements
          }
          frostHardy
          sowDate
          notes
        }
      }
    }
  }
`;

export const REMOVE_PLANT = gql`
  mutation removePlant($entryId: String!) {
    removePlant(entryId: $entryId) {
      _id
      user
      entries {  
        _id          
        plant {
          name
        }
        variety {
          variety
          seedDepth
          seedSpacing
          waterRequirements
          sunlightRequirements
        }
        frostHardy
        sowDate
        notes
      }
    }
  }
`;

export const UPDATE_SEEDBOX_ENTRY = gql`
 mutation UpdateSeedboxEntry($entryId: ID!, $frostHardy: Boolean, $sowDate: String, $notes: String) {
  updateSeedboxEntry(entryId: $entryId, frostHardy: $frostHardy, sowDate: $sowDate, notes: $notes) {
    _id
    frostHardy
    notes
    sowDate
  }
}
`;

// _id
// entries {
//   _id
//   plant {
//     _id
//     name
//   }
//   variety {
//     _id
//     variety
//     seedDepth
//     seedSpacing
//     waterRequirements
//     sunlightRequirements
//   }


