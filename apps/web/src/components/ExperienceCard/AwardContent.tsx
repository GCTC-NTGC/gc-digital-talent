import { useIntl } from "react-intl";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
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
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-gap="base(x1)"
      data-h2-grid-template-columns="l-tablet(repeat(3, 1fr))"
    >
      <ContentSection
        title={experienceFormLabels.awardedTo}
        headingLevel={headingLevel}
        data-h2-border-right="l-tablet(1px solid gray.lighter)"
      >
        {awardedTo?.label
          ? getLocalizedName(awardedTo.label, intl)
          : notAvailable}
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
        {awardedScope?.label
          ? getLocalizedName(awardedScope.label, intl)
          : notAvailable}
      </ContentSection>
    </div>
  );
};

export default AwardContent;
