import React from "react";
import { useIntl } from "react-intl";

import { PersonalExperience } from "~/api/generated";
import { getDateRange } from "~/utils/dateUtils";
import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const PersonalContent = ({
  experience: { startDate, endDate },
  headingLevel,
}: ContentProps<PersonalExperience>) => {
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
      >
        <p>{getDateRange({ endDate, startDate, intl })}</p>
      </ContentSection>
    </div>
  );
};

export default PersonalContent;
