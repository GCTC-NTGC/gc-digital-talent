import React from "react";
import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

import { CommunityExperience } from "~/api/generated";
import { getDateRange } from "~/utils/dateUtils";

import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const CommunityContent = ({
  experience: { startDate, endDate, project },
  headingLevel,
}: ContentProps<CommunityExperience>) => {
  const intl = useIntl();

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-gap="base(x1)"
      data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
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
          defaultMessage: "Project / product",
          id: "gEBoM0",
          description:
            "Label displayed on Community Experience form for Project / product section",
        })}
        headingLevel={headingLevel}
      >
        {project}
      </ContentSection>
    </div>
  );
};

export default CommunityContent;
