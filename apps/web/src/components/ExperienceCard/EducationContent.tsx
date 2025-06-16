import { useIntl } from "react-intl";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { EducationExperience } from "@gc-digital-talent/graphql";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const EducationContent = ({
  experience: { areaOfStudy, status },
  headingLevel,
}: ContentProps<Omit<EducationExperience, "user">>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <ContentSection
        title={experienceFormLabels.areaOfStudy}
        headingLevel={headingLevel}
        className="sm:border-r sm:border-gray-200 dark:border-gray-500"
      >
        {areaOfStudy ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      <ContentSection
        title={experienceFormLabels.educationStatus}
        headingLevel={headingLevel}
      >
        {status?.label
          ? getLocalizedName(status.label, intl)
          : intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
    </div>
  );
};

export default EducationContent;
