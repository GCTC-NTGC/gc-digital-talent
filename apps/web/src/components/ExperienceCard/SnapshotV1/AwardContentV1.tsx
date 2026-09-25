import { useIntl } from "react-intl";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "../ContentSection";
import type { ContentProps } from "../types";
import type { AwardContentExperience } from "../AwardContent";

const AwardContentV1 = ({
  experience: { awardedTo, issuedBy, awardedScope },
  headingRank,
}: ContentProps<AwardContentExperience>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <ContentSection
        title={experienceFormLabels.awardedTo}
        headingRank={headingRank}
        className="sm:border-r sm:border-gray-200 dark:border-gray-500"
      >
        {awardedTo?.label
          ? getLocalizedName(awardedTo.label, intl)
          : notAvailable}
      </ContentSection>
      <ContentSection
        title={experienceFormLabels.issuedBy}
        headingRank={headingRank}
        className="sm:border-r sm:border-gray-200 dark:border-gray-500"
      >
        {issuedBy ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      <ContentSection
        title={experienceFormLabels.awardedScope}
        headingRank={headingRank}
      >
        {awardedScope?.label
          ? getLocalizedName(awardedScope.label, intl)
          : notAvailable}
      </ContentSection>
    </div>
  );
};

export default AwardContentV1;
