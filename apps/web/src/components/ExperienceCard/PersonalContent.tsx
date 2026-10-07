import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Separator } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import type { ContentProps } from "./types";

interface PersonalContentExperience {
  __typename?: "PersonalExperience";
  learningDescription?: string | null;
  organization?: string | null;
}

const PersonalContent = ({
  experience: { learningDescription, organization },
  headingRank,
}: ContentProps<PersonalContentExperience>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <div>
      <ContentSection
        title={experienceFormLabels.organizationOrPlatform}
        headingRank={headingRank}
      >
        {organization ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      <Separator space="sm" decorative />
      <ContentSection
        title={experienceFormLabels.learningDescription}
        headingRank={headingRank}
      >
        {learningDescription ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
    </div>
  );
};

export default PersonalContent;
