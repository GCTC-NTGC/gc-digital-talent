import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { PersonalExperience } from "@gc-digital-talent/graphql";
import { Separator } from "@gc-digital-talent/ui";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const PersonalContent = ({
  experience: { learningDescription, organization },
  headingLevel,
}: ContentProps<Omit<PersonalExperience, "user">>) => {
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
