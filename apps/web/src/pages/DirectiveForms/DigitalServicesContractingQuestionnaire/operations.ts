import { graphql } from "@gc-digital-talent/graphql";

export const DigitalServicesContractingQuestionnairePageData_Query = graphql(
  /* GraphQL */ `
    query DigitalServicesContractingQuestionnairePageData {
      departments {
        id
        name {
          en
          fr
        }
      }
      skills {
        id
        key
        name {
          en
          fr
        }
        keywords {
          en
          fr
        }
        description {
          en
          fr
        }
        category {
          value
          label {
            en
            fr
          }
        }
        families {
          id
          key
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
  `,
);

export const CreateDigitalContractingQuestionnaire_Mutation = graphql(
  /* GraphQL */ `
    mutation CreateDigitalContractingQuestionnaire(
      $questionnaire: DigitalContractingQuestionnaireInput!
    ) {
      createDigitalContractingQuestionnaire(
        digitalContractingQuestionnaire: $questionnaire
      ) {
        id
      }
    }
  `,
);
