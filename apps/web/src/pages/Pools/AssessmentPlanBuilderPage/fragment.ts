import { graphql } from "@gc-digital-talent/graphql";

const AssessmentPlanBuilderPool_Fragment = graphql(/* GraphQL */ `
  fragment AssessmentPlanBuilderPool on Pool {
    id
    ...OrganizeSectionPool
    ...SkillSummarySectionPool
    ...AssessmentPlanStatus
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
  }
`);

export default AssessmentPlanBuilderPool_Fragment;
