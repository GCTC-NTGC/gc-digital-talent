import { graphql } from "@gc-digital-talent/graphql";

const AssessmentPlanBuilderPool_Fragment = graphql(/* GraphQL */ `
  fragment AssessmentPlanBuilderPool on Pool {
    id
    ...OrganizeSectionPool
    ...SkillSummarySectionPool
    publishedAt
    poolSkills {
      id
      type
      skill {
        id
        category
        key
        name {
          en
          fr
        }
      }
    }
    assessmentSteps {
      id
      type
      poolSkills {
        id
      }
    }
  }
`);

export default AssessmentPlanBuilderPool_Fragment;
