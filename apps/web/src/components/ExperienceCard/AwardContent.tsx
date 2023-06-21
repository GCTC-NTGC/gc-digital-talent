import React from "react";
import { useIntl } from "react-intl";

import {
  commonMessages,
  getAwardedScope,
  getAwardedTo,
} from "@gc-digital-talent/i18n";

import { AwardExperience } from "~/api/generated";
import { formattedDate } from "~/utils/dateUtils";
import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const AwardContent = ({
  experience: { awardedDate, awardedTo, issuedBy, awardedScope },
  headingLevel,
}: ContentProps<AwardExperience>) => {
  const intl = useIntl();

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
        title={intl.formatMessage({
          defaultMessage: "Date awarded",
          id: "qrdJ13",
          description: "Label for the date an award was given",
        })}
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
        title={intl.formatMessage({
          defaultMessage: "Issuing organization",
          id: "NGEgVN",
          description: "Label displayed on award form for organization section",
        })}
        headingLevel={headingLevel}
        data-h2-padding="p-tablet(0 0 x1 0) l-tablet(0 x1)"
        data-h2-border-right="p-tablet(1px solid gray.lighter)"
      >
        {issuedBy ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      <ContentSection
        title={intl.formatMessage({
          defaultMessage: "Award scope",
          id: "jhhCKX",
          description: "Label displayed on award form for scope section",
        })}
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
