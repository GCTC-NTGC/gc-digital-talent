import React from "react";
import { useIntl } from "react-intl";

import {
  commonMessages,
  getAwardedScope,
  getAwardedTo,
} from "@gc-digital-talent/i18n";

import { AwardExperience } from "~/api/generated";
import { formattedDate } from "~/utils/dateUtils";
import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const AwardContent = ({
  experience: { awardedDate, awardedTo, issuedBy, awardedScope },
  headingLevel,
}: ContentProps<AwardExperience>) => {
  const intl = useIntl();
  const experienceLabels = getExperienceFormLabels(intl);
  return (
    <div
      data-h2-display="base(grid)"
      data-h2-gap="base(x1)"
      data-h2-grid-template-columns="p-tablet(repeat(2, 1fr)) l-tablet(repeat(4, 1fr))"
    >
      <ContentSection
        headingLevel={headingLevel}
        data-h2-padding-right="p-tablet(x1)"
        data-h2-border-right="p-tablet(1px solid gray.lighter)"
        title={experienceLabels.awardedDate}
      >
        <p>
          {awardedDate
            ? formattedDate(awardedDate, intl)
            : intl.formatMessage(commonMessages.notProvided)}
        </p>
      </ContentSection>
      <ContentSection
        title={intl.formatMessage({
          defaultMessage: "Award recipient(s)",
          id: "8lBXWU",
          description: "Label for the person or group that received an award",
        })}
        headingLevel={headingLevel}
        data-h2-padding="p-tablet(0 0 x1 0) l-tablet(0 x1)"
        data-h2-border-right="l-tablet(1px solid gray.lighter)"
      >
        {intl.formatMessage(
          awardedTo ? getAwardedTo(awardedTo) : commonMessages.notAvailable,
        )}
      </ContentSection>
      <ContentSection
        title={experienceLabels.issuedBy}
        headingLevel={headingLevel}
        data-h2-padding="p-tablet(0 0 x1 0) l-tablet(0 x1)"
        data-h2-border-right="p-tablet(1px solid gray.lighter)"
      >
        {issuedBy ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      <ContentSection
        title={experienceLabels.awardedScope}
        headingLevel={headingLevel}
        data-h2-padding="p-tablet(0 0 x1 0)"
      >
        {intl.formatMessage(
          awardedScope
            ? getAwardedScope(awardedScope)
            : commonMessages.notAvailable,
        )}
      </ContentSection>
    </div>
  );
};

export default AwardContent;
