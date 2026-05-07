import { graphql } from "@gc-digital-talent/graphql";

export const TalentNominationEvent_Fragment = graphql(/* GraphQL */ `
  fragment TalentNominationEvent_Fragment on User {
    authInfo {
      roleAssignments {
        role {
          name
        }
        teamable {
          ... on Community {
            __typename
            id
            key
            name {
              localized
            }
            communityDevelopmentPrograms {
              id
              developmentProgram {
                id
                name {
                  localized
                }
                descriptionForProfile {
                  localized
                }
              }
            }
          }
        }
      }
    }
  }
`);

export const UpdateTalentNominationEvent_Fragment = graphql(/* GraphQL */ `
  fragment UpdateTalentNominationEvent_Fragment on TalentNominationEvent {
    id
    name {
      en
      fr
      localized
    }
    description {
      en
      fr
    }
    openDate
    closeDate
    learnMoreUrl {
      en
      fr
    }
    includeLeadershipCompetencies
    community {
      id
      key
      name {
        localized
      }
    }
    communityDevelopmentPrograms(trashed: WITH) {
      id
      developmentProgram {
        id
        name {
          localized
        }
        descriptionForProfile {
          localized
        }
      }
      pivot {
        descriptionForNominations {
          en
          fr
        }
      }
    }
  }
`);

export const UpdateTalentNominationEvent_Mutation = graphql(/* GraphQL */ `
  mutation UpdateTalentNominationEventMutation(
    $id: UUID!
    $talentNominationEvent: UpdateTalentNominationEventInput!
  ) {
    updateTalentNominationEvent(
      id: $id
      talentNominationEvent: $talentNominationEvent
    ) {
      id
    }
  }
`);
