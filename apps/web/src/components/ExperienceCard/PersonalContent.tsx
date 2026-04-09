import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { type PersonalExperience } from "@gc-digital-talent/graphql";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import { type ContentProps } from "./types";

const PersonalContent = ({
  experience: { description },
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
    </div>
  );
};

export default PersonalContent;
