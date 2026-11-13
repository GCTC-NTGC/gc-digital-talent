import { graphql } from "@gc-digital-talent/graphql";

export const SkillFormOptions_Fragment = graphql(/* GraphQL */ `
  fragment SkillFormOptions on Query {
    categories: localizedEnumStrings(enumName: "SkillCategory") {
      value
      label {
        en
        fr
      }
    }
  }
`);

export const CreateUserSkill_Mutation = graphql(/* GraphQL */ `
  mutation CreateUserSkill(
    $userId: UUID!
    $skillId: UUID!
    $userSkill: CreateUserSkillInput
  ) {
    createUserSkill(userId: $userId, skillId: $skillId, userSkill: $userSkill) {
      id
      skillLevel
      skill {
        id
        category {
          value
        }
        name {
          en
          fr
        }
        description {
          en
          fr
        }
      }
    }
  }
`);

export const UpdateUserSkill_Mutation = graphql(/* GraphQL */ `
  mutation UpdateUserSkill($id: UUID!, $userSkill: UpdateUserSkillInput) {
    updateUserSkill(id: $id, userSkill: $userSkill) {
      id
      skillLevel
      skill {
        id
        category {
          value
        }
        name {
          en
          fr
        }
        description {
          en
          fr
        }
      }
    }
  }
`);

export const DeleteUserSkill_Mutation = graphql(/* GraphQL */ `
  mutation DeleteUserSkill($id: UUID!) {
    deleteUserSkill(id: $id) {
      id
    }
  }
`);

export const UpdateUserSkillRankings_Mutation = graphql(/* GraphQL */ `
  mutation updateUserSkillRankings(
    $userId: UUID!
    $userSkillRanking: UpdateUserSkillRankingsInput!
  ) {
    updateUserSkillRankings(
      userId: $userId
      userSkillRanking: $userSkillRanking
    ) {
      id
      topTechnicalSkillsRanking {
        id
        topSkillsRank
      }
      topBehaviouralSkillsRanking {
        id
        topSkillsRank
      }
      improveTechnicalSkillsRanking {
        id
        improveSkillsRank
      }
      improveBehaviouralSkillsRanking {
        id
        improveSkillsRank
      }
    }
  }
`);
