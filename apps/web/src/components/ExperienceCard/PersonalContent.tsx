import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { PersonalExperience } from "@gc-digital-talent/graphql";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import { ContentProps } from "./types";
import { Separator } from "@gc-digital-talent/ui";

const PersonalContent = ({
  experience: { details, description },
  headingLevel,
}: ContentProps<Omit<PersonalExperience, "user">>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <div className="grid gap-6">
      <ContentSection
        title={experienceFormLabels.experienceDescription}
        headingLevel={headingLevel}
      >
        {description ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
      <Separator space="none" />
      <ContentSection
        title={experienceFormLabels.details}
        headingLevel={headingLevel}
      >
        {details ?? intl.formatMessage(commonMessages.notAvailable)}
      </ContentSection>
    </div>
  );
};

export default PersonalContent;
