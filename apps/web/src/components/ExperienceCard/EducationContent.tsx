import { useIntl } from "react-intl";

import { commonMessages, getEducationStatus } from "@gc-digital-talent/i18n";
import { EducationExperience } from "@gc-digital-talent/graphql";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const EducationContent = ({
  experience: { areaOfStudy, status },
  headingLevel,
}: ContentProps<EducationExperience>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <div className="grid grid-cols-2 gap-6">
      <ContentSection
        title={experienceFormLabels.areaOfStudy}
        headingLevel={headingLevel}
        data-h2-border-right="l-tablet(1px solid gray.lighter)"
      >
        {areaOfStudy ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      <ContentSection
        title={experienceFormLabels.educationStatus}
        headingLevel={headingLevel}
      >
        {intl.formatMessage(
          status ? getEducationStatus(status) : commonMessages.notAvailable,
        )}
      </ContentSection>
    </div>
  );
};

export default EducationContent;
