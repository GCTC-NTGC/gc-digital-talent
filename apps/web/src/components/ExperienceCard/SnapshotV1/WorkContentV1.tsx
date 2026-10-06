import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { EmploymentCategory } from "@gc-digital-talent/graphql";
import { Separator } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "../ContentSection";
import type { ContentProps } from "../types";
import type { ExperienceWorkContent } from "../WorkContent";
import ExternalContent from "../WorkContent/ExternalContent";
import CafContent from "../WorkContent/CafContent";
import SupervisoryContent from "../WorkContent/SupervisoryContent";
import GovContentV1 from "./GovContentV1";

const WorkContentV1 = ({
  experience,
  headingRank,
}: ContentProps<ExperienceWorkContent>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);
  const { division, employmentCategory } = experience;

  switch (employmentCategory?.value) {
    case EmploymentCategory.ExternalOrganization:
      return (
        <ExternalContent experience={experience} headingRank={headingRank} />
      );
    case EmploymentCategory.GovernmentOfCanada:
      return (
        <>
          <GovContentV1 experience={experience} headingRank={headingRank} />
          <Separator space="sm" decorative />
          <SupervisoryContent
            experience={experience}
            headingRank={headingRank}
          />
        </>
      );
    case EmploymentCategory.CanadianArmedForces:
      return <CafContent experience={experience} headingRank={headingRank} />;
    default:
      return (
        <ContentSection
          title={experienceFormLabels.team}
          headingRank={headingRank}
          className="sm:border-r sm:border-gray-200 dark:border-gray-500"
        >
          {division ?? intl.formatMessage(commonMessages.notAvailable)}
        </ContentSection>
      );
  }
};

export default WorkContentV1;
