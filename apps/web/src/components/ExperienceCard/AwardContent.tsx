import { useIntl } from "react-intl";

import {
  commonMessages,
  getAwardedScope,
  getAwardedTo,
} from "@gc-digital-talent/i18n";
import { AwardExperience } from "@gc-digital-talent/graphql";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const AwardContent = ({
  experience: { awardedTo, issuedBy, awardedScope },
  headingLevel,
}: ContentProps<AwardExperience>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <ContentSection
        title={experienceFormLabels.awardedTo}
        headingLevel={headingLevel}
        data-h2-border-right="l-tablet(1px solid gray.lighter)"
      >
        {intl.formatMessage(
          awardedTo ? getAwardedTo(awardedTo) : commonMessages.notAvailable,
        )}
      </ContentSection>
      <ContentSection
        title={experienceFormLabels.issuedBy}
        headingLevel={headingLevel}
        data-h2-border-right="p-tablet(1px solid gray.lighter)"
      >
        {issuedBy ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      <ContentSection
        title={experienceFormLabels.awardedScope}
        headingLevel={headingLevel}
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
