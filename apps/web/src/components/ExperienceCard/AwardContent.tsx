import { useIntl } from "react-intl";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { AwardExperience } from "@gc-digital-talent/graphql";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const AwardContent = ({
  experience: { awardedTo, issuedBy, awardedScope },
  headingLevel,
}: ContentProps<Omit<AwardExperience, "user">>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <ContentSection
        title={experienceFormLabels.awardedTo}
        headingLevel={headingLevel}
        className="sm:border-r sm:border-gray-200 dark:border-gray-500"
      >
        {awardedTo?.label
          ? getLocalizedName(awardedTo.label, intl)
          : notAvailable}
      </ContentSection>
      <ContentSection
        title={experienceFormLabels.issuedBy}
        headingLevel={headingLevel}
        className="sm:border-r sm:border-gray-200 dark:border-gray-500"
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
