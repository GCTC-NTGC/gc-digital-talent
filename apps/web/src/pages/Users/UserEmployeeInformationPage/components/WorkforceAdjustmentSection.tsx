import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Card } from "@gc-digital-talent/ui";

// TODO: Update fragment to match display component
export const WorkforceAdjustmentSection_Fragment = graphql(/** GraphQL */ `
  fragment WorkforceAdjustmentSection on User {
    employeeWFA {
      wfaInterest {
        value
        label {
          localized
        }
      }
      wfaDate
    }
    currentSubstantiveExperiences {
      id
      department {
        isCorePublicAdministration
      }
    }
    employeeProfile {
      communityInterests {
        community {
          id
          name {
            localized
          }
        }
      }
    }
  }
`);

interface WorkforceAdjustmentSectionProps {
  query: FragmentType<typeof WorkforceAdjustmentSection_Fragment>;
}

const WorkforceAdjustmentSection = ({
  query,
}: WorkforceAdjustmentSectionProps) => {
  const intl = useIntl();
  const user = getFragment(WorkforceAdjustmentSection_Fragment, query);

  return <Card>{/** TODO: Add content from display */}</Card>;
};

export default WorkforceAdjustmentSection;
