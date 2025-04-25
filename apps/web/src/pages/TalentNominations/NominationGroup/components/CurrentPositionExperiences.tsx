import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { currentDate } from "@gc-digital-talent/date-helpers";
import { MAX_DATE } from "@gc-digital-talent/date-helpers/const";

import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";

const CurrentPositionWorkExperience_Fragment = graphql(/** GraphQL */ `
  fragment CurrentPositionWorkExperience on WorkExperience {
    id
    role
    organization
    division
    startDate
    endDate
    details
    employmentCategory {
      value
      label {
        en
        fr
      }
    }
    extSizeOfOrganization {
      value
      label {
        en
        fr
      }
    }
    extRoleSeniority {
      value
      label {
        en
        fr
      }
    }
    govEmploymentType {
      value
      label {
        en
        fr
      }
    }
    govPositionType {
      value
      label {
        en
        fr
      }
    }
    govContractorRoleSeniority {
      value
      label {
        en
        fr
      }
    }
    govContractorType {
      value
      label {
        en
        fr
      }
    }
    contractorFirmAgencyName
    cafEmploymentType {
      value
      label {
        en
        fr
      }
    }
    cafForce {
      value
      label {
        en
        fr
      }
    }
    cafRank {
      value
      label {
        en
        fr
      }
    }
    classification {
      id
      name {
        en
        fr
      }
      group
      level
      maxSalary
      minSalary
    }
    department {
      id
      name {
        en
        fr
      }
      departmentNumber
    }
    workStreams {
      id
      key
      name {
        localized
      }
      community {
        id
        key
        name {
          localized
        }
      }
    }
    supervisoryPosition
    supervisedEmployees
    supervisedEmployeesNumber
    budgetManagement
    annualBudgetAllocation
    seniorManagementStatus
    cSuiteRoleTitle {
      value
      label {
        localized
      }
    }
    otherCSuiteRoleTitle
    skills {
      id
      key
      category {
        value
        label {
          localized
        }
      }
      name {
        en
        fr
      }
      experienceSkillRecord {
        details
      }
    }
  }
`);

const isCurrentExperience = (endDate?: string | null): boolean => {
  if (!endDate) {
    return true;
  }

  const currentDateString = currentDate();
  if (endDate > currentDateString) {
    return true;
  }

  return false;
};

interface CurrentPositionExperiencesProps {
  query?: FragmentType<typeof CurrentPositionWorkExperience_Fragment>[];
}

const CurrentPositionExperiences = ({
  query,
}: CurrentPositionExperiencesProps) => {
  const workExperiences = unpackMaybes(
    getFragment(CurrentPositionWorkExperience_Fragment, query),
  );
  const currentWorkExperiences = workExperiences.filter((exp) =>
    isCurrentExperience(exp.endDate),
  );
  const sorted = currentWorkExperiences.sort((a, b) => {
    const aStart = a?.startDate ? new Date(a.startDate) : MAX_DATE;
    const bStart = b?.startDate ? new Date(b.startDate) : MAX_DATE;
    return bStart.getTime() - aStart.getTime(); // more recent start sorted higher
  });

  return (
    <div>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x.5 0)"
      >
        {sorted.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} showEdit={false} />
        ))}
      </div>
    </div>
  );
};

export default CurrentPositionExperiences;
