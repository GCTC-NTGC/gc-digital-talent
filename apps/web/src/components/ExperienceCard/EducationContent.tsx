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
    <div
      data-h2-display="base(grid)"
      data-h2-gap="base(x1)"
      data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
    >
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
