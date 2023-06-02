import React from "react";
import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

import { WorkExperience } from "~/api/generated";
import { getDateRange } from "~/utils/dateUtils";

import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const WorkContent = ({
  experience: { startDate, endDate, division },
  headingLevel,
}: ContentProps<WorkExperience>) => {
  const intl = useIntl();

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-gap="base(x1)"
      data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
    >
      <ContentSection
        headingLevel={headingLevel}
        title={intl.formatMessage({
          defaultMessage: "Start/end date",
          id: "PVzyQl",
          description: "Label for the start/end date for an experience",
        })}
        data-h2-padding-right="p-tablet(x1)"
        data-h2-border-right="p-tablet(1px solid gray.lighter)"
      >
        <p>{getDateRange({ endDate, startDate, intl })}</p>
      </ContentSection>
      <ContentSection
        title={intl.formatMessage({
          defaultMessage: "Team, group, or division",
          id: "qn77WI",
          description:
            "Label displayed on Work Experience form for team/group/division input",
        })}
        headingLevel={headingLevel}
        data-h2-padding="p-tablet(0 0 x1 0)"
      >
        {division ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
    </div>
  );
};

export default WorkContent;
