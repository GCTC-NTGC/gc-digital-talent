import { useIntl } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";

import { getExperienceFormLabels } from "~/utils/experienceUtils";

import ContentSection from "./ContentSection";
import type { ContentProps } from "./types";

interface CommunityContentExperience {
  project?: string | null;
}

const CommunityContent = ({
  experience: { project },
  headingLevel,
}: ContentProps<CommunityContentExperience>) => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <ContentSection
      title={experienceFormLabels.project}
      headingLevel={headingLevel}
    >
      {project ?? intl.formatMessage(commonMessages.notAvailable)}
    </ContentSection>
  );
};

export default CommunityContent;
