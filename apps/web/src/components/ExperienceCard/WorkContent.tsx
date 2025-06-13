import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { EmploymentCategory, WorkExperience } from "@gc-digital-talent/graphql";
import { Separator } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import { ContentProps } from "./types";
import ExternalContent from "./WorkContent/ExternalContent";
import CafContent from "./WorkContent/CafContent";
import GovContent from "./WorkContent/GovContent";
import SupervisoryContent from "./WorkContent/SupervisoryContent";

const WorkContent = ({
  experience,
  headingLevel,
}: ContentProps<Omit<WorkExperience, "user">>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);
  const { division, employmentCategory } = experience;

  switch (employmentCategory?.value) {
    case EmploymentCategory.ExternalOrganization:
      return (
        <ExternalContent experience={experience} headingLevel={headingLevel} />
      );
    case EmploymentCategory.GovernmentOfCanada:
      return (
        <>
          <GovContent experience={experience} headingLevel={headingLevel} />
          <Separator space="sm" decorative />
          <SupervisoryContent
            experience={experience}
            headingLevel={headingLevel}
          />
        </>
      );
    case EmploymentCategory.CanadianArmedForces:
      return <CafContent experience={experience} headingLevel={headingLevel} />;
    default:
      return (
        <ContentSection
          title={experienceFormLabels.team}
          headingLevel={headingLevel}
          className="sm:border-r sm:border-gray-200 dark:border-gray-500"
        >
          {division ?? intl.formatMessage(commonMessages.notAvailable)}
        </ContentSection>
      );
  }
};

export default WorkContent;
