import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { WorkExperience } from "@gc-digital-talent/graphql";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import { ContentProps } from "./types";

const WorkContent = ({
  experience: { division },
  headingLevel,
}: ContentProps<Omit<WorkExperience, "user">>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <ContentSection
      title={experienceFormLabels.team}
      headingLevel={headingLevel}
    >
      {division ?? intl.formatMessage(commonMessages.notAvailable)}
    </ContentSection>
  );
};

export default WorkContent;
