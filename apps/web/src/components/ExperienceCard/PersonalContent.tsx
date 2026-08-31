import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Separator } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import type { ContentProps } from "./types";

interface PersonalContentExperience {
  learningDescription?: string | null;
  organization?: string | null;
}

const PersonalContent = ({
  experience: { learningDescription, organization },
  headingLevel,
}: ContentProps<PersonalContentExperience>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <div>
      <ContentSection
        title={experienceFormLabels.organizationOrPlatform}
        headingLevel={headingLevel}
      >
        {organization ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      <Separator space="sm" decorative />
      <ContentSection
        title={experienceFormLabels.learningDescription}
        headingLevel={headingLevel}
      >
        {learningDescription ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
    </div>
  );
};

export default PersonalContent;
