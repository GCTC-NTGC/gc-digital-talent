import React from "react";
import { useIntl } from "react-intl";

import { PersonalExperience } from "~/api/generated";
import { getDateRange } from "~/utils/dateUtils";

import { useLocale } from "@gc-digital-talent/i18n";
import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const PersonalContent = ({
  experience: { startDate, endDate },
  headingLevel,
}: ContentProps<PersonalExperience>) => {
  const intl = useIntl();
  const { locale } = useLocale();

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
        <p>{getDateRange({ endDate, startDate, intl, locale })}</p>
      </ContentSection>
    </div>
  );
};

export default PersonalContent;
