import React from "react";
import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

import { WorkExperience } from "~/api/generated";
import { getDateRange } from "~/utils/dateUtils";
import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const WorkContent = ({
  experience: { startDate, endDate, division },
  headingLevel,
}: ContentProps<WorkExperience>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-gap="base(x1)"
      data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
    >
      <ContentSection
        headingLevel={headingLevel}
        title={experienceFormLabels.dateRange}
        data-h2-padding-right="p-tablet(x1)"
        data-h2-border-right="p-tablet(1px solid gray.lighter)"
      >
        <p>{getDateRange({ endDate, startDate, intl })}</p>
      </ContentSection>
      <ContentSection
        title={experienceFormLabels.team}
        headingLevel={headingLevel}
        data-h2-padding="p-tablet(0 0 x1 0)"
      >
        {division ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
    </div>
  );
};

export default WorkContent;
