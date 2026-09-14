import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "../ContentSection";
import type { ContentProps } from "../types";

interface PersonalExperienceV1 {
  __typename?: "PersonalExperience";
  description?: string | null;
}

const PersonalContentV1 = ({
  experience: { description },
  headingLevel,
}: ContentProps<PersonalExperienceV1>) => {
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

export default PersonalContentV1;
