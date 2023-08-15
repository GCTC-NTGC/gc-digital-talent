import React from "react";
import { useIntl } from "react-intl";

import { commonMessages, getEducationStatus } from "@gc-digital-talent/i18n";

import { EducationExperience } from "~/api/generated";
import { getDateRange } from "~/utils/dateUtils";

import { getExperienceFormLabels } from "~/utils/experienceUtils";
import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const EducationContent = ({
  experience: { startDate, endDate, areaOfStudy, status },
  headingLevel,
}: ContentProps<EducationExperience>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-gap="base(x1)"
      data-h2-grid-template-columns="l-tablet(repeat(3, 1fr))"
    >
      <ContentSection
        headingLevel={headingLevel}
        title={experienceFormLabels.dateRange}
        data-h2-padding-right="l-tablet(x1)"
        data-h2-border-right="l-tablet(1px solid gray.lighter)"
      >
        <p>{getDateRange({ endDate, startDate, intl })}</p>
      </ContentSection>
      <ContentSection
        title={experienceFormLabels.areaOfStudy}
        headingLevel={headingLevel}
        data-h2-padding="l-tablet(0 x1)"
        data-h2-border-right="l-tablet(1px solid gray.lighter)"
      >
        {areaOfStudy ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      <ContentSection
        title={experienceFormLabels.educationStatus}
        headingLevel={headingLevel}
        data-h2-padding="l-tablet(0 0 x1 0)"
      >
        {intl.formatMessage(
          status ? getEducationStatus(status) : commonMessages.notAvailable,
        )}
      </ContentSection>
    </div>
  );
};

export default EducationContent;
