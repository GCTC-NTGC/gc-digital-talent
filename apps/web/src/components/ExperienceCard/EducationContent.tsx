import React from "react";
import { useIntl } from "react-intl";

import { commonMessages, getEducationStatus } from "@gc-digital-talent/i18n";

import { EducationExperience } from "~/api/generated";
import { getDateRange } from "~/utils/dateUtils";

import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const EducationContent = ({
  experience: { startDate, endDate, areaOfStudy, status },
  headingLevel,
}: ContentProps<EducationExperience>) => {
  const intl = useIntl();

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-gap="base(x1)"
      data-h2-grid-template-columns="l-tablet(repeat(3, 1fr))"
    >
      <ContentSection
        headingLevel={headingLevel}
        title={intl.formatMessage({
          defaultMessage: "Start/end date",
          id: "PVzyQl",
          description: "Label for the start/end date for an experience",
        })}
      >
        <p>{getDateRange({ endDate, startDate, intl })}</p>
      </ContentSection>
      <ContentSection
        title={intl.formatMessage({
          defaultMessage: "Area of study",
          id: "nzw1ry",
          description:
            "Label displayed on education form for area of study input",
        })}
        headingLevel={headingLevel}
      >
        {areaOfStudy ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      <ContentSection
        title={intl.formatMessage({
          defaultMessage: "Status",
          id: "OQhL7A",
          description: "Label displayed on Education form for status input",
        })}
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
