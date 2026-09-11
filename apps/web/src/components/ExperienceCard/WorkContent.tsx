import { useIntl } from "react-intl";

import type { GenericLocalizedEnum } from "@gc-digital-talent/i18n";
import { commonMessages } from "@gc-digital-talent/i18n";
import { EmploymentCategory } from "@gc-digital-talent/graphql";
import { Separator } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import type { ContentProps } from "./types";
import type { ExternalContentExperience } from "./WorkContent/ExternalContent";
import ExternalContent from "./WorkContent/ExternalContent";
import type { CafContentExperience } from "./WorkContent/CafContent";
import CafContent from "./WorkContent/CafContent";
import type { GovContentExperience } from "./WorkContent/GovContent";
import GovContent from "./WorkContent/GovContent";
import type { SupervisoryContentExperience } from "./WorkContent/SupervisoryContent";
import SupervisoryContent from "./WorkContent/SupervisoryContent";

export interface ExperienceWorkContent
  extends
    CafContentExperience,
    ExternalContentExperience,
    GovContentExperience,
    SupervisoryContentExperience {
  __typename?: "WorkExperience";
  employmentCategory?: GenericLocalizedEnum<EmploymentCategory> | null;
}

const WorkContent = ({
  experience,
  headingLevel,
}: ContentProps<ExperienceWorkContent>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);
  const { division, employmentCategory } = experience;

  switch (employmentCategory?.value) {
    case EmploymentCategory.ExternalOrganization:
      return (
        <>
          <ExternalContent
            experience={experience}
            headingLevel={headingLevel}
          />
          <Separator space="sm" decorative />
          <SupervisoryContent
            experience={experience}
            headingLevel={headingLevel}
          />
        </>
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
