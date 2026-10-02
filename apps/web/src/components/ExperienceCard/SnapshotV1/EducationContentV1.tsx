import { useIntl } from "react-intl";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "../ContentSection";
import type { ContentProps } from "../types";
import type { EducationContentExperience } from "../EducationContent";

const EducationContentV1 = ({
  experience: { areaOfStudy, status, thesisTitle },
  headingRank,
}: ContentProps<EducationContentExperience>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <ContentSection
        title={experienceFormLabels.areaOfStudy}
        headingRank={headingRank}
        className="sm:border-r sm:border-gray-200 dark:border-gray-500"
      >
        {areaOfStudy ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      <ContentSection
        title={experienceFormLabels.educationStatus}
        headingRank={headingRank}
        className="sm:border-r sm:border-gray-200 dark:border-gray-500"
      >
        {status?.label
          ? getLocalizedName(status.label, intl)
          : intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      <ContentSection
        title={experienceFormLabels.thesisTitle}
        headingRank={headingRank}
      >
        {thesisTitle ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
    </div>
  );
};

export default EducationContentV1;
