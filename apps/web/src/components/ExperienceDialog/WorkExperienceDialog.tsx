import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import WorkDialogContent from "./WorkDialogContent";
import type { ExperienceDialogBaseProps } from "./ExperienceDialog";
import ExperienceDialog from "./ExperienceDialog";

export const WorkExperienceDialog_Fragment = graphql(/* GraphQL */ `
  fragment WorkExperienceDialog on WorkExperience {
    ...ExperienceDialog
    role
    organization
    division
    startDate
    endDate
    details
    contractorFirmAgencyName
    supervisoryPosition
    supervisedEmployees
    supervisedEmployeesNumber
    budgetManagement
    annualBudgetAllocation
    seniorManagementStatus
    otherCSuiteRoleTitle
    employmentCategory {
      value
      label {
        localized
      }
    }
    extSizeOfOrganization {
      value
      label {
        localized
      }
    }
    extRoleSeniority {
      value
      label {
        localized
      }
    }
    govEmploymentType {
      value
      label {
        localized
      }
    }
    govPositionType {
      value
      label {
        localized
      }
    }
    govContractorRoleSeniority {
      value
      label {
        localized
      }
    }
    govContractorType {
      value
      label {
        localized
      }
    }
    cafEmploymentType {
      value
      label {
        localized
      }
    }
    cafForce {
      value
      label {
        localized
      }
    }
    cafRank {
      value
      label {
        localized
      }
    }
    cSuiteRoleTitle {
      value
      label {
        en
        fr
      }
    }
    department {
      id
      name {
        localized
      }
    }
    classification {
      id
      group
      level
    }
    workStreams {
      id
      name {
        en
        fr
      }
      community {
        id
        name {
          en
          fr
        }
      }
    }
  }
`);

interface WorkExperienceDialogProps extends ExperienceDialogBaseProps {
  experienceQuery: FragmentType<typeof WorkExperienceDialog_Fragment>;
}

const WorkExperienceDialog = ({
  experienceQuery,
  ...rest
}: WorkExperienceDialogProps) => {
  const experience = getFragment(
    WorkExperienceDialog_Fragment,
    experienceQuery,
  );

  return (
    <ExperienceDialog experienceQuery={experience} {...rest}>
      <WorkDialogContent experience={experience} headingRank="h3" />
    </ExperienceDialog>
  );
};

export default WorkExperienceDialog;
