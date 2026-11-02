import { defineMessages, useIntl } from "react-intl";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";

import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import WorkFields from "~/components/ExperienceFormFields/WorkFields/WorkFields";
import ExperienceWorkStreams from "~/components/ExperienceWorkStreams/ExperienceWorkStreams";
import {
  getExperienceFormLabels,
  queryResultToDefaultValues,
} from "~/utils/experienceUtils";

import ExperienceFormLayout, {
  editSubTitle,
} from "./components/ExperienceFormLayout";
import type { ExperienceTypeFormProps } from "./components/ExperienceFormLayout";

const messages = defineMessages({
  addTitle: {
    defaultMessage: "Add work experience",
    id: "jaq5mc",
    description: "Title for the add work experience page",
  },
  editTitle: {
    defaultMessage: "Edit work experience",
    id: "ea/1Be",
    description: "Title for the edit work experience page",
  },
  addSubtitle: {
    defaultMessage:
      "Share your part-time, full-time, self-employment, non-profit, or internship experiences.",
    id: "eRMznK",
    description: "Subtitle for the add work experience page",
  },
  heading: {
    defaultMessage: "Job position details",
    id: "tK7vcF",
    description: "Heading for the work experience form",
  },
  intro: {
    defaultMessage:
      "Let's add new work experience to your profile. When adding experience, it's important to remember the classic framework of who, when, where, what, why, and how. You'll start by answering a few standard questions about the work, then describe what you did in the role, and finally, how you applied various skills during this job.",
    id: "Iq/n12",
    description: "Introduction for the work experience form",
  },
});

export const WorkExperienceForm_Fragment = graphql(/* GraphQL */ `
  fragment WorkExperienceForm on WorkExperience {
    ...ExperienceFormLayout
    id
    awardExperiences {
      id
    }
    details
    role
    organization
    division
    startDate
    endDate
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
      group
      level
    }
    department {
      id
    }
    workStreams {
      id
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
  }
`);

interface WorkExperienceFormProps extends ExperienceTypeFormProps {
  experienceQuery?: FragmentType<typeof WorkExperienceForm_Fragment>;
}

const WorkExperienceForm = ({
  edit,
  experienceQuery,
  organizationSuggestions,
  ...rest
}: WorkExperienceFormProps) => {
  const intl = useIntl();
  const experience = getFragment(WorkExperienceForm_Fragment, experienceQuery);

  return (
    <ExperienceFormLayout
      edit={edit}
      experienceType="work"
      experienceQuery={experience}
      hasRelatedAwards={!!experience?.awardExperiences?.length}
      detailsDefaultValues={
        experience ? queryResultToDefaultValues("work", experience) : undefined
      }
      title={intl.formatMessage(edit ? messages.editTitle : messages.addTitle)}
      subtitle={intl.formatMessage(edit ? editSubTitle : messages.addSubtitle)}
      heading={intl.formatMessage(messages.heading)}
      intro={intl.formatMessage(messages.intro)}
      icon={BriefcaseIcon}
      afterSkills={<ExperienceWorkStreams />}
      {...rest}
    >
      <WorkFields
        labels={getExperienceFormLabels(intl, "work")}
        organizationSuggestions={organizationSuggestions}
      />
    </ExperienceFormLayout>
  );
};

export default WorkExperienceForm;
